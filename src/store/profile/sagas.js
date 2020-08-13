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
  setLastAccountReply,

  GET_FOLLOWERS_REQUEST,
  getFollowersSuccess,
  getFollowersFailure,
  setLastFollower,

  GET_FOLLOWING_REQUEST,
  getFollowingSuccess,
  getFollowingFailure,
  setLastFollowing,
} from './actions'

import {
  fetchProfile,
  fetchAccountPosts,
  fetchFollowers,
  fetchFollowing,
} from 'services/api'

function* getProfileRequest(payload, meta) {
  try {
    const { username } = payload
    const profile = yield call(fetchProfile, [username])

    yield put(getProfileSuccess(profile[0], meta))
  } catch(error) {
    yield put(getProfileFailure(error, meta))
  }
}

function* getAccountPostRequest(payload, meta) {
  try{
    const { username, start_permlink, start_author } = payload

    const old = yield select(state => state.profile.get('posts'))
    let data = yield call(fetchAccountPosts, username, start_permlink, start_author)

    const oldPermlink = Array.isArray(old) && old.length !== 0 ? old[old.length-1].permlink : ''
    const newPermlink = data.length !== 0 ? data[data.length-1].permlink : ''

    if((oldPermlink !== newPermlink)) {

      if(old.length !== 0) {
        if((old[old.length-1].permlink === data[0].permlink)) {
          data.splice(0, 1)
        }
      }

      data = [...old, ...data]
      yield put(setLastAccountPosts(data[data.length-1]))
    } else {
      yield put(setLastAccountPosts([]))
    }

    yield put(getAccountPostsSuccess(data, meta))
  } catch(error) {
    yield put(getAccountPostsFailure(error, meta))
  }
}

function* getAccountRepliesRequest(payload, meta) {
  try {
    const { username, start_permlink, start_author } = payload

    const old = yield select(state => state.profile.get('replies'))
    let data = yield call(fetchAccountPosts, username, start_permlink, start_author, 'replies')

    const oldPermlink = Array.isArray(old) && old.length ? old[old.length-1].permlink : ''
    const newPermlink = data.length !== 0 ? data[data.length-1].permlink : ''

    if((oldPermlink !== newPermlink)) {
      yield put(setLastAccountReply(data[data.length-1]))
    } else {
      data = []
      yield put(setLastAccountReply([]))
    }

    data = [...old, ...data]

    yield put(getAccountRepliesSuccess(data, meta))
  } catch(error) {
    yield put(getAccountRepliesFailure(error, meta))
  }
}

function* getFollowersRequest(payload, meta) {
  try {
    const { username, start_follower } = payload
    const old = yield select(state => state.profile.get('followers'))


    let data = yield call(fetchFollowers, username, start_follower)

    if(old.length !== 0 && data.length !== 0) {
      old.splice(old.length-1, 1)
    }

    data = [...old, ...data]


    yield put(setLastFollower(data[data.length-1]))
    yield put(getFollowersSuccess(data, meta))
  } catch(error) {
    yield put(getFollowersFailure(error, meta))
  }
}

function* getFollowingRequest(payload, meta) {
  try {
    const { username, start_following } = payload

    const old = yield select(state => state.profile.get('following'))
    let data = yield call(fetchFollowing, username, start_following)

    if(old.length !== 0 && data.length !== 0) {
      old.splice(old.length-1, 1)
    }

    data = [...old, ...data]

    yield put(setLastFollowing(data[data.length-1]))
    yield put(getFollowingSuccess(data, meta))
  } catch(error) {
    yield put(getFollowingFailure(error, meta))
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

function* watchGetFollowersRequest({ payload, meta }) {
  yield call(getFollowersRequest, payload, meta)
}

function* watchGetFollowingRequest({ payload, meta }) {
  yield call(getFollowingRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_PROFILE_REQUEST, watchGetProfileRequest)
  yield takeEvery(GET_ACCOUNT_POSTS_REQUEST, watchGetAccountPostRequest)
  yield takeEvery(GET_ACCOUNT_REPLIES_REQUEST, watchGetAccountRepliesRequest)
  yield takeEvery(GET_FOLLOWERS_REQUEST, watchGetFollowersRequest)
  yield takeEvery(GET_FOLLOWING_REQUEST, watchGetFollowingRequest)
}
