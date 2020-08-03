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
} from 'services/api'

import base58 from 'base58-encode'


function* getRepliesRequest(payload, meta) {
  const { author, permlink } = payload
  try {
    const data = yield call(fetchReplies, author, permlink)
    // const getProfileData = mapFetchProfile(data)
    // yield call([Promise, Promise.all], [getProfileData])

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
    const { username, is_authenticated, useKeychain } = user
    const { file } = payload

    console.log({ file })

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

    // console.log({ data })

    const formData = new FormData()
    formData.append('file', file)

    const prefix = new Buffer('ImageSigningChallenge');
    const buf = Buffer.concat([prefix, data]);

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

    }

    const postUrl = `https://images.hive.net.ph/${username}/${sig}`
    const result = yield call(uploadImage, postUrl, formData)
    const base58Encoded = base58(result.data.url)
    const proxyUrl = `https://images.hive.blog/p/${base58Encoded}`

    yield put(uploadFileSuccess(proxyUrl, meta))
  } catch (error) {
    yield put(uploadFileError(error, meta))
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

export default function* sagas() {
  yield takeEvery(GET_LATEST_POSTS_REQUEST, watchGetLatestPostsRequest)
  yield takeEvery(GET_HOME_POSTS_REQUEST, watchGetHomePostsRequest)
  yield takeEvery(GET_TRENDING_POSTS_REQUEST, watchGetTrendingPostsRequest)
  yield takeEvery(GET_REPLIES_REQUEST, watchGetRepliesRequest)
  yield takeEvery(GET_CONTENT_REQUEST, watchGetContentRequest)
  yield takeEvery(GET_TRENDING_TAGS_REQUEST, watchGetTrendingTagsRequest)
  yield takeEvery(UPVOTE_REQUEST, watchUpvoteRequest)
  yield takeEvery(UPLOAD_FILE_REQUEST, watchUploadFileUploadRequest)
}

