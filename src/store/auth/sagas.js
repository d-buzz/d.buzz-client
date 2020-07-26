import { call, put, takeEvery } from "redux-saga/effects"

import {
  AUTHENTICATE_USER_REQUEST,
  authenticateUserSuccess,
  authenticateUserFailure,

  GET_SAVED_USER_REQUEST,
  getSavedUserSuccess,
  getSavedUserFailure,

  SIGNOUT_USER_REQUEST,
  signoutUserSuccess,
  signoutUserFailure,
} from './actions'

import {
  keychainSignIn,
  fetchProfile,
  isWifValid,
  generateWif
} from 'services/api'

function* authenticateUserRequest(payload, meta) {
  const { username, password, useKeychain } = payload
  let user = { username, useKeychain, is_authenticated: false  }

  try {
    let profile = yield call(fetchProfile, username)

    if(profile) {
      profile = profile[0]
    }

    if(useKeychain) {
      const data = yield call(keychainSignIn, username)
      if(data.success) {
        user.is_authenticated = true
        user.profile = profile
      }
    } else {

      if(profile) {
        const pubWif =  profile['posting'].key_auths[0][0]
        try {
          const isValid = isWifValid(password, pubWif)
          user.is_authenticated = isValid
          const wif = generateWif(username, password, 'posting')
          user.wif = wif
          user.profile = profile
        } catch(e) {
          user.is_authenticated = false
        }
      } else {
        user.is_authenticated = false
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
  let user = { username: '', useKeychain: false, is_authenticated: false }
  try {
    let saved = yield call([localStorage, localStorage.getItem], 'user')
    saved = JSON.parse(saved)
    if(saved !== null) {
      user = saved
    }

    yield put(getSavedUserSuccess(user, meta))
  } catch(error) {
    yield put(getSavedUserFailure(user, meta))
  }
}

function* signoutUserRequest(meta) {
  let user = { username: '', useKeychain: false, is_authenticated: false }
  try {
    yield call([localStorage, localStorage.clear])
    yield put(signoutUserSuccess(user, meta))
  } catch(error) {
    yield put(signoutUserFailure(error, meta))
  }
}

function* watchSignoutUserRequest({ meta }) {
  yield call(signoutUserRequest, meta)
}

function* watchAuthenticateUserRequest({ payload, meta }) {
  yield call(authenticateUserRequest, payload, meta)
}

function* watchGetSavedUserRequest({ meta }) {
  yield call(getSavedUserRequest, meta)
}

export default function* sagas() {
  yield takeEvery(AUTHENTICATE_USER_REQUEST, watchAuthenticateUserRequest)
  yield takeEvery(SIGNOUT_USER_REQUEST, watchSignoutUserRequest)
  yield takeEvery(GET_SAVED_USER_REQUEST, watchGetSavedUserRequest)
}
