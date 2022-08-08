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
  INIT_CERAMIC_LOGIN_REQUEST,
  initCeremicLoginFailure,
  initCeremicLoginSuccess,
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

import { generateSession, readSession, errorMessageComposer} from 'services/helper'
import { checkCeramicLogin, getBasicProfile, loginWithMetaMask, reauthenticateWithCeramic } from 'services/ceramic'
import FingerprintJS from '@fingerprintjs/fingerprintjs'


function* authenticateUserRequest(payload, meta) {
  const { password, useKeychain, useHAS, useCeramic } = payload
  let { username } = payload
  username = `${username}`.toLowerCase()

  // console.log('AUTHENTICATING')

  const user = { username, useKeychain, useHAS, useCeramic, is_authenticated: false, is_subscribe: false }

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
      import('@mintrawa/hive-auth-client').then(({hacMsg}) => {
        hacMsg.subscribe((m) => {
          /** generate QR Code */
          if (m.type === 'qr_code') {
            const hasQRCode = "has://auth_req/" + (m).msg
            localStorage.setItem('hasQRcode', hasQRCode)
          }
  
          /** recieved authentication msg */
          if (m.type === 'authentication')  {
            
            console.log('%c[HAC authentication msg]', 'color: goldenrod', m)
            
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
  
              const accountIndex = accounts.findIndex(item => item.username === username)
  
              if(accountIndex === -1) {
                accounts.push({ username, keychain: useKeychain, has: useHAS, cermic: useCeramic })
              } else {
                accounts[accountIndex].keychain = useKeychain
              }
  
              users.push(session)
              localStorage.removeItem('hasQRcode')
              localStorage.setItem('current', username)
              localStorage.setItem('user', JSON.stringify(users))
              localStorage.setItem('active', username)
              localStorage.setItem('accounts', JSON.stringify(accounts))
              setAccountList(accounts)
       
              authenticateUserSuccess(user, meta)
              const origin = window.location.origin
              window.location.href = origin
      
            /** Authentication rejected */
            } else if (m.msg?.status === "rejected") {
              window.location.reload()
      
            /** Authentication error */
            } else {
              window.location.reload()
            }
          }
        })
      })
    } else if(useCeramic) {
      // sign in with meta mask
      console.log('logging in with ceramic + meta mask!')
      const did = yield call(loginWithMetaMask)
      // const profile = yield call(getBasicProfile, did.id)

      // if(did) {
      //   // alert(`initiating ceramic login: ${did.id}`)

      //   // if profile.name not exists then ask for a name
      //   // if(!profile.name) {
      //   //   const name = prompt('Enter a name for your new account \n(click on Cancel if you want default)')
      //   //   if(name) {
      //   //     yield call(setBasicProfile, {...profile, name})
      //   //   }
      //   // }
      // }

      if(did) {
        user.is_authenticated = true

        user.active = true
        // set username as Ceramic DID
        user.username = did.id

        const session = generateSession(user)

        const accountIndex = accounts.findIndex(item => item.username === username)

        if(accountIndex === -1) {
          accounts.push({ username: did.id, keychain: useKeychain, has: useHAS, cermic: useCeramic })
        } else {
          accounts[accountIndex].keychain = useKeychain
        }

        users.push(session)

        localStorage.setItem('current', did.id)
        localStorage.setItem('active', did.id)
        localStorage.setItem('user', JSON.stringify(users))
        localStorage.setItem('accounts', JSON.stringify(accounts))
        setAccountList(accounts)

        authenticateUserSuccess(user, meta)
        const origin = window.location.origin
        window.location.href = origin + '#/latest'
      }
    } else {

      let profile = yield call(fetchProfile, [username])

      if(profile) {
        profile = profile[0]
      }

      if(profile) {
        const pubWif =  profile['posting'].key_auths[0][0]
        try {
          const isValid = yield call(isWifValid, password, pubWif)
          user.is_authenticated = isValid
          user.login_data = packLoginData(username, password)
        } catch(e) {
          user.is_authenticated = false
        }
      } else {
        user.is_authenticated = false
      }
    }
    if(user.is_authenticated && !useCeramic) {
      const is_subscribe = yield call(getCommunityRole, username)
      user.is_subscribe = is_subscribe
      user.active = true

      let mutelist = yield call(fetchMuteList, username)

      mutelist = [...new Set(mutelist.map(item => item.following))]

      yield put(setMuteList(mutelist))

      const session = generateSession(user)

      const accountIndex = accounts.findIndex(item => item.username === username)

      if(accountIndex === -1) {
        accounts.push({ username, keychain: useKeychain, has: useHAS, ceramic: useCeramic })
      } else {
        accounts[accountIndex].keychain = useKeychain
      }

      users.push(session)
      yield call([localStorage, localStorage.clear])
      yield call([localStorage, localStorage.setItem], 'user', JSON.stringify(users))
      yield call([localStorage, localStorage.setItem], 'active', username)
      yield call([localStorage, localStorage.setItem], 'accounts', JSON.stringify(accounts))
      yield put(setAccountList(accounts))
    
    } else if(useCeramic) {
      // checking for Ceramic Login Auth

      user.active = true

      const username = localStorage.getItem('active')
      const ceramicAuth = localStorage.getItem('ceramic.auth')

      const session = generateSession(user)

      const accountIndex = accounts.findIndex(item => item.username === username)

      if(accountIndex === -1) {
        accounts.push({ username, keychain: useKeychain, has: useHAS, ceramic: useCeramic })
      } else {
        accounts[accountIndex].keychain = useKeychain
      }

      users.push(session)
      yield call([localStorage, localStorage.clear])
      yield call([localStorage, localStorage.setItem], 'current', username)
      yield call([localStorage, localStorage.setItem], 'user', JSON.stringify(users))
      yield call([localStorage, localStorage.setItem], 'active', username)
      yield call([localStorage, localStorage.setItem], 'accounts', JSON.stringify(accounts))
      yield call([localStorage, localStorage.setItem], 'ceramic.auth', JSON.stringify(JSON.parse(ceramicAuth)))
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

function* getSavedUserRequest (meta) {
  let user = { username: '', useKeychain: false, useHAS: false, is_authenticated: false, useCeramic: false }
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
      if(!user.useCeramic) {
        let mutelist = yield call(fetchMuteList, user.username)
        mutelist = [...new Set(mutelist.map(item => item.following))]
        yield put(setMuteList(mutelist))
        yield put(setOpacityUsers([]))
      } else {
        reauthenticateWithCeramic()
      }
    }

    if(user.useCeramic) {
      const auth = JSON.parse(localStorage.getItem('ceramic.auth'))
      const did = auth.authDID
      getBasicProfile(did)
        .then((res) => {
          localStorage.setItem('ceramic.user', JSON.stringify(res))
        })
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
    console.log('not saved', error)
  }
}

function* initWSHASConnectionRequest(meta) {
  const ceramicAuth = checkCeramicLogin()
  const active = localStorage.getItem('active')
  const accounts = JSON.parse(localStorage.getItem('accounts'))

  if(!ceramicAuth) {
    try {
      const fingerPrintRequest = FingerprintJS.load({ monitoring: false })
  
      fingerPrintRequest.then(fingerPrint => fingerPrint.get())
        .then(async(result) => {
          sessionStorage.setItem('hacPwd', result.visitorId)
          const current = localStorage.getItem('active')
          let HiveAuthClient
          let hacGetAccounts
          let hacGetConnectionStatus
          await import('@mintrawa/hive-auth-client').then((HiveAuth) => {
            HiveAuthClient = HiveAuth.HiveAuthClient
            hacGetAccounts = HiveAuth.hacGetAccounts
            hacGetConnectionStatus = HiveAuth.hacGetConnectionStatus
          })
  
          if (current && accounts[0].has) {
            const hacAccount = hacGetAccounts(current, result.visitorId)
  
            if (hacAccount[0]) {
              const has_expire = hacAccount[0].has?.has_expire
              const expire = has_expire ? new Date(has_expire) : 1
  
              console.log('expire', expire)
  
              hacGetConnectionStatus()
              const result = HiveAuthClient(hacAccount[0].has ? [hacAccount[0].has.has_server] : undefined, { debug: true, delay: 3000 })
              initWSHASConnectionSuccess(result, meta)
            // window.location.href('')
            } else {
              hacGetConnectionStatus()
              /** clear hac value and localstorage */
              if(active === 'null') {
                localStorage.clear()
              }
              const result = HiveAuthClient(undefined, { debug: true, delay: 3000 })
              initWSHASConnectionSuccess(result, meta)
            }
          } else {
            hacGetConnectionStatus()
            if(active === 'null') {
              localStorage.clear()
            }
            const result = HiveAuthClient(undefined, { debug: true, delay: 3000 })
            initWSHASConnectionSuccess(result, meta)
          }
          
        }).catch( error => console.log(error))
        
    } catch(error) {
      yield put(initWSHASConnectionFailure(error, meta))
    }
  }
}

function* initCeramicLoginRequest() {
  const current = localStorage.getItem('active')
  const ceramicAuth = checkCeramicLogin()
  
  try {
    if(ceramicAuth) {
      if(current) {
        // Ceramic.setDID(ceramicAuth)
        console.log('%c[LOGGED IN WITH CERAMIC]', 'color: goldenrod', JSON.parse(ceramicAuth).authDID)
        initCeremicLoginSuccess(ceramicAuth)
      } else {
        localStorage.clear()
      }
    } else {
      console.log('%c[NOT LOGGED IN WITH CERAMIC]', 'color: red', 'no DID found')
    }
  }
  catch(error) {
    yield put(initCeremicLoginFailure(error))
  }
}

function* signoutUserRequest(meta) {
  try {
    const user = { username: '', useKeychain: false, useHAS: false, is_authenticated: false, useCeramic: false }
    const lastUser = yield call([localStorage, localStorage.getItem], 'current')

    yield call([localStorage, localStorage.setItem], 'hac', JSON.stringify([]))
    yield call([localStorage, localStorage.setItem], 'user', JSON.stringify([]))
    yield call([localStorage, localStorage.setItem], 'active', null)
    yield call([localStorage, localStorage.setItem], 'accounts', JSON.stringify([]))
    yield put(setAccountList([]))
    localStorage.clear()
    yield call([localStorage, localStorage.setItem], 'lastUser', lastUser)
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

function* watchInitCeramicLoginRequest() {
  yield call(initCeramicLoginRequest)
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
  yield takeEvery(INIT_CERAMIC_LOGIN_REQUEST, watchInitCeramicLoginRequest)
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
