import { select, call, put, takeEvery } from "redux-saga/effects"
import {
  GET_RANKED_POST_REQUEST,
  getRankedPostSuccess,
  getRankedPostFailure,
  setLastPost,

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

  GET_TRENDING_TAGS_REQUEST,
  getTrendingTagsSuccess,
  getTrendingTagsFailure,
} from './actions'
import {
  callBridge,
  fetchReplies,
  fetchContent,
  fetchProfile,
  fetchTrendingTags,
} from 'services/api'
import config from 'config'

function* getRankedPostRequest(payload, meta) {
  const { sort, start_permlink, start_author } = payload

  const params = { sort, "tag": `${config.TAG}`, start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {

    let old = yield select(state => state.posts.get('items'))
    let data = yield call(callBridge, method, params)
    data = data.filter((post) => post.body.length <= 280)

    const getProfileData = new Promise((resolve, reject) => {
      let count = 0
      try {
        data.forEach(async(item, index) => {
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

    yield call([Promise, Promise.all], [getProfileData])

    data = [...old, ...data]

    yield put(setLastPost(data[data.length-1]))
    yield put(getRankedPostSuccess(data, meta))
  } catch(error) {
    yield put(getRankedPostFailure(error, meta))
  }
}

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

  const params = { "sort": 'trending', "tag": `${config.TAG}`, start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {
    let old = yield select(state => state.posts.get('trending'))
    let data = yield call(callBridge, method, params)
    data = data.filter((post) => post.body.length <= 280)

    const getProfileData = new Promise((resolve, reject) => {
      let count = 0
      try {
        data.forEach(async(item, index) => {
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

    yield call([Promise, Promise.all], [getProfileData])

    data = [...old, ...data]

    console.log(data)

    yield put(setTrendingLastPost(data[data.length-1]))
    yield put(getTrendingPostsSuccess(data, meta))
  } catch(error) {
    console.log(error)
    yield put(getTrendingPostsFailure(error, meta))
  }
}

function* watchGetRankPostRequest({ payload, meta }) {
  yield call(getRankedPostRequest, payload, meta)
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

export default function* sagas() {
  yield takeEvery(GET_RANKED_POST_REQUEST, watchGetRankPostRequest)
  yield takeEvery(GET_REPLIES_REQUEST, watchGetRepliesRequest)
  yield takeEvery(GET_CONTENT_REQUEST, watchGetContentRequest)
  yield takeEvery(GET_TRENDING_TAGS_REQUEST, watchGetTrendingTagsRequest)
  yield takeEvery(GET_TRENDING_POSTS_REQUEST, watchGetTrendingPostsRequest)
}

