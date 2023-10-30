import { ApolloClient, InMemoryCache } from '@apollo/client'
import { isMobile } from 'react-device-detect'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import Web3 from 'web3'
import * as Web3Modal from 'web3modal'
import * as SpkNetwork from '@spknetwork/graph-client'
import axios from "axios"
import { CeramicClient } from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { fromString } from 'uint8arrays'
import { hash } from '@stablelib/sha256'
import { TileDocument } from '@ceramicnetwork/stream-tile'

// const hosts = [
//   'https://ceramic.3speak.tv',
//   'https://ceramic.web3telekom.xyz',
//   'https://ceramic-node.vitalpointai.com',
// ]

export const unionIndexerClient = new ApolloClient({
  uri: 'https://union.us-02.infra.3speak.tv/api/v2/graphql',
  cache: new InMemoryCache(),
})

export const getBestCeramicHost = async() => {
  const fastestHost = 'https://ceramic.3speak.tv'
  return fastestHost
}

const normalizeAuthSecret = (authSecret64) => {
  const authSecret = new Uint8Array(32)
  for (let i = 0; i < authSecret.length; i++) {
    authSecret[i] = authSecret64[i]
  }
  return authSecret
}

const web3Modal = new Web3Modal.default({
  network: "mainnet",
  cacheProvider: true,
  providerOptions: {},
})

const web3 = new Web3()

const idxAliases = {
  rootPosts: 'ceramic://kjzl6cwe1jw149xy2w2qycwts4xjpvyzrkptdw20iui7r486bd6sasqb9tgglzp',
  socialConnectionIndex: 'ceramic://kjzl6cwe1jw145f1327br2k7lkd5acrn6d2omh88xjt70ovnju491moahrxddns',
}

export const SPK_INDEXER_HOST = 'https://offchain.us-02.infra.3speak.tv'

const ceramicClient = new CeramicClient('https://ceramic.us-02.infra.3speak.tv')
const spk = new SpkNetwork.SpkClient(SPK_INDEXER_HOST, ceramicClient)
const idx = new IDX({ceramic: ceramicClient, aliases: idxAliases})

window.ceramicclient = ceramicClient
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


// const resolveEthDid = async(did, provider) => {
//   const account = await provider.getAccounts().then(data=>data[0])

//   const proof = await utils.createLink(did, `${account}@eip155:1`, provider.currentProvider)
//   const verified = await utils.validateLink(proof)

//   await authenticate(proof.message, `${account}@eip155:1`, provider.currentProvider)

//   return verified
// }

export const authenticateWithCeramic = (did, secret) => {
  ceramicClient.setDID(did)
  const ceramicAuth = {authDID: did.id, authSecret: secret}
  localStorage.setItem('ceramic.auth', JSON.stringify(ceramicAuth))
}

export const reauthenticateWithCeramic = async() => {
  const auth = JSON.parse(localStorage.getItem('ceramic.auth'))
  const secret = Object.values(auth.authSecret)
  const did = await createIdentity(secret)
  ceramicClient.setDID(did)
}

const getCeramicAuth = () => {
  const ceramicAuth = localStorage.getItem('ceramic.auth')

  return ceramicAuth ? ceramicAuth : null
}

export const checkCeramicLogin = () => {
  const ceramicAuth = getCeramicAuth()
  return ceramicAuth
}

const createIdentity = async(seed) => {
  try {
    const provider = new Ed25519Provider(seed)
    const did = new DID({ provider, resolver: getResolver() })
    await did.authenticate()
    return did
  }
  catch(err) {
    console.log(err)
  }
}

export const loginWithMetaMask = async() => {
  let signedMessage

  const walletConnectProvider = await EthereumProvider.init({
    projectId: '686fee168a35f3cd368400c22a86860a',
    chains: [1],
    showQrModal: true,
    methods: ['personal_sign', 'eth_requestAccounts'],
    events: [],
    qrModalOptions: {
      themeMode: 'light',
      themeVariables: {
        "--wcm-z-index": 9999,
      },
    },
  })

  if (!isMobile) {
    const account = await connectPrompt()
    if (account) {
      signedMessage = await web3.eth.personal.sign('Allow this account to control your identity', account)
    }
  } else {
    try {
      await walletConnectProvider.connect()
      const accounts = await walletConnectProvider.request({ method: 'eth_requestAccounts' })
      const account= accounts[0]
      signedMessage = await walletConnectProvider.request({ method: 'personal_sign', params: ['Allow this account to control your identity', account] })
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const authSecret = normalizeAuthSecret(hash(fromString(signedMessage.slice(2))))
  const did = await createIdentity(authSecret)

  if(did) {
    authenticateWithCeramic(did, authSecret)
  }

  return did ? did : 0
}

export const checkForCeramicAccount = (account) => {
  return (account || '').startsWith('did:key:')
}


export const createPostRequest = async(did, body) => {
  try {
    return await spk.createDocument({
      title: '',
      body: body,
      json_metadata: {
        app: 'dBuzz',
      },
      debug_metadata: {
        did: did,
      },
      app: 'dBuzz',
    }, null)
  }
  catch(err) {
    console.log(err.message)
  }
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

export const generateHiveCeramicParentId = async (author, permlink) => {
  return (await axios.post("https://union.us-02.infra.3speak.tv/api/v1/create_stream_id", {
    author,
    permlink,
  })).data?.stream_id
}


export const getUserPostRequest = async(did) => {
  const posts = []
  if(did) {
    const { data } = await axios.post(`${SPK_INDEXER_HOST}/v1/graphql`, {
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
    const { data } = await axios.post(`${SPK_INDEXER_HOST}/v1/graphql`, {
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
    const { data } = await axios.post(`${SPK_INDEXER_HOST}/v1/graphql`, {
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

export const getIpfsLink = (hash='') => {
  if(!!hash) {
    if(hash.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${hash.replace('ipfs://', '')}`
    } else {
      return hash
    }
  }
}

export const getFollowingList = async(did) => {
  let following
  
  if(did) {
    const { data } = await axios.post(`${SPK_INDEXER_HOST}/v1/graphql`, {
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
    const { data } = await axios.post(`${SPK_INDEXER_HOST}/v1/graphql`, {
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
    const { data } = await axios.post(`${SPK_INDEXER_HOST}/v1/graphql`, {
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