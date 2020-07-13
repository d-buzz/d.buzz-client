import { api } from '@hiveio/hive-js'

export const callBridge = async(method, params) => {
  return new Promise((resolve, reject) => {
    api.call('bridge.' + method, params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
    })
  })
}