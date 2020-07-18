import { api } from '@hiveio/hive-js'
import { Promise } from 'bluebird'

export const callBridge = async(method, params) => {
  return new Promise((resolve, reject) => {
    api.call('bridge.' + method, params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
    })
  })
}

export const fetchReplies = function (author, permlink) {
  return api.getContentRepliesAsync(author, permlink)
    .then(function (replies) {
      return Promise.map(replies, function (reply) {
        if (reply.children > 0) {
          return fetchReplies(reply.author, reply.permlink)
            .then(function (children) {
              reply.replies = children
              return reply
            })
        } else {
          return reply
        }
    })
  })
}