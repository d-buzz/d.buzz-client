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
} from './actions'
import {
  callBridge,
  fetchReplies,
  fetchContent
} from 'services/api'
import config from 'config'

function* getRankedPostRequest(payload, meta) {
  const { sort, start_permlink, start_author } = payload

  const params = { sort, "tag": `${config.TAG}`, start_permlink, start_author }
  const method = 'get_ranked_posts'

  try {

    let old = yield select( state => state.posts.get('items'))
    let data = yield call(callBridge, method, params)
    data = data.filter((post) => post.body.length <= 280)

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

function* watchGetRankPostRequest({ payload, meta }) {
  yield call(getRankedPostRequest, payload, meta)
}

function* watchGetRepliesRequest({ payload, meta }) {
  yield call(getRepliesRequest, payload, meta)
}

function* watchGetContentRequest({ payload, meta }) {
  yield call(getContentRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_RANKED_POST_REQUEST, watchGetRankPostRequest)
  yield takeEvery(GET_REPLIES_REQUEST, watchGetRepliesRequest)
  yield takeEvery(GET_CONTENT_REQUEST, watchGetContentRequest)
}

