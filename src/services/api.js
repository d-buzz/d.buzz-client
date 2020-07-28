import { api, auth, broadcast, config } from '@hiveio/hive-js'
import { Promise } from 'bluebird'
import appConfig from 'config'
import { v4 as uuidv4 } from 'uuid'

const witnesses = [
  'https://api.openhive.network',
  'https://api.hive.blog',
  'https://api.hivekings.com',
  'https://api.pharesim.me',
  'https://hived.hive-engine.com',
  'https://rpc.esteem.app',
  'https://hived.privex.io',
  'https://techcoderx.com'
]

config.set('alternative_api_endpoints', witnesses)

export const callBridge = async(method, params) => {
  return new Promise((resolve, reject) => {
    params = { "tag": `${appConfig.TAG}`, ...params }
    api.call('bridge.' + method, params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
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
      return Promise.map(replies, (reply) => {
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
  return api.lookupAccountNamesAsync([username])
    .then((result) => {
      return result
    })
}

export const mapFetchProfile = (data) => {
  return new Promise((resolve, reject) => {
    let count = 0
    try {
      data.forEach((item, index) => {
        fetchProfile(item.author).then((profile) => {
          data[index].profile = profile[0]
          count++

          if(count === (data.length - 1)) {
            resolve(true)
          }
        })
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


