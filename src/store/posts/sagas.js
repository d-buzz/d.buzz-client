import { select, call, put, takeEvery } from "redux-saga/effects"
import {
  GET_REPLIES_REQUEST,
  getRepliesSuccess,
  getRepliesFailure,

  GET_CONTENT_REQUEST,
  getContentSuccess,
  getContentFailure,

  GET_TRENDING_POSTS_REQUEST,
  getTrendingPostsSuccess,
  getTrendingPostsFailure,
  setTrendingLastPost,

  GET_HOME_POSTS_REQUEST,
  getHomePostsSuccess,
  getHomePostsFailure,
  setHomeLastPost,

  GET_LATEST_POSTS_REQUEST,
  getLatestPostsSuccess,
  getLatestPostsFailure,
  setLatestLastPost,

  GET_TRENDING_TAGS_REQUEST,
  getTrendingTagsSuccess,
  getTrendingTagsFailure,

  UPVOTE_REQUEST,
  upvoteSuccess,
  upvoteFailure,

  UPLOAD_FILE_REQUEST,
  uploadFileSuccess,
  uploadFileError,

  PUBLISH_POST_REQUEST,
  publishPostSuccess,
  publishPostFailure,

  PUBLISH_REPLY_REQUEST,
  publishReplySuccess,
  publishReplyFailure,

  GET_SEARCH_TAG_REQUEST,
  getSearchTagsSuccess,
  getSearchTagFailure,
  setLastSearchTag,
} from './actions'

import {
  callBridge,
  fetchReplies,
  fetchContent,
  fetchTrendingTags,
  fetchProfile,
  extractLoginData,
  broadcastVote,
  keychainUpvote,
  uploadImage,
  generatePostOperations,
  broadcastOperation,
  broadcastKeychainOperation,
  generateReplyOperation,
} from 'services/api'
import stripHtml from 'string-strip-html'
import { Signature, hash } from '@hiveio/hive-js/lib/auth/ecc'

function* getRepliesRequest(payload, meta) {
  const { author, permlink } = payload
  try {
    const data = yield call(fetchReplies, author, permlink)

    yield put(getRepliesSuccess(data, meta))
  } catch(error) {
    yield put(getRepliesFailure(error, meta))
  }
}

function* getContentRequest(payload, meta) {
  const { author, permlink } = payload
  try {
    const data = yield call(fetchContent, author, permlink)
    const profile = yield call(fetchProfile, [author])
    data.profile = profile[0]
    yield put(getContentSuccess(data, meta))
  } catch(error) {
    yield put(getContentFailure(error, meta))
  }
}

function* getTrendingTagsRequests(meta) {
  try {
    let data = yield call(fetchTrendingTags)

    data = data.filter((tag) => !tag.name.includes('hive') && !tag.name.split('')[1].match(new RegExp('^\\d+$')))

    yield put(getTrendingTagsSuccess(data, meta))
  } catch (error) {
    yield put(getTrendingTagsFailure(error, meta))
  }
}

function* getTrendingPostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload

  const params = { sort: 'trending', start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('trending'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    yield put(setTrendingLastPost(data[data.length-1]))
    yield put(getTrendingPostsSuccess(data, meta))
  } catch(error) {
    yield put(getTrendingPostsFailure(error, meta))
  }
}

function* getHomePostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload

  const params = { sort: 'trending', start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('home'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    yield put(setHomeLastPost(data[data.length-1]))
    yield put(getHomePostsSuccess(data, meta))
  } catch(error) {
    yield put(getHomePostsFailure(error, meta))
  }
}

function* getLatestPostsRequest(payload, meta) {
  const { start_permlink, start_author } = payload

  const params = { sort: 'created', start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('latest'))
    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    yield put(setLatestLastPost(data[data.length-1]))
    yield put(getLatestPostsSuccess(data, meta))
  } catch(error) {
    yield put(getLatestPostsFailure(error, meta))
  }
}

function* upvoteRequest(payload, meta) {

  try {
    const { author, permlink, percentage } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, is_authenticated, useKeychain } = user
    const weight = percentage * 100

    if(is_authenticated) {
      if(useKeychain) {
        try {
          yield call(keychainUpvote, username, permlink, author, weight)
          yield put(upvoteSuccess(meta))
        } catch(error) {
          yield put(upvoteFailure(error, meta))
        }
      } else {
        let { login_data } = user
        login_data = extractLoginData(login_data)
        const wif = login_data[1]

        yield call(broadcastVote, wif, username, author, permlink, weight)
        yield put(upvoteSuccess(meta))
      }
    } else {
      yield put(upvoteFailure('Unauthenticated', meta))
    }

  } catch(error) {
    yield put(upvoteFailure(error, meta))
  }
}

function* fileUploadRequest(payload, meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const old = yield select(state => state.posts.get('images'))
    const { username, is_authenticated, useKeychain } = user
    const { file } = payload

    if(is_authenticated) {
      let data

    if(file) {
      const reader = new FileReader()
      data = yield new Promise((resolve) => {
          reader.addEventListener('load', () => {
            const result = new Buffer(reader.result, 'binary')
            resolve(result)
          })
          reader.readAsBinaryString(file)
        })
      }

      const formData = new FormData()
      formData.append('file', file)

      const prefix = new Buffer('ImageSigningChallenge');
      const buf = Buffer.concat([prefix, data]);
      const bufSha = hash.sha256(buf)

      let sig

      if(useKeychain) {
        const response = yield new Promise(resolve => {
            window.hive_keychain.requestSignBuffer(
                username,
                JSON.stringify(buf),
                'Posting',
                response => {
                    resolve(response)
                }
            );
        });

        if (response.success) {
          sig = response.result
        }

      } else {
        let { login_data } = user
        login_data = extractLoginData(login_data)
        const wif = login_data[1]
        sig = Signature.signBufferSha256(bufSha, wif).toHex()
      }

      const postUrl = `https://images.hive.blog/${username}/${sig}`
      const result = yield call(uploadImage, postUrl, formData)

      let images = []

      if(Array.isArray(old) && old.length !== 0) {
        images = [ ...old ]
      }

      images.push(result.data.url)

      yield put(uploadFileSuccess(images, meta))
    } else {
      yield put(uploadFileError('authentication required', meta))
    }
  } catch (error) {
    yield put(uploadFileError(error, meta))
  }
}

function* publishPostRequest(payload, meta) {
  try {
    const { body } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user
    let title = stripHtml(body)

    if(title.length > 70) {
      title = `${title.substr(0, 70)} ...`
    }

    const operations = yield call(generatePostOperations, username, title, body)

    let success = false
    const comment_options = operations[1]
    let permlink = comment_options[1].permlink

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operations)
      success = result.success

      if(!success) {
        yield put(publishPostFailure('Unable to publish post', meta))
      }

    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operations, [wif])

      success = result.success
    }

    const data = {
      success,
      author: username,
      permlink,
    }

    yield put(publishPostSuccess(data, meta))
  } catch (error) {
    yield put(publishPostFailure(error, meta))
  }
}

function* publishReplyRequest(payload, meta) {
  try {
    const { parent_author, parent_permlink, body, ref, treeHistory } = payload
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user

    let replyData = {}

    let success = false
    const operation = yield call(generateReplyOperation, username, body, parent_author, parent_permlink)

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result.success
    }

    if(success) {
      const meta = operation[0]
      const reply = yield call(fetchContent, username, meta[1].permlink)
      const profile = yield call(fetchProfile, [username])
      reply.profile = profile[0]
      reply.refMeta = {
        ref,
        author: parent_author,
        permlink: parent_permlink,
        treeHistory
      }
      replyData = reply
    }

    const data = {
      success,
      reply: replyData,
    }

    yield put(publishReplySuccess(data, meta))
  } catch(error) {
    yield put(publishReplyFailure(error, meta))
  }
}

function* getSearchTags(payload, meta) {
  try {
    const { tag, start_permlink, start_author } = payload
    let old = yield select(state => state.posts.get('searchTag'))
    const params = { sort: 'trending', tag, start_permlink, start_author }
    const method = 'get_ranked_posts'


    let data = yield call(callBridge, method, params)

    data = [...old, ...data]

    let last = data[data.length-1]
    if(data.length === 0) {
      last = {}
    }

    yield put(setLastSearchTag(last))
    yield put(getSearchTagsSuccess(data, meta))
  } catch(error) {
    yield put(getSearchTagFailure(error, meta))
  }
}


function* watchGetRepliesRequest({ payload, meta }) {
  yield call(getRepliesRequest, payload, meta)
}

function* watchGetContentRequest({ payload, meta }) {
  yield call(getContentRequest, payload, meta)
}

function* watchGetTrendingTagsRequest({ meta }) {
  yield call(getTrendingTagsRequests, meta)
}

function* watchGetTrendingPostsRequest({ payload, meta }) {
  yield call(getTrendingPostsRequest, payload, meta)
}

function* watchGetHomePostsRequest({ payload, meta }) {
  yield call(getHomePostsRequest, payload, meta)
}

function* watchGetLatestPostsRequest({payload, meta}) {
  yield call(getLatestPostsRequest, payload, meta)
}

function* watchUpvoteRequest({ payload, meta }) {
  yield call(upvoteRequest, payload, meta)
}

function* watchUploadFileUploadRequest({ payload, meta }) {
  yield call(fileUploadRequest, payload, meta)
}

function* watchPublishPostRequest({ payload, meta }) {
  yield call(publishPostRequest, payload, meta)
}

function* watchPublishReplyRequest({ payload, meta }) {
  yield call(publishReplyRequest, payload, meta)
}

function* watchGetSearchTags({ payload, meta }) {
  yield call(getSearchTags, payload, meta)
}


export default function* sagas() {
  yield takeEvery(GET_LATEST_POSTS_REQUEST, watchGetLatestPostsRequest)
  yield takeEvery(GET_HOME_POSTS_REQUEST, watchGetHomePostsRequest)
  yield takeEvery(GET_TRENDING_POSTS_REQUEST, watchGetTrendingPostsRequest)
  yield takeEvery(GET_REPLIES_REQUEST, watchGetRepliesRequest)
  yield takeEvery(GET_CONTENT_REQUEST, watchGetContentRequest)
  yield takeEvery(GET_TRENDING_TAGS_REQUEST, watchGetTrendingTagsRequest)
  yield takeEvery(UPVOTE_REQUEST, watchUpvoteRequest)
  yield takeEvery(UPLOAD_FILE_REQUEST, watchUploadFileUploadRequest)
  yield takeEvery(PUBLISH_POST_REQUEST, watchPublishPostRequest)
  yield takeEvery(PUBLISH_REPLY_REQUEST, watchPublishReplyRequest)
  yield takeEvery(GET_SEARCH_TAG_REQUEST, watchGetSearchTags)
}

