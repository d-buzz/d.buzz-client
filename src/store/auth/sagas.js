import { call, put, takeEvery, select } from "redux-saga/effects"

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

  SUBSCRIBE_REQUEST,
  subscribeSuccess,
  subscribeFailure,

  CHECK_HAS_UPDATE_AUTHORITY_REQUEST,
  checkHasUpdateAuthoritySuccess,
  checkHasUpdateAuthorityFailure,

  setMuteList,

  MUTE_USER_REQUEST,
  muteUserFailure,
  muteUserSuccess,

  setHasAgreedPayout,
  setOpacityUsers,

  setAccountList,

  SWITCH_ACCOUNT_REQUEST,
  switchAccountSuccess,

  HIDE_BUZZ_REQUEST,
  hideBuzzSuccess,
} from './actions'

import {
  keychainSignIn,
  fetchProfile,
  isWifValid,
  packLoginData,
  getCommunityRole,
  broadcastOperation,
  broadcastKeychainOperation,
  generateSubscribeOperation,
  extractLoginData,
  fetchMuteList,
  generateMuteOperation,
} from 'services/api'

import { generateSession, readSession } from 'services/helper'

function* authenticateUserRequest(payload, meta) {
  const { password, useKeychain } = payload
  let { username } = payload
  username = `${username}`.toLowerCase()

  const user = { username, useKeychain, is_authenticated: false, is_subscribe: false }

  let users = yield call([localStorage, localStorage.getItem], 'user')
  let accounts = yield call([localStorage, localStorage.getItem], 'accounts')

  if(!users || !Array.isArray(JSON.parse(users))) {
    users = []
  } else {
    users = JSON.parse(users)
  }

  const initialUsersLength = users.length

  if(!accounts) {
    accounts = []
  } else {
    accounts = JSON.parse(accounts)
  }

  try {
    if(useKeychain) {
      const data = yield call(keychainSignIn, username)
      if(data.success) {
        user.is_authenticated = true
      }
    } else {

      let profile = yield call(fetchProfile, [username])

      if(profile) {
        profile = profile[0]
      }

      if(profile) {
        const pubWif =  profile['posting'].key_auths[0][0]
        try {
          const isValid = isWifValid(password, pubWif)
          user.is_authenticated = isValid
          user.login_data = packLoginData(username, password)
        } catch(e) {
          user.is_authenticated = false
        }
      } else {
        user.is_authenticated = false
      }
    }

    if(user.is_authenticated) {
      const is_subscribe = yield call(getCommunityRole, username)
      user.is_subscribe = is_subscribe
      user.active = true

      let mutelist = yield call(fetchMuteList, username)

      mutelist = [...new Set(mutelist.map(item => item.following))]

      yield put(setMuteList(mutelist))

      const session = generateSession(user)

      const isInAccountList = accounts.filter(item => item.username === username)

      if(isInAccountList.length === 0) {
        users.push(session)
        accounts.push({ username, keychain: useKeychain })
      }

      yield call([localStorage, localStorage.clear])
      yield call([localStorage, localStorage.setItem], 'user', JSON.stringify(users))
      yield call([localStorage, localStorage.setItem], 'active', username)
      yield call([localStorage, localStorage.setItem], 'accounts', JSON.stringify(accounts))
      yield put(setAccountList(accounts))
    }

    if(initialUsersLength > 0 && users.length !== initialUsersLength) {
      window.location.reload()
    }

    yield put(authenticateUserSuccess(user, meta))
  } catch(error) {
    yield put(authenticateUserFailure(error, meta))
  }
}

function* getSavedUserRequest(meta) {
  let user = { username: '', useKeychain: false, is_authenticated: false }
  try {
    let saved = yield call([localStorage, localStorage.getItem], 'user')
    let active = yield call([localStorage, localStorage.getItem], 'active')
    let accounts = yield call([localStorage, localStorage.getItem], 'accounts')

    if(!accounts) {
      accounts = []
    } else {
      accounts = JSON.parse(accounts)
    }

    saved = JSON.parse(saved)

    try {
      const parseActive = JSON.parse(active)
      active = parseActive
    } catch (e) {}

    if(active !== null && saved !== null && Array.isArray(saved) && active && saved.length !== 0) {
      // saved.hasOwnProperty('id') && saved.hasOwnProperty('token')
      let activeUser = null
      saved.forEach((item) => {
        const decrypted = readSession(item)

        if(decrypted.username === active) {
          activeUser = decrypted
        }
      })
      user = activeUser
    }

    if(user.is_authenticated) {
      let mutelist = yield call(fetchMuteList, user.username)
      mutelist = [...new Set(mutelist.map(item => item.following))]
      yield put(setMuteList(mutelist))
      yield put(setOpacityUsers([]))
    }

    let payoutAgreed = yield call([localStorage, localStorage.getItem], 'payoutAgreed')

    if(payoutAgreed === null) {
      payoutAgreed = false
    }

    yield put(setAccountList(accounts))
    yield put(setHasAgreedPayout(payoutAgreed))

    yield put(getSavedUserSuccess(user, meta))
  } catch(error) {
    yield put(getSavedUserFailure(user, meta))
  }
}

function* signoutUserRequest(meta) {
  try {
    const user = { username: '', useKeychain: false, is_authenticated: false }
    // const active = yield call([localStorage, localStorage.getItem], 'active')
    // let accounts = JSON.parse(yield call([localStorage, localStorage.getItem], 'accounts'))
    // let users = JSON.parse(yield call([localStorage, localStorage.getItem], 'user'))

    // accounts = accounts.filter(item => item.username !== active)

    // const subtracted = []

    // users.forEach((item) => {
    //   const { username } = readSession(item)
    //   if(username !== active) {
    //     subtracted.push(item)
    //   }
    // })

    // users = subtracted

    // yield call([localStorage, localStorage.removeItem], 'user')
    yield call([localStorage, localStorage.setItem], 'user', JSON.stringify([]))
    yield call([localStorage, localStorage.setItem], 'active', null)
    yield call([localStorage, localStorage.setItem], 'accounts', JSON.stringify([]))
    yield put(setAccountList([]))
    yield put(signoutUserSuccess(user, meta))
  } catch(error) {
    yield put(signoutUserFailure(error, meta))
  }
}

function* subscribeRequest(meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user
    const operation = yield call(generateSubscribeOperation, username)

    let success = false

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success

      if(!success) {
        yield put(subscribeFailure('Subscription failed', meta))
      }
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result
    }

    if(success) {
      let saved = yield call([localStorage, localStorage.getItem], 'user')
      saved = JSON.parse(saved)
      saved.is_subscribe = true
      yield call([localStorage, localStorage.setItem], 'user', JSON.stringify(saved))
    }

    yield put(subscribeSuccess(success, meta))
  } catch (error) {
    yield put(subscribeFailure(error, meta))
  }
}

function* checkHasUpdateAuthorityRequest(payload, meta) {
  try {
    const { author } = payload
    const user = yield select(state => state.auth.get('user'))
    let { login_data } = user
    const { username, useKeychain } = user

    if(useKeychain) {
      login_data = username
    } else {
      login_data = extractLoginData(login_data)
      login_data = login_data[0]
    }

    const hasAuthority = author === login_data

    yield put(checkHasUpdateAuthoritySuccess(hasAuthority, meta))
  } catch (error) {
    yield put(checkHasUpdateAuthorityFailure(error, meta))
  }
}

function* muteUserRequest(payload, meta) {
  try {
    const { user: following } = payload
    const user = yield select(state => state.auth.get('user'))

    const { username: follower, useKeychain } = user

    const operation = yield call(generateMuteOperation, follower, following)

    let success = false

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, follower, operation)
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])

      success = result.success
    }

    if(!success) {
      yield put(muteUserFailure('Unable to publish post', meta))
    } else {
      const mutelist = yield select(state => state.auth.get('mutelist'))
      mutelist.push(following)

      const opacityUsers = yield select(state => state.auth.get('opacityUsers'))
      opacityUsers.push(following)
      yield put(setOpacityUsers(opacityUsers))
      yield put(setMuteList(mutelist))
      yield put(muteUserSuccess(meta))
    }

  } catch(error) {
    yield put(muteUserFailure(error, meta))
  }
}

function* switchAccountRequest(payload, meta) {
  const { username } = payload
  yield call([localStorage, localStorage.setItem], 'active', username)
  yield put(switchAccountSuccess(meta))
}

function* hideBuzzRequest(payload, meta) {
  const { author, permlink } = payload
  let hiddenBuzzes = yield select(state => state.auth.get('hiddenBuzzes'))
  hiddenBuzzes = [...hiddenBuzzes, { author, permlink }]
  yield put(hideBuzzSuccess(hiddenBuzzes, meta))
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

function* watchSubscribeRequest({ meta }) {
  yield call(subscribeRequest, meta)
}

function* watchCheckHasUpdateAuthorityRequest({ payload, meta }) {
  yield call(checkHasUpdateAuthorityRequest, payload, meta)
}

function* watchMuteUserRequest({ payload, meta }) {
  yield call(muteUserRequest, payload, meta)
}

function* watchSwitchAccountRequest({ payload, meta }) {
  yield call(switchAccountRequest, payload, meta)
}

function* watchHideBuzzRequest({ payload, meta }) {
  yield call(hideBuzzRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(AUTHENTICATE_USER_REQUEST, watchAuthenticateUserRequest)
  yield takeEvery(SIGNOUT_USER_REQUEST, watchSignoutUserRequest)
  yield takeEvery(GET_SAVED_USER_REQUEST, watchGetSavedUserRequest)
  yield takeEvery(SUBSCRIBE_REQUEST, watchSubscribeRequest)
  yield takeEvery(CHECK_HAS_UPDATE_AUTHORITY_REQUEST, watchCheckHasUpdateAuthorityRequest)
  yield takeEvery(MUTE_USER_REQUEST, watchMuteUserRequest)
  yield takeEvery(SWITCH_ACCOUNT_REQUEST, watchSwitchAccountRequest)
  yield takeEvery(HIDE_BUZZ_REQUEST, watchHideBuzzRequest)
}
