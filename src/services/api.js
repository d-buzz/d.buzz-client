import { api, auth } from '@hiveio/hive-js'
import { Promise } from 'bluebird'
import config from 'config'
import { v4 as uuidv4 } from 'uuid'

export const callBridge = async(method, params) => {
  return new Promise((resolve, reject) => {
    params = { "tag": `${config.TAG}`, ...params }
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
