import { api, auth, broadcast, config, formatter } from '@hiveio/hive-js'
import { Promise } from 'bluebird'
import appConfig from 'config'
import { v4 as uuidv4 } from 'uuid'

const endpoints = [
  'https://api.openhive.network',
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://api.pharesim.me',
  'https://hived.hive-engine.com',
  'https://rpc.esteem.app',
  'https://hived.privex.io',
  'https://techcoderx.com'
]

config.set('alternative_api_endpoints', endpoints)
const visited = []

const invokeFilter = (item) => {
  return (item.body.length <= 280 && item.community === `${appConfig.TAG}`)
}

export const callBridge = async(method, params) => {
  return new Promise((resolve, reject) => {
    params = { "tag": `${appConfig.TAG}`, ...params }
    api.call('bridge.' + method, params, (err, data) => {
        if (err) {
          reject(err)
        }else {
          const result = data.filter((item) => invokeFilter(item))
          resolve(result)
        }
    })
  })
}

// get_account_posts doesn't use tag
export const fetchAccountPosts = (account, start_permlink = '', sort = 'posts') => {
  return new Promise((resolve, reject) => {
    const params = {
      sort,
      account,
      observer: account,
      start_author: account,
      start_permlink,
    }

    api.call('bridge.get_account_posts', params, async(err, data) => {
      if(err) {
        reject(err)
      }else {
        const profile = await fetchProfile(account)
        const posts = data.filter((item) => invokeFilter(item))

        posts.map((item) => (
          item.profile = profile[0]
        ))

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
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const fetchReplies = (author, permlink) => {
  return api.getContentRepliesAsync(author, permlink)
    .then((replies) => {
      return Promise.map(replies, async(reply) => {

        const getActiveVotes = new Promise((resolve) => {
          api.getActiveVotesAsync(reply.author, reply.permlink)
          .then((active_votes) => {
            resolve(active_votes)
          })
        })

        const active_votes = await Promise.all([getActiveVotes])

        let profile = []
        const profileVisited = visited.filter((item) => item.name === reply.author)

        if(profileVisited.length === 0) {
          profile = await fetchProfile(reply.author)
          visited.push(profile[0])
        } else {
          profile.push(profileVisited[0])
        }


        reply.active_votes = active_votes[0]
        reply.profile = profile[0]

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
  })
}

export const fetchProfile = (username) => {
  return api.getAccountsAsync([username])
    .then(async(result) => {
      const repscore = result[0].reputation
      result[0].reputation = repscore ? formatter.reputation(repscore) : 25
      const follow_count = await fetchFollowCount(username)
      result[0].follow_count = follow_count
      return result
    })
}

export const mapFetchProfile = (data) => {
  return new Promise((resolve, reject) => {
    let count = 0

    try {
      data.forEach(async(item, index) => {

        const profileVisited = visited.filter((profile) => profile.name === item.author)
        let profile = []

        if(profileVisited.length === 0) {
          profile = await fetchProfile(item.author)
          visited.push(profile[0])
        } else {
          profile.push(profileVisited[0])
        }

        data[index].profile = profile[0]
        count++

        if(count === (data.length - 1)) {
          resolve(true)
        }
      })
    } catch(error) {
      reject(error)
    }
  })
}

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
      }
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
      }
    )
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
    `${username}\t${password}`
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


