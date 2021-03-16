import {
  api,
  auth,
  broadcast,
  formatter,
} from '@hiveio/hive-js'
import { hash } from '@hiveio/hive-js/lib/auth/ecc'
import { Promise, reject } from 'bluebird'
import { v4 as uuidv4 } from 'uuid'
import appConfig from 'config'
import axios from 'axios'
import getSlug from 'speakingurl'
import stripHtml from 'string-strip-html'
import moment from 'moment'
import 'react-app-polyfill/stable'

const searchUrl = `${appConfig.SEARCH_API}/search`
const scrapeUrl = `${appConfig.SCRAPE_API}/scrape`
const imageUrl = `${appConfig.IMAGE_API}/image`
const censorUrl = `${appConfig.CENSOR_API}`

const visited = []

const setRPCNode = () => {
  const node = localStorage.getItem('rpc')
  api.setOptions({ url: node })
}


export const invokeMuteFilter = (items, mutelist, opacityUsers = []) => {
  return items.filter((item) => !mutelist.includes(item.author) || opacityUsers.includes(item.author))
}

export const hashBuffer = (buffer) => {
  return hash.sha256(buffer)
}

export const invokeFilter = (item) => {
  const body = stripHtml(item.body)
  return (body.length <= 280 && item.category === `${appConfig.TAG}`)
}

export const removeFootNote = (data) => {
  return data.forEach((item) => {
    item.body = item.body.replace('<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>', '')
    item.body = item.body.replace('<br /><br /> Posted via <a href="https://next.d.buzz/" data-link="promote-link">D.Buzz</a>', '')
  })
}

export const callBridge = async(method, params, appendParams = true) => {
  return new Promise((resolve, reject) => {

    if(appendParams) {
      params = { "tag": `${appConfig.TAG}`, limit: 5, ...params}
    }

    api.call('bridge.' + method, params, async(err, data) => {
      if (err) {
        reject(err)
      }else {
        let lastResult = []

        if(data.length !== 0) {
          lastResult = [data[data.length-1]]
        }

        removeFootNote(data)

        let result = data.filter((item) => invokeFilter(item))

        result = [...result, ...lastResult]

        resolve(result)
      }
    })
  })
}

export const searchPeople = (username) => {
  return new Promise((resolve, reject) => {
    const params = { account_lower_bound: username, limit: 30 }

    api.call('reputation_api.get_account_reputations', params, async(err, data) => {
      if (err) {
        reject(err)
      }else {

        if(data.reputations.length !== 0) {
          data.reputations.forEach((item, index) => {
            let score = item.reputation ? formatter.reputation(item.reputation) : 25
            if(!score || score < 25) {
              score = 25
            }
            data.reputations[index].repscore = score
            data.reputations[index].author = item.account
          })

          const getProfiledata = mapFetchProfile(data.reputations)
          await Promise.all([getProfiledata])
        }

        resolve(data)
      }
    })

  })
}


export const fetchDiscussions = (author, permlink) => {
  return new Promise((resolve, reject) => {
    const params = {"author":`${author}`, "permlink": `${permlink}`}
    api.call('bridge.get_discussion', params, async(err, data) => {
      if(err) {
        reject(err)
      } else {
        const authors = []
        let profile = []

        const arr = Object.values(data)
        const uniqueAuthors = [ ...new Set(arr.map(item => item.author)) ]

        uniqueAuthors.forEach((item) => {
          if(!authors.includes(item)) {
            const profileVisited = visited.filter((prof) => prof.name === item)
            if(!authors.includes(item) && profileVisited.length === 0) {
              authors.push(item)
            } else if(profileVisited.length !== 0) {
              profile.push(profileVisited[0])
            }
          }
        })

        if(authors.length !== 0 ) {
          const info = await fetchProfile(authors)
          profile = [ ...profile, ...info]
        }

        const parent = data[`${author}/${permlink}`]

        const getChildren = (reply) => {
          const { replies } = reply
          const children = []

          replies.forEach(async(item) => {
            let content = data[item]

            if(!content) {
              content = item
            }

            content.body = content.body.replace('<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>', '')
            content.body = content.body.replace('<br /><br /> Posted via <a href="https://next.d.buzz/" data-link="promote-link">D.Buzz</a>', '')

            if(content.replies.length !== 0) {
              const child = getChildren(content)
              content.replies = child
            }

            const info = profile.filter((prof) => prof.name === content.author)
            visited.push(info[0])
            content.profile = info[0]
            children.push(content)
          })

          return children
        }

        const children = getChildren(parent)
        parent.replies = children

        let replies = parent.replies
        replies = replies.reverse()
        resolve(replies)
      }
    })
  })
}

export const getUnreadNotificationsCount = async(account) => {
  return new Promise((resolve, reject) => {
    const params = { account }
    api.call('bridge.unread_notifications', params, (err, data) => {
      if(err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const getAccountNotifications = async(account) => {
  return new Promise((resolve, reject) => {
    const params = { account, limit:100 }
    api.call('bridge.account_notifications', params, (err, data) => {
      if(err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const getCommunityRole = async(observer) => {
  return new Promise((resolve, reject) => {
    const params = { "name": `${appConfig.TAG}`, observer }
    api.call('bridge.get_community', params, async(err, data) => {
      if (err) {
        reject(err)
      }else {
        resolve(data.context.subscribed)
      }
    })
  })
}

// get_account_posts doesn't use tag
export const fetchAccountPosts = (account, start_permlink = null, start_author = null, sort = 'posts') => {
  return new Promise((resolve, reject) => {
    const params = {
      sort,
      account,
      observer: account,
      start_author: start_author,
      start_permlink,
      limit: 100,
    }

    api.call('bridge.get_account_posts', params, async(err, data) => {
      if(err) {
        reject(err)
      }else {
        removeFootNote(data)

        let lastResult = []

        if(data.length !== 0) {
          lastResult = [data[data.length-1]]
        }

        let posts = data.filter((item) => invokeFilter(item))

        posts = [...posts, ...lastResult]

        if(posts.length === 0) {
          posts = []
        }
        resolve(posts)
      }
    })
  })
}


export const fetchTrendingTags = () => {
  return new Promise((resolve, reject) => {
    // set RPC node here because this is the first API call to execute
    setRPCNode()
    api.getTrendingTagsAsync(null, 100)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const fetchContent = (author, permlink) => {
  return new Promise((resolve, reject) => {
    api.getContentAsync(author, permlink)
      .then(async(result) => {
        result.body = result.body.replace('<br /><br /> Posted via <a href="https://d.buzz" data-link="promote-link">D.Buzz</a>', '')
        const profile = await fetchProfile([result.author])
        result.profile = profile[0]
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const fetchReplies = (author, permlink) => {
  api.setOptions({ url: 'https://api.hive.blog' })
  return api.getContentRepliesAsync(author, permlink)
    .then(async(replies) => {
      if(replies.length !== 0) {
        const getProfiledata = mapFetchProfile(replies)
        await Promise.all([getProfiledata])
      }

      return Promise.map(replies, async(reply) => {
        const getActiveVotes = new Promise((resolve) => {
          api.getActiveVotesAsync(reply.author, reply.permlink)
            .then((active_votes) => {
              resolve(active_votes)
            })
        })

        const active_votes = await Promise.all([getActiveVotes])
        reply.active_votes = active_votes[0]

        if (reply.children > 0) {
          return fetchReplies(reply.author, reply.permlink)
            .then((children) => {
              reply.replies = children
              return reply
            })
        } else {
          return reply
        }
      })
    }).catch((error) => {
      reject(error)
    })
}

export const isFollowing = (follower, following) => {
  return new Promise((resolve, reject) => {
    const params = [follower, following]
    api.call('bridge.get_relationship_between_accounts', params, (err, data) => {
      if (err) {
        reject(err)
      }else {
        const { follows } = data
        resolve(follows)
      }
    })
  })
}

export const fetchGlobalProperties = () => {
  return new Promise((resolve, reject) => {
    api.getDynamicGlobalProperties((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export const fetchSingleProfile = (account) => {
  const user = localStorage.getItem('active')

  return new Promise((resolve, reject) => {
    const params = {account}
    api.call('bridge.get_profile', params, async(err, data) => {
      if (err) {
        reject(err)
      }else {
        let isFollowed = false

        if(user && `${user}`.trim() !== '') {
          // const { username } = readSession(user)
          if(user !== data.name) {
            isFollowed = await isFollowing(user, data.name)
          }
        }

        data.isFollowed = isFollowed

        resolve(data)
      }
    })
  })
}

export const fetchAccounts = (username) => {
  return new Promise((resolve, reject) => {
    api.getAccountsAsync([username])
      .then(async(result) => {
        resolve(result)
      }).catch((error) => {
        reject(error)
      })
  })
}

export const fetchProfile = (username, checkFollow = false) => {
  const user = JSON.parse(localStorage.getItem('user'))

  return new Promise((resolve, reject) => {
    api.getAccountsAsync(username)
      .then(async(result) => {
        result.forEach(async(item, index) => {
          const repscore = item.reputation
          let score = formatter.reputation(repscore)

          if(!score || score < 25) {
            score = 25
          }

          result[index].reputation = score

          if(checkFollow) {

            const follow_count = await fetchFollowCount(item.name)
            result[index].follow_count = follow_count

            let isFollowed = false

            if(user) {
              isFollowed = await isFollowing(user.username, item.name)
            }

            result[index].isFollowed = isFollowed
          }

          visited.push(result[index])

          if(index === result.length - 1) {
            resolve(result)
          }
        })

      }).catch((error) => {
        reject(error)
      })
  })
}

export const mapFetchProfile = (data, checkFollow = false) => {
  return new Promise(async(resolve, reject) => {
    try {
      let count = 0
      const uniqueAuthors = [ ...new Set(data.map(item => item.author)) ]
      let profiles = []

      uniqueAuthors.forEach((item, index) => {
        const profileVisited = visited.filter((profile) => profile.name === item)
        if(profileVisited.length !== 0) {
          profiles.push(profileVisited[0])
          uniqueAuthors.splice(index, 1)
        }
      })

      let profilesFetch = []

      if(uniqueAuthors.length !== 0) {
        profilesFetch = await fetchProfile(uniqueAuthors, checkFollow)
      }

      profiles = [...profiles, ...profilesFetch]

      data.forEach(async(item, index) => {
        const info = profiles.filter((profile) => profile.name === item.author)
        data[index].profile = info[0]

        if(count === (data.length - 1)) {
          resolve(true)
        }

        count += 1
      })
    } catch(error) {
      reject(error)
    }
  })
}


export const isWifValid = (password, pubWif) => {
  return auth.wifIsValid(password, pubWif)
}

export const generateWif = (username, password, role) => {
  return auth.toWif(username, password, role)
}

export const fetchFeedHistory = () => {
  return api.getFeedHistoryAsync()
    .then((result) => {
      return result
    }).catch((error) => {
      return error
    })
}

export const fetchRewardFund = (username) => {
  return api.getRewardFundAsync(username)
    .then((result) => {
      return result
    }).catch((error) => {
      return error
    })
}

export const broadcastVote = (wif, voter, author, permlink, weight) => {
  // api.setOptions({ url: 'https://anyx.io' })

  return new Promise((resolve, reject) => {
    broadcast.voteAsync(wif, voter, author, permlink, weight)
      .then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(error.code)
        let code = error.code
        if(error.code === -32000){
          if(error.message && error.message.includes('paid out is forbidden')){
            code = -32001
          }
        }
        reject(code)
      })
  })
}

export const wifToPublic = (privWif) => {
  return auth.wifToPublic(privWif)
}

export const generateKeys = (username, password, role) => {
  return auth.generateKeys(username, password, role)
}

export const packLoginData = (username, password) => {
  return new Buffer(
    `${username}\t${password}`,
  ).toString('hex')
}

export const extractLoginData = (data) => {
  return new Buffer(data, 'hex').toString().split('\t')
}

export const fetchFollowCount = (username) => {
  return api.getFollowCountAsync(username)
    .then((result) => {
      return result
    })
    .catch((error) => {
      return error
    })
}

export const fetchMuteList = (user) => {
  return new Promise((resolve, reject) => {
    api.call('condenser_api.get_following', [user, null, 'ignore', 1000], async(err, data) => {
      if (err) {
        reject(err)
      }else {
        resolve(data)
      }
    })
  })
}

export const fetchFollowers = (following, start_follower = '', limit = 10) => {
  return new Promise((resolve, reject) => {
    api.getFollowersAsync(following, start_follower, 'blog', limit)
      .then(async(result) => {
        if(result.length !== 0) {

          result.forEach((item, index) => {
            result[index].author = item.follower
          })

          if(result.length === 1 && (result[0].follower === start_follower)) {
            resolve([])
          }

          const getProfiledata = mapFetchProfile(result, false)
          await Promise.all([getProfiledata])

          resolve(result)
        } else {
          resolve(result)
        }
      })
      .catch((error) => {
        reject(error)
      })

  })
}

export const fetchFollowing = (follower, start_following = '', limit = 20) => {
  return new Promise((resolve, reject) => {
    let iterator = 0

    api.getFollowingAsync(follower, start_following, 'blog', limit)
      .then(async(result) => {

        if(result.length === 1 && (result[0].following === start_following)) {
          resolve([])
        }

        if(result.length !== 0) {
          result.forEach(async(item, index) => {
            const profileVisited = visited.filter((profile) => profile.name === item.following)
            let profile = []

            if(profileVisited.length === 0) {
              profile = await fetchProfile([item.following], false)
              visited.push(profile[0])
            } else {
              profile.push(profileVisited[0])
            }

            result[index].profile = profile[0]

            if(iterator === (result.length-1)) {
              resolve(result)
            }

            iterator += 1
          })
        } else {
          resolve(result)
        }
      })
      .catch((error) => {
        reject(error)
      })

  })
}

// keychain apis

export const keychainSignIn = (username) => {
  const challenge = { token: uuidv4() }
  const buffer = JSON.stringify(challenge, null, 0)

  return new Promise((resolve) => {
    window.hive_keychain.requestSignBuffer(
      username,
      buffer,
      'Posting',
      response => {
        resolve(response)
      },
    )
  })
}

export const keychainUpvote = (username, permlink, author, weight) => {
  return new Promise((resolve, reject) => {
    window.hive_keychain.requestVote(
      username,
      permlink,
      author,
      weight,
      response => {
        if(response.success) {
          resolve(response)
        } else {
          let code = response.error.code
          if(response.error.code === -32000){
            if(response.message && response.message.includes('paid out is forbidden')){
              code = -32001
            }
          }
          reject(code)
        }
      },
    )
  })
}

export const generateClearNotificationOperation = (username, lastNotification) => {
  return new Promise((resolve) => {

    // const date = lastNotification.date
    let date = moment().utc().format()
    date = `${date}`.replace('Z', '')

    const json = JSON.stringify(["setLastRead",{ date }])

    const operation = [
      [
        'custom_json',
        {
          'required_auths': [],
          'required_posting_auths': [username],
          'id': 'notify',
          json,
        },
      ],
    ]

    resolve(operation)
  })
}

export const generateMuteOperation = (follower, following) => {
  return new Promise((resolve) => {
    const json = JSON.stringify(["follow",{"follower":`${follower}`,"following":`${following}`,"what":["ignore"]}])

    const operation = [
      [
        'custom_json',
        {
          'required_auths': [],
          'required_posting_auths': [follower],
          'id': 'follow',
          json,
        },
      ],
    ]

    resolve(operation)
  })
}

export const generateFollowOperation = (follower, following) => {
  return new Promise((resolve) => {
    const json = JSON.stringify(["follow",{"follower":`${follower}`,"following":`${following}`,"what":["blog"]}])

    const operation = [
      [
        'custom_json',
        {
          'required_auths': [],
          'required_posting_auths': [follower],
          'id': 'follow',
          json,
        },
      ],
    ]

    resolve(operation)
  })
}

export const generateUnfollowOperation = (follower, following) => {
  return new Promise((resolve) => {
    const json = JSON.stringify(["follow",{"follower":`${follower}`,"following":`${following}`,"what":[]}])

    const operation = [
      [
        'custom_json',
        {
          'required_auths': [],
          'required_posting_auths': [follower],
          'id': 'follow',
          json,
        },
      ],
    ]

    resolve(operation)
  })
}

export const generateSubscribeOperation = (username) => {
  return new Promise((resolve) => {
    const json = JSON.stringify(["subscribe",{ "community": `${appConfig.TAG}` }])

    const operation = [
      [
        'custom_json',
        {
          'required_auths': [],
          'required_posting_auths': [username],
          'id': 'community',
          json,
        },
      ],
    ]

    resolve(operation)
  })
}


export const generateUpdateOperation = (parent_author, parent_permlink, author, permlink, title, body, json_metadata) => {

  return new Promise((resolve) => {
    const op_comment = [[
      'comment',
      {
        parent_author,
        parent_permlink,
        author,
        permlink,
        title,
        body,
        json_metadata,
      },
    ]]

    resolve(op_comment)
  })
}

export const generateReplyOperation = (account, body, parent_author, parent_permlink) => {

  const json_metadata = createMeta()
  let permlink = createPermlink(body.substring(0, 100))
  permlink = `re-${permlink}`
  return new Promise((resolve) => {

    const op_comment = [[
      'comment',
      {
        'author': account,
        'title': '',
        'body': `${body.trim()}`,
        parent_author,
        parent_permlink,
        permlink,
        json_metadata,
      },
    ]]

    resolve(op_comment)
  })
}

export const generatePostOperations = (account, title, body, tags, payout) => {

  const json_metadata = createMeta(tags)

  const permlink = createPermlink(title)

  const operations = []

  return new Promise((resolve) => {
    const op_comment = [
      'comment',
      {
        'author': account,
        'title': stripHtml(title),
        'body': `${body.trim()}`,
        'parent_author': '',
        'parent_permlink': `${appConfig.TAG}`,
        permlink,
        json_metadata,
      },
    ]

    operations.push(op_comment)

    const max_accepted_payout = `${payout.toFixed(3)} HBD`
    const extensions = []


    if(payout === 0) {
      extensions.push([
        0,
        { beneficiaries:
          [
            { account: 'null', weight: 10000 },
          ],
        },
      ])
    }


    const op_comment_options = [
      'comment_options',
      {
        'author': account,
        permlink,
        max_accepted_payout,
        'percent_hbd': 5000,
        'allow_votes': true,
        'allow_curation_rewards': true,
        extensions,
      },
    ]

    operations.push(op_comment_options)

    resolve(operations)
  })

}

export const broadcastKeychainOperation = (account, operations, key = 'Posting') => {
  return new Promise((resolve, reject) => {
    window.hive_keychain.requestBroadcast(
      account,
      operations,
      key,
      response => {
        if(!response.success) {
          reject(response.error.code)
        } else {
          resolve(response)
        }
      },
    )
  })
}

export const broadcastOperation = (operations, keys) => {

  return new Promise((resolve, reject) => {
    broadcast.send(
      {
        extensions: [],
        operations,
      },
      keys,
      (error, result) => {
        if(error) {
          reject(error.code)
        } else {
          resolve({
            success: true,
            result,
          })
        }
      },
    )
  })
}

export const slug = (text) => {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 })
}

export const createMeta = (tags = []) => {

  const uniqueTags = [ ...new Set(tags.map(item => item.text)) ]

  const meta = {
    app: 'dBuzz/v3.0.0',
    // app: 'hiveph/v1.0.0',
    tags: uniqueTags,
  }

  return JSON.stringify(meta)
}

export const createPermlink = (title) => {
  const permlink = new Array(22).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)})
  return permlink
}


export const searchPostTags = (tag) => {
  return new Promise(async(resolve, reject) => {
    const body = { tag }

    axios({
      method: 'POST',
      url: `${searchUrl}/tags`,
      data: body,
    }).then(async(result) => {
      const data = result.data

      data.results = data.results.filter(item => invokeFilter(item))
      removeFootNote(data.results)

      resolve(data)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const searchPostAuthor = (author) => {
  return new Promise(async(resolve, reject) => {
    const body = { author }

    axios({
      method: 'POST',
      url: `${searchUrl}/author`,
      data: body,
    }).then(async(result) => {
      const data = result.data

      if(data.results.length !== 0) {
        const getProfiledata = mapFetchProfile(data.results, false)
        await Promise.all([getProfiledata])
        data.results = data.results.filter((item) => item.body.length <= 280)
      }

      resolve(data)
    }).catch((error) => {
      reject(error)
    })

  })
}

export const searchPostGeneral = (query) => {
  return new Promise(async(resolve, reject) => {
    const body = { query }

    axios({
      method: 'POST',
      url: `${searchUrl}/query`,
      data: body,
    }).then(async(result) => {
      const data = result.data

      if(data.results.length !== 0) {
        const getProfiledata = mapFetchProfile(data.results, false)
        await Promise.all([getProfiledata])
        data.results = data.results.filter((item) => item.body.length <= 280)
      }

      resolve(data)
    }).catch((error) => {
      reject(error)
    })

  })
}

export const checkIfImage = (links) => {
  return new Promise(async(resolve, reject) => {

    const params = { links }

    const result = await axios.post(`${scrapeUrl}/generate`, params)

    resolve(result.data)
  })
}

export const uploadIpfsImage = async(data) => {
  const formData = new FormData()
  formData.append('image', data)

  return new Promise(async(resolve, reject) => {
    axios({
      method: 'POST',
      url: `${imageUrl}/upload`,
      key: 'image',
      headers: {'Content-Type': 'multipart/form-data' },
      data: formData,
    }).then(async(result) => {
      const data = result.data
      resolve(data)

    }).catch((error) => {
      reject(error)
    })
  })
}

export const getLinkMeta = (url) => {
  return new Promise(async(resolve, reject) => {

    axios.get(`${scrapeUrl}?url=${url}`)
      .then(function (result) {
        const data = result.data
        resolve(data)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export const getBestRpcNode = () => {
  return new Promise((resolve) => {
    axios.get('https://beacon.peakd.com/api/best')
      .then(function (result) {
        resolve(result.data[0].endpoint)
      })
      .catch(function (error) {
        resolve('https://api.hive.blog')
      })
  })
}

export const checkVersion = () => {
  return new Promise((resolve) => {
    axios.get('https://d.buzz/version.json')
      .then(function (result) {
        resolve(result.data)
      })
  })
}

export const getKeyPair = () => {
  return new Promise((resolve) => {
    axios.get(`${censorUrl}/keypair`)
      .then(function (result) {
        resolve(result.data)
      })
  })
}

export const getCensorTypes = () => {
  return new Promise((resolve) => {
    axios.get(`${censorUrl}/types`)
      .then(function (result) {
        resolve(result.data)
      })
  })
}

export const censorBuzz = (author, permlink, type, signature) => {
  return new Promise((resolve) => {
    const params = { author, permlink, type, signature }
    axios.post(`${censorUrl}/add`, params)
      .then((response) => {
        resolve(response.data)
      }, (error) => {
        reject(error)
      })
  })
}

export const getCensoredList = () => {
  return new Promise((resolve) => {
    axios.get(`${censorUrl}/list`)
      .then(function (result) {
        resolve(result.data)
      })
  })
}
