import { call, put, takeEvery } from 'redux-saga/effects'
import {
  GET_PROFILE_REQUEST,
  getProfileSuccess,
  getProfileFailure,

  GET_ACCOUNT_POSTS_REQUEST,
  getAccountPostsSuccess,
  getAccountPostsFailure,
} from './actions'
import {
  fetchProfile,
  fetchAccountPosts
} from 'services/api'


function* getProfileRequest(payload, meta) {
  try {
    const { username } = payload
    const profile = yield call(fetchProfile, username)

    yield put(getProfileSuccess(profile[0], meta))
  } catch(error) {
    yield put(getProfileFailure(error, meta))
  }
}

function* getAccountPostRequest(payload, meta) {
  try{
    const { username, start_permlink } = payload

    const posts = yield call(fetchAccountPosts, username, start_permlink)

    yield put(getAccountPostsSuccess(posts, meta))
  } catch(error) {
    yield put(getAccountPostsFailure(error, meta))
  }
}

function* watchGetProfileRequest({ payload, meta }) {
  yield call(getProfileRequest, payload, meta)
}

function* watchGetAccountPostRequest({ payload, meta }) {
  yield call(getAccountPostRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_PROFILE_REQUEST, watchGetProfileRequest)
  yield takeEvery(GET_ACCOUNT_POSTS_REQUEST, watchGetAccountPostRequest)
}
