import { call, put, takeEvery } from "redux-saga/effects"
import {
  GET_RANKED_POST_REQUEST,
  getRankedPostSuccess,
  getRankedPostFailure,
  setLastPost,
} from './actions'
import { callBridge } from 'services/api'
import config from 'config'

function* getRankedPostRequest(payload, meta) {
  const { sort, start_permlink, start_author } = payload

  const params = { sort, "tag": `${config.TAG}`, start_permlink, start_author }
  const method = 'get_ranked_posts'
  
  try {
    const data = yield call(callBridge, method, params)
    yield put(setLastPost(data[data.length-1]))
    yield put(getRankedPostSuccess(data, meta))
  } catch(error) {
    yield put(getRankedPostFailure(error, meta))
  }
}

function* watchGetRankPostRequest({ payload, meta }) {
  yield call(getRankedPostRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_RANKED_POST_REQUEST, watchGetRankPostRequest)
}

