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
  setHiddenBuzzes,

  REMOVE_HIDDEN_BUZZ_REQUEST,
  removeHiddenBuzzSuccess,

  setCensorList,

  FOLLOW_MUTED_LIST_REQUEST,
  followMutedListSuccess,
  followMutedListFailure,

  UNFOLLOW_MUTED_LIST_REQUEST,
  unfollowMutedListSuccess,
  unfollowMutedListFailure,

  BLACKLIST_USER_REQUEST,
  blacklistUserSuccess,
  blacklistUserFailure,

  UNBLACKLIST_USER_REQUEST,
  unblacklistUserSuccess,
  unblacklistUserFailure,

  FOLLOW_BLACKLISTS_REQUEST,
  followBlacklistsSuccess,
  followBlacklistsFailure,

  UNFOLLOW_BLACKLISTS_REQUEST,
  unfollowBlacklistsSuccess,
  unfollowBlacklistsFailure,

  INIT_WS_HAS_CONNECTION_REQUEST,
  initWSHASConnectionSuccess,
  initWSHASConnectionFailure,

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
  getCensoredList,
  generateFollowMutedListOperation,
  generateUnfollowMutedListOperation,
  generateBlacklistOperation,
  generateUnblacklistOperation,
  generateFollowBlacklistsOperation,
  generateUnfollowBlacklistsOperation,
  hiveAuthenticationService,
} from 'services/api'

import { generateSession, readSession, errorMessageComposer } from 'services/helper'
import { HiveAuthClient, hacMsg } from "@mintrawa/hive-auth-client"


function* authenticateUserRequest(payload, meta) {
  const { password, useKeychain, useHAS } = payload
  let { username } = payload
  username = `${username}`.toLowerCase()


  const user = { username, useKeychain, useHAS, is_authenticated: false, is_subscribe: false }

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
    } else if(useHAS) {
      yield call(hiveAuthenticationService, username)
      
      hacMsg.subscribe((m) => {
        /** generate QR Code */
        if (m.type === 'qr_code') {
          const hasQRCode = "has://auth_req/" + (m).msg
          localStorage.setItem('hasQRcode', hasQRCode)
        }

        /** recieved authentication msg */
        if (m.type === 'authentication')  {
          
          console.log('%c|> HAC authentication msg |>', 'color: goldenrod', m)
          
          /** Authentication approved */
          if (m.msg?.status === "authentified") {
            user.is_authenticated = true

            const is_subscribe = getCommunityRole(username)
            user.is_subscribe = is_subscribe
            user.active = true

            // let mutelist = fetchMuteList(username)

            // mutelist = [...new Set(mutelist.map(item => item.following))]

            // setMuteList(mutelist)

            const session = generateSession(user)
            console.log('sessiong', session)

            const accountIndex = accounts.findIndex(item => item.username === username)

            if(accountIndex === -1) {
              accounts.push({ username, keychain: useKeychain, has: useHAS })
            } else {
              accounts[accountIndex].keychain = useKeychain
            }

            users.push(session)

            localStorage.clear()
            localStorage.setItem('user', JSON.stringify(users))
            localStorage.setItem('active', username)
            localStorage.setItem('accounts', JSON.stringify(accounts))
            setAccountList(accounts)

            window.location.reload()
        
            authenticateUserSuccess(user, meta)
    
          /** Authentication rejected */
          } else if (m.msg?.status === "rejected") {
            // this.loader = false;
            // this.qrHAS = undefined;
            // window.alert(`${ m.msg.data?.challenge }`);
    
            /** Force update DOM for Keychain extension */
            this.ref.detectChanges()
    
          /** Authentication error */
          } else {
            // this.loader = false;
            // this.qrHAS = undefined;
            // window.alert(`${ m.error?.msg }`);
    
            /** Force update DOM for Keychain extension */
            this.ref.detectChanges()
          }
        }
      })
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

      const accountIndex = accounts.findIndex(item => item.username === username)

      if(accountIndex === -1) {
        accounts.push({ username, keychain: useKeychain, has: useHAS })
      } else {
        accounts[accountIndex].keychain = useKeychain
      }

      users.push(session)

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
  let user = { username: '', useKeychain: false, useHAS: false, is_authenticated: false }
  try {
    let saved = yield call([localStorage, localStorage.getItem], 'user')
    let active = yield call([localStorage, localStorage.getItem], 'active')
    let accounts = yield call([localStorage, localStorage.getItem], 'accounts')
    const hiddenBuzzes = []

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

    const censorList = yield call(getCensoredList)
    yield put(setCensorList(censorList))

    let payoutAgreed = yield call([localStorage, localStorage.getItem], 'payoutAgreed')

    if(payoutAgreed === null) {
      payoutAgreed = false
    }

    yield put(setAccountList(accounts))
    yield put(setHasAgreedPayout(payoutAgreed))
    yield put(setHiddenBuzzes(hiddenBuzzes))

    yield put(getSavedUserSuccess(user, meta))
  } catch(error) {
    yield put(getSavedUserFailure(user, meta))
  }
}

function* initWSHASConnectionRequest(meta) {
  try {
    let hasServer = localStorage.getItem('websocketHAS')
    hasServer = hasServer.split()
    
    /** Initialize the HIVE auth client */
    const result  = HiveAuthClient(hasServer, { debug: true, delay: 200 })
    yield put(initWSHASConnectionSuccess(result, meta))
    
  } catch(error) {
    yield put(initWSHASConnectionFailure(error, meta))
  }
}

function* signoutUserRequest(meta) {
  try {
    const user = { username: '', useKeychain: false, is_authenticated: false }

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
      yield put(muteUserFailure({ success: false, errorMessage: 'Unable to mute user' }, meta))
    } else {
      const mutelist = yield select(state => state.auth.get('mutelist'))
      mutelist.push(following)

      const opacityUsers = yield select(state => state.auth.get('opacityUsers'))
      opacityUsers.push(following)
      yield put(setOpacityUsers(opacityUsers))
      yield put(setMuteList(mutelist))
      yield put(muteUserSuccess({ success: true }, meta))
    }

  } catch(error) {
    const errorMessage = errorMessageComposer('mute', error)
    yield put(muteUserFailure({ success: false, errorMessage }, meta))
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
  yield call([localStorage, localStorage.setItem], 'hiddenBuzzes', JSON.stringify(hiddenBuzzes))
  yield put(setHiddenBuzzes(hiddenBuzzes))
  yield put(hideBuzzSuccess(meta))
}

function* removeHiddenBuzzRequest(payload, meta) {
  const { permlink } = payload
  let hiddenBuzzes = yield select(state => state.auth.get('hiddenBuzzes'))
  hiddenBuzzes = hiddenBuzzes.filter((item) => item.permlink !== permlink)
  yield call([localStorage, localStorage.setItem], 'hiddenBuzzes', JSON.stringify(hiddenBuzzes))
  yield put(setHiddenBuzzes(hiddenBuzzes))
  yield put(removeHiddenBuzzSuccess(meta))
}

function* followMutedListRequest(payload, meta) {
  try {
    const { username : following } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username: follower, useKeychain } = user

    const operation = yield call(generateFollowMutedListOperation, follower, following)

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
      yield put(followMutedListFailure({ success: false, errorMessage: 'Failed to follow muted list' }, meta))
    } else {
      yield put(followMutedListSuccess({ success: true }, meta))
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('follow_muted', error)
    yield put(followMutedListFailure({ success: false, errorMessage }, meta))
  }
}

function* unfollowMutedListRequest(payload, meta) {
  try {
    const { username : following } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username: follower, useKeychain } = user

    const operation = yield call(generateUnfollowMutedListOperation, follower, following)

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
      yield put(unfollowMutedListFailure({ success: false, errorMessage: 'Failed to unfollow muted list' }, meta))
    } else {
      yield put(unfollowMutedListSuccess({ success: true }, meta))
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('unfollow_muted', error)
    yield put(unfollowMutedListFailure({ success: false, errorMessage }, meta))
  }
}

function* blacklistUserRequest(payload, meta) {
  try {
    const { username : following } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username: follower, useKeychain } = user

    const operation = yield call(generateBlacklistOperation, follower, following)

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
      yield put(blacklistUserSuccess({ success: false, errorMessage: 'Failed to blacklist user' }, meta))
    } else {
      yield put(blacklistUserFailure({ success: true }, meta))
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('blacklist', error)
    yield put(blacklistUserFailure({ success: false, errorMessage }, meta))
  }
}

function* unblacklistUserRequest(payload, meta) {
  try {
    const { username : following } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username: follower, useKeychain } = user

    const operation = yield call(generateUnblacklistOperation, follower, following)

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
      yield put(unblacklistUserSuccess({ success: false, errorMessage: 'Failed to unblacklist user' }, meta))
    } else {
      yield put(unblacklistUserFailure({ success: true }, meta))
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('unblacklist', error)
    yield put(unblacklistUserFailure({ success: false, errorMessage }, meta))
  }
}

function* followBlacklistsRequest(payload, meta) {
  try {
    const { username : following } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username: follower, useKeychain } = user

    const operation = yield call(generateFollowBlacklistsOperation, follower, following)

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
      yield put(followBlacklistsSuccess({ success: false, errorMessage: 'Failed to follow blacklists' }, meta))
    } else {
      yield put(followBlacklistsFailure({ success: true }, meta))
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('follow_blacklist', error)
    yield put(followBlacklistsFailure({ success: false, errorMessage }, meta))
  }
}

function* unfollowBlacklistsRequest(payload, meta) {
  try {
    const { username : following } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username: follower, useKeychain } = user

    const operation = yield call(generateUnfollowBlacklistsOperation, follower, following)

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
      yield put(unfollowBlacklistsSuccess({ success: false, errorMessage: 'Failed to unfollow blacklists' }, meta))
    } else {
      yield put(unfollowBlacklistsFailure({ success: true }, meta))
    }
  } catch (error) {
    const errorMessage = errorMessageComposer('unfollow_blacklist', error)
    yield put(unfollowBlacklistsFailure({ success: false, errorMessage }, meta))
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

function* watchInitWSHASConnectionRequest({ meta }) {
  yield call(initWSHASConnectionRequest, meta)
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

function* watchRemoveHiddenBuzzRequest({ payload, meta }) {
  yield call(removeHiddenBuzzRequest, payload ,meta)
}

function* watchFollowMutedListRequest({ payload, meta }) {
  yield call(followMutedListRequest, payload ,meta)
}

function* watchUnfollowMutedListRequest({ payload, meta }) {
  yield call(unfollowMutedListRequest, payload ,meta)
}

function* watchBlacklistUserRequest({ payload, meta }) {
  yield call(blacklistUserRequest, payload ,meta)
}

function* watchUnblacklistUserRequest({ payload, meta }) {
  yield call(unblacklistUserRequest, payload ,meta)
}

function* watchFollowBlacklistsRequest({ payload, meta }) {
  yield call(followBlacklistsRequest, payload ,meta)
}

function* watchUnfollowBlacklistsRequest({ payload, meta }) {
  yield call(unfollowBlacklistsRequest, payload ,meta)
}

export default function* sagas() {
  yield takeEvery(AUTHENTICATE_USER_REQUEST, watchAuthenticateUserRequest)
  yield takeEvery(SIGNOUT_USER_REQUEST, watchSignoutUserRequest)
  yield takeEvery(GET_SAVED_USER_REQUEST, watchGetSavedUserRequest)
  yield takeEvery(INIT_WS_HAS_CONNECTION_REQUEST, watchInitWSHASConnectionRequest)
  yield takeEvery(SUBSCRIBE_REQUEST, watchSubscribeRequest)
  yield takeEvery(CHECK_HAS_UPDATE_AUTHORITY_REQUEST, watchCheckHasUpdateAuthorityRequest)
  yield takeEvery(MUTE_USER_REQUEST, watchMuteUserRequest)
  yield takeEvery(SWITCH_ACCOUNT_REQUEST, watchSwitchAccountRequest)
  yield takeEvery(HIDE_BUZZ_REQUEST, watchHideBuzzRequest)
  yield takeEvery(REMOVE_HIDDEN_BUZZ_REQUEST, watchRemoveHiddenBuzzRequest)
  yield takeEvery(FOLLOW_MUTED_LIST_REQUEST, watchFollowMutedListRequest)
  yield takeEvery(UNFOLLOW_MUTED_LIST_REQUEST, watchUnfollowMutedListRequest)
  yield takeEvery(BLACKLIST_USER_REQUEST, watchBlacklistUserRequest)
  yield takeEvery(UNBLACKLIST_USER_REQUEST, watchUnblacklistUserRequest)
  yield takeEvery(FOLLOW_BLACKLISTS_REQUEST, watchFollowBlacklistsRequest)
  yield takeEvery(UNFOLLOW_BLACKLISTS_REQUEST, watchUnfollowBlacklistsRequest)
}
