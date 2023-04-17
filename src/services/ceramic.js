import { ApolloClient, InMemoryCache } from '@apollo/client'

let axios

import('axios').then((Axios) => {
  axios = Axios
})

const hosts = [
  'https://ceramic.3speak.tv',
  'https://ceramic.web3telekom.xyz',
  'https://ceramic-node.vitalpointai.com',
]

export const unionIndexerClient = new ApolloClient({
  uri: 'https://spk-union.us-west.web3telekom.xyz/api/v1/graphq',
  cache: new InMemoryCache(),
});

export const getBestCeramicHost = async() => {
  const hostsWithTimes = []
  const times = []
  let fastestHost = 'https://ceramic.3speak.tv'
  await Promise.all(
    hosts.map(async (host) => {
      try {
        const start = Date.now()
        await axios.get(`${host}/api/v0/streams/kjzl6cwe1jw149xy2w2qycwts4xjpvyzrkptdw20iui7r486bd6sasqb9tgglzp`)
          .then(() => {
            const finish = Date.now()
            hostsWithTimes.push({host, time: (finish - start) / 1000})
            times.push((finish - start) / 1000)
          })
      } catch(err) { return }
    }))
    .then(() => {
      fastestHost = (hostsWithTimes.find(h => h.time === Math.min(...times))).host
    })
  return fastestHost
}

const normalizeAuthSecret = (authSecret64) => {
  const authSecret = new Uint8Array(32)
  for (let i = 0; i < authSecret.length; i++) {
    authSecret[i] = authSecret64[i]
  }
  return authSecret
}

const providerOptions = {
  /* See Provider Options Section */
}

let web3Modal
let web3

// dynamic imports

import('web3modal').then((Web3Modal) => {
  web3Modal = new Web3Modal.default({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  })
})

import('web3').then((Web3) => {
  web3 = new Web3.default()
})

const idxAliases = {
  rootPosts: 'ceramic://kjzl6cwe1jw149xy2w2qycwts4xjpvyzrkptdw20iui7r486bd6sasqb9tgglzp',
  socialConnectionIndex: 'ceramic://kjzl6cwe1jw145f1327br2k7lkd5acrn6d2omh88xjt70ovnju491moahrxddns',
}

export const API_NODE = 'https://us-01.infra.3speak.tv'

let Ceramic
let idx
let spk
// dynamic imports
import('@ceramicnetwork/http-client').then((CeramicNetwork) => {
  Ceramic = new CeramicNetwork.CeramicClient(localStorage.getItem('ceramic') || hosts[0])
})
import('@ceramicstudio/idx').then((CeramicStudio) => {
  idx = new CeramicStudio.IDX({ceramic: Ceramic, aliases: idxAliases})
})
import('@spknetwork/graph-client').then((SpkNetwork) => {
  spk = new SpkNetwork.SpkClient(API_NODE, Ceramic)
})

window.ceramicclient = Ceramic
window.idxclient = idx
window.spkclient = spk

const connectPrompt = async() => {
  let firstAccount = null
  try {
    const provider = await web3Modal.connect()
    web3.setProvider(provider)

    firstAccount = await web3.eth.getAccounts().then(data=>data[0])
  }
  catch(err) {
    console.log(err)
  }
  return firstAccount
}

const resloveEthDid = async(did) => {
  let proof
  let verified
  const account = await web3.eth.getAccounts().then(data=>data[0])

  await import('3id-blockchain-utils').then(async(utils) => {
    proof = await utils.createLink(did, `${account}@eip155:1`, web3.eth.currentProvider)
    verified = await utils.validateLink(proof)
  })

  // await authenticate(proof.message, `${account}@eip155:1`, web3.eth.currentProvider)

  return verified
}

export const authenticateWithCeramic = (did, secret) => {
  Ceramic.setDID(did)
  const ceramicAuth = {authDID: did.id, authSecret: secret}
  localStorage.setItem('ceramic.auth', JSON.stringify(ceramicAuth))
}

export const reauthenticateWithCeramic = async() => {
  const auth = JSON.parse(localStorage.getItem('ceramic.auth'))
  const secret = Object.values(auth.authSecret)
  const did = await createIdentity(secret)
  Ceramic.setDID(did)
}

const getCeramicAuth = () => {
  const ceramicAuth = localStorage.getItem('ceramic.auth')

  return ceramicAuth ? ceramicAuth : null
}

export const checkCeramicLogin = () => {
  const ceramicAuth = getCeramicAuth()
  return ceramicAuth
}

const createIdentity = async(authSecret) => {
  let provider
  let resolver
  import('key-did-provider-ed25519').then((keyDidProvider) => {
    provider = new keyDidProvider.Ed25519Provider(authSecret)
  })
  import('key-did-resolver').then((keyDidResolver) => {
    resolver = keyDidResolver.getResolver()
  })
  let did
  await import('dids').then((dids) => {
    did = new dids.DID({ provider, resolver })
  })

  await did.authenticate()

  return did
}

let hash
let fromString
import('@stablelib/sha256').then((SHA) => {
  hash = SHA.hash
})
import('uint8arrays').then((Unit8Arrays) => {
  fromString = Unit8Arrays.fromString
})

export const loginWithMetaMask = async() => {
  const account = await connectPrompt()
  const info = await web3.eth.personal.sign('Allow this account to control your identity', account)
  const authSecret = normalizeAuthSecret(hash(fromString(info.slice(2))))

  const did  = await createIdentity(authSecret)
  const proof = await resloveEthDid(did.id)

  if(proof) {
    authenticateWithCeramic(did, authSecret)
  }

  return proof ? did : null
}

export const checkForCeramicAccount = (account) => {
  return (account || '').startsWith('did:key:')
}

export const createPostRequest = async(did, title, body) => {
  return await spk.createDocument({
    app: 'dBuzz',
    title: title,
    body: body,
    debug_metadata: {
      user_id: did,
    },
  })
}

export const updatePostRequest = async(parentId, body) => {
  return await spk.updateDocument(parentId, {
    body: body,
  })
}
    
export const replyRequest = async(parentId, did, body) => {
  return await spk.createDocument({
    app: 'dBuzz',
    body: body,
    debug_metadata: {
      user_id: did,
    },
  }, parentId)
}


export const getUserPostRequest = async(did) => {
  const posts = []
  if(did) {
    const { data } = await axios.post(`${API_NODE}/v1/graphql`, {
      query: `
      {
          publicFeed(parent_id:null, creator_id:"${did}") {
            stream_id
            parent_id
            body
            title
            created_at
            updated_at
            app
            
            author {
              did
              name
              description
              location
              website
              images {
                avatar
                background
              }
            }
            children {
              stream_id
              version_id
              parent_id
              title
              body
              category
              lang
              type
              app
              json_metadata
              app_metadata
              community_ref
              author {
                did
                name
                description
                location
                website
                images {
                  avatar
                  background
                }
              }
            }
          }
        }
      `,
    })
    data.data.publicFeed.forEach(post => {
      if(post.app === 'dBuzz') {
        posts.push(post)
      }
    })
  }

  return {
    posts,
  }
}

export const getChildPostsRequest = async(parentId) => {
  const posts = []
  if(parentId) {
    const { data } = await axios.post(`${API_NODE}/v1/graphql`, {
      query: `
      {
          publicFeed(parent_id:"${parentId}") {
            stream_id
            parent_id
            title
            body
            created_at
            updated_at
            app
            
            author {
              did
              name
              description
              location
              website
              images {
                avatar
                background
              }
            }

            parent_post {
              stream_id
              version_id
              parent_id
              creator_id
              title
              body
              category
              lang
              type
              app
              json_metadata
              app_metadata
              debug_metadata
              community_ref
              created_at
              updated_at

              author {
                did
                name
              }
            }

            children {
              stream_id
              version_id
              parent_id
              title
              body
              category
              lang
              type
              app
              json_metadata
              app_metadata
              community_ref
              author {
                did
                name
                description
                location
                website
                images {
                  avatar
                  background
                }
              }
            }
          }
        }
      `,
    })
    data.data.publicFeed.forEach(post => {
      if(post.app === 'dBuzz') {
        posts.push(post)
      }
    })
  }
  return [
    ...posts,
  ]
}

export const getAllDocsFromSpk = async(did) => {
  const data = await spk.getDocumentsForUser(did)
  // console.log(data)
  return data
}

export const getSinglePost = async(streamId) => {
  const post = await spk.fetchDocument(streamId)
  const childPosts = await getChildPostsRequest(streamId)
  const profileData = await getBasicProfile(post.creatorId)

  // console.log(post)

  return { ...post, replies: childPosts, profile: profileData }
}

export const getBasicProfile = async(did) => {
  let profileData
  if(did) {
    const { data } = await axios.post(`${API_NODE}/v1/graphql`, {
      query: `
        {
          ceramicProfile(userId: "${did}") {
            did
            name
            description
            location
            website
            url
            
            images {
              avatar
              background
            }

          }
        }           
      `,
    })
    profileData = data.data.ceramicProfile
  }
  return profileData
}

export const setBasicProfile = async(profile) => {
  const ipfsHashRegex = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/i
  const { profile_image, cover_image, name, about, location, website } = profile
  const avatar = profile_image ? `ipfs://${profile_image.match(ipfsHashRegex)[0]}` : 'ipfs://QmVGUC79fcxsUF9f2QpkZUTcDBfu6TRxhF1cBQfCebetPW'
  const background = cover_image ? `ipfs://${cover_image.match(ipfsHashRegex)[0]}` : 'ipfs://QmbPjSv8rMASqmndSxcNGEyoc5QYTgQWwVAdZVfqc1ygBT'
  return await idx.set('basicProfile', {
    image: {
      original: {
        src: avatar || '',
        width: 2560,
        height: 3840,
        mimeType: 'image/jpeg',
      },
    },
    background: {
      original: {
        src: background || '',
        width: 2560,
        height: 3840,
        mimeType: 'image/jpeg',
      },
    },
    name: name || '',
    description: about || '',
    location: location ||'',
    url: website || '',
  })
}

export const getIpfsLink = (hash) => {
  return `https://ipfs.io/ipfs/${hash.replace('ipfs://', '')}`
}

export const getFollowingList = async(did) => {
  let following
  
  if(did) {
    const { data } = await axios.post(`${API_NODE}/v1/graphql`, {
      query: `
      {
        following(did: "${did}") {
          did,
          profile {
            did
            name
            description
            location
            url

            images {
              avatar
              background
            }
          }
        }
    }       
    `,
    })
    following = data.data.following
  }
  return following
}

export const getFollowersList = async(did) => {
  let followers
  
  if(did) {
    const { data } = await axios.post(`${API_NODE}/v1/graphql`, {
      query: `
      {
        followers(did: "${did}") {
          did,
          profile {
            did
            name
            description
            location
            url

            images {
              avatar
              background
            }
          }
        }
    }       
    `,
    })
    followers = data.data.followers
  }
  return followers
}

export const followUserRequest = async(did) => {
  const connections = await idx.get('socialConnectionIndex') || {}
  const key = `follow@${did}`
  let alreadyExisting = false
  for(const record of Object.values(connections)) {
    if(record.target === did) {
      alreadyExisting = true
    }
  }
  if(alreadyExisting) {
    throw new Error('Already following')
  }
  connections[key] = {
    target: did,
    target_type: 'did',
    created_at: new Date().toISOString(),
  }
  await idx.set('socialConnectionIndex', connections)
}

export const unFollowUserRequest = async(did) => {
  const connections = await idx.get('socialConnectionIndex') || {}
  for(const [key, record] of Object.entries(connections)) {
    if(record.target === did) {
      delete connections[key]
    }
  }
  await idx.set('socialConnectionIndex', connections)
}

export const getFollowingFeed = async (did) => {

  const feed = []

  if(did) {
    const { data } = await axios.post(`${API_NODE}/v1/graphql`, {
      query: `
      {
        followingFeed(did: "${did}") {
          stream_id
          parent_id
          body
          title
          created_at
          updated_at
          app
          
          author {
            did
            name
            description
            location
            website
            images {
              avatar
              background
            }
          }
          children {
            stream_id
            version_id
            parent_id
            title
            body
            category
            lang
            type
            app
            json_metadata
            app_metadata
            community_ref
            author {
              did
              name
              description
              location
              website
              images {
                avatar
                background
              }
            }
          }
        }
      }         
    `,
    })
    data.data.followingFeed.forEach(post => {
      if(post.app === 'dBuzz') {
        feed.push(post)
      }
    })
  }
  return feed
}