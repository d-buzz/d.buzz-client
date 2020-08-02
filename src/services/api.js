import {
  api,
  auth,
  broadcast,
  config,
  formatter
} from '@hiveio/hive-js'
import { Promise, reject } from 'bluebird'
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
    api.call('bridge.' + method, params, async(err, data) => {
      if (err) {
        reject(err)
      }else {
        const result = data.filter((item) => invokeFilter(item))
        const getProfiledata = mapFetchProfile(result)
        await Promise.all([getProfiledata])
        resolve(result)
      }
    })
  })
}

// get_account_posts doesn't use tag
export const fetchAccountPosts = (account, start_permlink = '', start_author = '', sort = 'posts') => {
  return new Promise((resolve, reject) => {
    const params = {
      sort,
      account,
      observer: account,
      start_author: start_author || account,
      start_permlink,
    }

    api.call('bridge.get_account_posts', params, async(err, data) => {
      if(err) {
        reject(err)
      }else {
        let posts = data.filter((item) => invokeFilter(item))

        if(posts.length !== 0) {

          if(sort === 'posts') {

            const profileVisited = visited.map((profile) => profile.name === account)

            let profile = []

            if(profileVisited.length !== 0) {
              profile.push(profileVisited[0])
            } else {
              profile = await fetchProfile([account])
            }

            posts.map((item) => (
              item.profile = profile[0]
            ))

          } else {
            const getProfiledata = mapFetchProfile(posts)
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
    .then(async(replies) => {

      const getProfiledata = mapFetchProfile(replies)
      await Promise.all([getProfiledata])

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

export const fetchProfile = (username) => {
  return new Promise((resolve, reject) => {
    api.getAccountsAsync([...username])
      .then(async(result) => {

        result.forEach(async(item, index) => {
          const repscore = item.reputation
          result[index].reputation = repscore ? formatter.reputation(repscore) : 25
          const follow_count = await fetchFollowCount(item.name)
          result[index].follow_count = follow_count

          if(index === result.length - 1) {
            resolve(result)
          }
        })

      }).catch((error) => {
        reject(error)
      })
  })
}

export const mapFetchProfile = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      let count = 0

      let uniqueAuthors = [ ...new Set(data.map(item => item.author)) ]
      let profiles = []

      uniqueAuthors.forEach((item, index) => {
        const profileVisited = visited.filter((profile) => profile.name === item)
        if(profileVisited.length !== 0) {
          profiles.push(profileVisited[0])
          uniqueAuthors.splice(index, 1)
        }
      })

      const profilesFetch = await fetchProfile(uniqueAuthors)
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

export const fetchFollowers = (following, start_follower = '', limit = 20) => {
  return new Promise((resolve, reject) => {
    api.getFollowersAsync(following, start_follower, 'blog', limit)
      .then(async(result) => {
        if(result.length !== 0) {

          result.forEach((item, index) => {
            result[index].author = item.follower
          })

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


