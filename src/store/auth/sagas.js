import { call, put, takeEvery } from "redux-saga/effects"

import {
  AUTHENTICATE_USER_REQUEST,
  authenticateUserSuccess,
  authenticateUserFailure,

  GET_SAVED_USER_REQUEST,
  getSavedUserSuccess,
  getSavedUserFailure,
} from './actions'

import {
  keychainSignIn
} from 'services/api'

function* authenticateUserRequest(payload, meta) {
  const { username, password, useKeychain } = payload
  let user = { username, useKeychain, is_authenticated: false }

  try {

    if(useKeychain) {
      const data = yield call(keychainSignIn, username)
      if(data.success) {
        user.is_authenticated = true
      }
    }

    yield call([localStorage, localStorage.clear])
    yield call([localStorage, localStorage.setItem], 'user', JSON.stringify(user))
    yield put(authenticateUserSuccess(user, meta))
  } catch(error) {
    yield put(authenticateUserFailure(error, meta))
  }
}

function* getSavedUserRequest(meta) {
  let user = {username: '', useKeychain: false, is_authenticated: false }
  try {
    let saved = yield call([localStorage, localStorage.getItem], 'user')
    saved = JSON.parse(saved)
    if(saved !== null) {
      user = saved
    }

    yield put(getSavedUserSuccess(user, meta))
  } catch(error) {
    yield put(error, meta)
  }
}

function* watchAuthenticateUserRequest({ payload, meta }) {
  yield call(authenticateUserRequest, payload, meta)
}

function* watchGetSavedUserRequest({ meta }) {
  yield call(getSavedUserRequest, meta)
}

export default function* sagas() {
  yield takeEvery(AUTHENTICATE_USER_REQUEST, watchAuthenticateUserRequest)
  yield takeEvery(GET_SAVED_USER_REQUEST, watchGetSavedUserRequest)
}
