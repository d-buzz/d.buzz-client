import {
  api,
  auth,
  broadcast,
  config,
  formatter,
} from '@hiveio/hive-js'
import { hash } from '@hiveio/hive-js/lib/auth/ecc'
import { Promise, reject } from 'bluebird'
import { v4 as uuidv4 } from 'uuid'
import appConfig from 'config'
import axios from 'axios'
import getSlug from 'speakingurl'
import base58 from 'base58-encode'
import stripHtml from 'string-strip-html'
import fleek from '@fleekhq/fleek-storage-js'

const searchUrl = `${appConfig.SEARCH_API}/search`
const scrapeUrl = `${appConfig.SCRAPE_API}/scrape`

const endpoints = [
  'https://api.openhive.network',
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://api.pharesim.me',
  'https://hived.hive-engine.com',
  'https://rpc.esteem.app',
  'https://hived.privex.io',
  'https://techcoderx.com',
  'https://anyx.io',
]

api.setOptions({ url: 'https://api.hive.blog' })

config.set('alternative_api_endpoints', endpoints)

const visited = []

export const hashBuffer = (buffer) => {
  return hash.sha256(buffer)
}

const invokeFilter = (item) => {
  return (item.body.length <= 280 && item.category === `${appConfig.TAG}`)
}

export const callBridge = async(method, params) => {
  return new Promise((resolve, reject) => {
    params = { "tag": `${appConfig.TAG}`, limit: 5, ...params}

    api.call('bridge.' + method, params, async(err, data) => {
      if (err) {
        reject(err)
      }else {
        const result = data.filter((item) => invokeFilter(item))

        if(result.length !== 0) {
          const getProfiledata = mapFetchProfile(result, false)
          await Promise.all([getProfiledata])
        }
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
      start_author: start_author || account,
      start_permlink,
      limit: 30,
    }


    api.call('bridge.get_account_posts', params, async(err, data) => {
      if(err) {
        reject(err)
      }else {
        let posts = data.filter((item) => invokeFilter(item))

        if(posts.length !== 0) {

          if(sort === 'posts') {
            const profileVisited = visited.filter((profile) => profile.name === account)
            let profile = []

            if(profileVisited.length !== 0) {
              profile.push(profileVisited[0])
            } else {
              profile = await fetchProfile([account], false)
            }

            posts.map((item) => (
              item.profile = profile[0]
            ))

          } else {
            const getProfiledata = mapFetchProfile(posts, false)
            await Promise.all([getProfiledata])
          }

        } else {
          posts = []
        }

        resolve(posts)
      }
    })
  })
}


export const fetchTrendingTags = () => {
  return new Promise((resolve, reject) => {
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

export const fetchProfile2 = (username) => {
  return api.getAccountsAsync([username])
    .then(async(result) => {
      const repscore = result[0].reputation
      result[0].reputation = repscore ? formatter.reputation(repscore) : 25
      const follow_count = await fetchFollowCount(username)
      result[0].follow_count = follow_count
      return result
    }).catch((error) => {
      return error
    })
}

export const isFollowing = (follower, following) => {
  return new Promise((resolve, reject) => {
    const params = {"account":`${following}`,"start":`${follower}`,"type":"blog","limit":1}
    api.call('follow_api.get_followers', params, async(err, data) => {
      if (err) {
        reject(err)
      }else {
        if(data.length !== 0 && data[0].follower === follower) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

export const fetchProfile = (username, checkFollow = true) => {
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

export const mapFetchProfile = (data, checkFollow = true) => {
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
  return broadcast.voteAsync(wif, voter, author, permlink, weight)
    .then((result) => {
      return result
    }).catch((error) => {
      return error
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

          const getProfiledata = mapFetchProfile(result)
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
      .then((result) => {

        if(result.length === 1 && (result[0].following === start_following)) {
          resolve([])
        }

        if(result.length !== 0) {
          result.forEach(async(item, index) => {
            const profileVisited = visited.filter((profile) => profile.name === item.following)
            let profile = []

            if(profileVisited.length === 0) {
              profile = await fetchProfile([item.following])
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
  return new Promise((resolve) => {
    window.hive_keychain.requestVote(
      username,
      permlink,
      author,
      weight,
      response => {
        resolve(response)
      },
    )
  })
}

export const generateClearNotificationOperation = (username, lastNotification) => {
  return new Promise((resolve) => {

    const date = lastNotification.date
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

export const generatePostOperations = (account, title, body, tags) => {

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

    const max_accepted_payout = '1.000 HBD'

    const op_comment_options = [
      'comment_options',
      {
        'author': account,
        permlink,
        max_accepted_payout,
        'percent_steem_dollars': 5000,
        'allow_votes': true,
        'allow_curation_rewards': true,
        'extensions': [],
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
          reject(response.message)
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
          reject({
            success: false,
            error,
          })
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
    app: 'dBuzz/v1.0.0',
    // app: 'hiveph/v1.0.0',
    tags: uniqueTags,
  }

  return JSON.stringify(meta)
}

export const createPermlink = (title) => {
  let permlink = base58(slug(title) + Math.floor(Date.now() / 1000).toString(36))
  permlink = permlink.substring(0, 8) + permlink.substring(permlink.length-8, permlink.length)
  permlink = permlink.toLowerCase() + Math.floor(Date.now() / 1000).toString(36)

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
      if(data.results.length !== 0) {
        const getProfiledata = mapFetchProfile(data.results, false)
        data.results = data.results.filter((item) => item.body.length <= 280)
        await Promise.all([getProfiledata])
      }

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

export const uploadIpfsImage = async(data) => {
  const date = new Date()
  const timestamp = date.getTime()

  return new Promise(async(resolve, reject) => {
    try{
      const dataFile = {
        apiKey: appConfig.API_KEY,
        apiSecret: appConfig.API_SECRET,
        key:`dbuzz/file-${timestamp}`,
        data,
      }
      const result = await fleek.upload(dataFile)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

export const getLinkMeta = (url) => {
  return new Promise(async(resolve, reject) => {

    console.log({ url: `${scrapeUrl}?url=${url}` })

    axios.get(`${scrapeUrl}?url=${url}`)
      .then(function (result) {
        const data = result.data
        resolve(data)
      })
      .catch(function (error) {
        console.log({ error })
        reject(error)
      })
  })
}
