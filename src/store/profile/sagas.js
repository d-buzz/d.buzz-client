import { call, put, select, takeEvery } from 'redux-saga/effects'
import {
  GET_PROFILE_REQUEST,
  getProfileSuccess,
  getProfileFailure,

  GET_ACCOUNT_POSTS_REQUEST,
  getAccountPostsSuccess,
  getAccountPostsFailure,
  setLastAccountPosts,

  GET_ACCOUNT_REPLIES_REQUEST,
  getAccountRepliesSuccess,
  getAccountRepliesFailure,
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

    const old = yield select(state => state.profile.get('posts'))
    let data = yield call(fetchAccountPosts, username, start_permlink)

    data = [...old, ...data]

    yield put(setLastAccountPosts(data[data.length - 1]))
    yield put(getAccountPostsSuccess(data, meta))
  } catch(error) {
    yield put(getAccountPostsFailure(error, meta))
  }
}

function* getAccountRepliesRequest(payload, meta) {
  try {
    const { username, start_permlink } = payload

    let data = yield call(fetchAccountPosts, username, start_permlink, 'replies')

    yield put(getAccountRepliesSuccess(data, meta))
  } catch(error) {
    yield put(getAccountRepliesFailure(error, meta))
  }
}

function* watchGetProfileRequest({ payload, meta }) {
  yield call(getProfileRequest, payload, meta)
}

function* watchGetAccountPostRequest({ payload, meta }) {
  yield call(getAccountPostRequest, payload, meta)
}

function* watchGetAccountRepliesRequest({ payload, meta }) {
  yield call(getAccountRepliesRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_PROFILE_REQUEST, watchGetProfileRequest)
  yield takeEvery(GET_ACCOUNT_POSTS_REQUEST, watchGetAccountPostRequest)
  yield takeEvery(GET_ACCOUNT_REPLIES_REQUEST, watchGetAccountRepliesRequest)
}
