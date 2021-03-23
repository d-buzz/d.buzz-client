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

  CLEAR_NOTIFICATIONS_REQUEST,
  clearNotificationsSuccess,
  clearNotificationsFailure,

  GET_ACCOUNT_COMMENTS_REQUEST,
  getAccountCommentsFailure,
  getAccountCommentsSucess,
  setLastAccountComment,

  GET_ACCOUNT_LIST_REQUEST,
  getAccountListSuccess,
  getAccountListFailure,

  setAccountBlacklist,
  setAccountFollowedBlacklist,
  setAccountMutedList,
  setAccountFollowedMutedList,

  CHECK_ACCOUNT_FOLLOWS_LIST_REQUEST,
  checkAccountFollowsListSuccess,
  checkAccountFollowsListFailure,

  CHECK_ACCOUNT_EXIST_REQUEST,
  checkAccountExistSuccess,
  checkAccountExistFailure,

  setMuteListLastIndex,
  setMuteListUnfiltered,
  setBlacklistLastIndex,
  setBlacklistUnfiltered,
  setFollowBlacklistLastIndex,
  setFollowBlacklistUnfiltered,
  setFollowMutedLastIndex,
  setFollowMutedUnfiltered,

  UPDATE_PROFILE_REQUEST,
  updateProfileSuccess,
  updateProfileFailure,
} from './actions'

import {
  extractLoginData,
  fetchSingleProfile,
  fetchAccountPosts,
  fetchFollowers,
  fetchFollowing,
  broadcastOperation,
  broadcastKeychainOperation,
  generateClearNotificationOperation,
  invokeFilter,
  fetchGlobalProperties,
  fetchAccounts,
  getAccountLists,
  checkAccountIsFollowingLists,
  generateUpdateAccountOperation,
} from 'services/api'

function* getProfileRequest(payload, meta) {
  try {
    const { username } = payload
    const props = yield call(fetchGlobalProperties)
    const profile = yield call(fetchSingleProfile, username)
    const account = yield call(fetchAccounts, username)

    const { vesting_shares, to_withdraw, withdrawn, delegated_vesting_shares, received_vesting_shares } = account[0]
    const { total_vesting_fund_hive, total_vesting_shares } = props

    const delegated = parseFloat(parseFloat(total_vesting_fund_hive) * (parseFloat(delegated_vesting_shares) / parseFloat(total_vesting_shares)),6)
    const receiveVesting = parseFloat(parseFloat(total_vesting_fund_hive) * (parseFloat(received_vesting_shares) / parseFloat(total_vesting_shares)),6)
    const avail = parseFloat(vesting_shares) - (parseFloat(to_withdraw) - parseFloat(withdrawn)) / 1e6 - parseFloat(delegated_vesting_shares)
    const vestHive = parseFloat(parseFloat(total_vesting_fund_hive) * (parseFloat(avail) / parseFloat(total_vesting_shares)),6)

    profile.receiveVesting = receiveVesting.toFixed(2)
    profile.hivepower = parseFloat(vestHive.toFixed(2)) + parseFloat(profile.receiveVesting)
    profile.delegated = delegated.toFixed(2)

    yield put(getProfileSuccess(profile, meta))
  } catch(error) {
    yield put(getProfileFailure(error, meta))
  }
}

function* getAccountPostRequest(payload, meta) {
  try{
    const { username, start_permlink, start_author } = payload
    const old = yield select(state => state.profile.get('posts'))
    let data = yield call(fetchAccountPosts, username, start_permlink, start_author)

    data = [...old, ...data]
    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    data = data.filter(item => invokeFilter(item))

    yield put(setLastAccountPosts(data[data.length-1]))
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

    data = [...old, ...data]
    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    data = data.filter(item => invokeFilter(item))

    yield put(setLastAccountReply(data[data.length-1]))
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

    data = [...old, ...data]

    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['follower']).indexOf(obj['follower']) === pos
    })

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

    data = [...old, ...data]

    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['following']).indexOf(obj['following']) === pos
    })

    yield put(setLastFollowing(data[data.length-1]))
    yield put(getFollowingSuccess(data, meta))
  } catch(error) {
    yield put(getFollowingFailure(error, meta))
  }
}

function* clearNotificationRequest(meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const notifications = yield select(state => state.polling.get('notifications'))
    const { username, useKeychain } = user
    const lastNotification = notifications[0]

    const operation = yield call(generateClearNotificationOperation, username, lastNotification)

    let success = false

    if(lastNotification.length !== 0) {
      if(useKeychain) {
        const result = yield call(broadcastKeychainOperation, username, operation)
        success = result.success
      } else {
        let { login_data } = user
        login_data = extractLoginData(login_data)

        const wif = login_data[1]
        const result = yield call(broadcastOperation, operation, [wif])
        success = result.success
      }

      let old = yield select(state => state.polling.get('count'))

      if(success) {
        old = {
          success: true,
          lastread: '',
          unread: 0,
        }
      } else {
        old.success = success
      }
      yield put(clearNotificationsSuccess(old, meta))
    } else {
      yield put(clearNotificationsFailure('failed to clear notification', meta))
    }
  } catch(error) {
    yield put(clearNotificationsFailure(error, meta))
  }
}

function* getCommentsAccountRequest(payload, meta) {
  try {
    const { username, start_permlink, start_author } = payload
    const old = yield select(state => state.profile.get('comments'))
    let data = yield call(fetchAccountPosts, username, start_permlink, start_author, 'comments')

    data = [...old, ...data]
    data = data.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['post_id']).indexOf(obj['post_id']) === pos
    })

    data = data.filter(item => invokeFilter(item))

    yield put(setLastAccountComment(data[data.length-1]))
    yield put(getAccountCommentsSucess(data, meta))
  } catch (error) {
    yield put(getAccountCommentsFailure(error, meta))
  }
}

function* getAccountListRequest(payload, meta) {
  try {
    const { observer, list_type, lastIndex, filter } = payload
    const data = yield call(getAccountLists, observer, list_type)
    let list = data
    const limit = parseInt(lastIndex) + 15

    if(list_type === 'blacklisted'){
      if(filter){
        const old = yield select(state => state.profile.get('blacklistedList'))
        list = [...old, ...data.slice(lastIndex, limit)]
      }
      yield put(setBlacklistUnfiltered(data)) // for searching
      yield put(setBlacklistLastIndex(list.length)) // for pagination
      yield put(setAccountBlacklist(list))
    }else if (list_type === 'follow_blacklist') {
      if(filter){
        const old = yield select(state => state.profile.get('followedBlacklist'))
        list = [...old, ...data.slice(lastIndex, limit)]
      }
      yield put(setFollowBlacklistUnfiltered(data)) // for searching
      yield put(setFollowBlacklistLastIndex(list.length))  // for pagination
      yield put(setAccountFollowedBlacklist(list))
    }else if (list_type === 'muted') {
      if(filter){
        const old = yield select(state => state.profile.get('mutedList'))
        list = [...old, ...data.slice(lastIndex, limit)]
      }
      yield put(setMuteListUnfiltered(data))  // for searching
      yield put(setMuteListLastIndex(list.length)) // for pagination
      yield put(setAccountMutedList(list))
    }else if (list_type === 'follow_muted') {
      if(filter){
        const old = yield select(state => state.profile.get('followedMuted'))
        list = [...old, ...data.slice(lastIndex, limit)]
      }
      yield put(setFollowMutedUnfiltered(data))  // for searching
      yield put(setFollowMutedLastIndex(list.length)) // for pagination
      yield put(setAccountFollowedMutedList(list))
    }
    yield put(getAccountListSuccess(data, meta))
  } catch (error) {
    yield put(getAccountListFailure(error, meta))
  }
}

function* checkAccountFollowsListRequest(payload, meta) {
  try {
    const { observer } = payload
    const data = yield call(checkAccountIsFollowingLists, observer)
    yield put(checkAccountFollowsListSuccess(data, meta))
  } catch (error) {
    yield put(checkAccountFollowsListFailure(error, meta))
  }
}

function* checkAccountExistRequest(payload, meta) {
  try {
    const { username } = payload
    let exists = false
    const account = yield call(fetchAccounts, username)
    if(account.length > 0){
      exists = true
    }
    yield put(checkAccountExistSuccess({ username, exists, profile: account }, meta))
  } catch (error) {
    yield put(checkAccountExistFailure(error, meta))
  }
}

function* updateProfileRequest(payload, meta) {
  try {
    const { account, posting_json_metadata } = payload

    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user

    const operation = yield call(generateUpdateAccountOperation, account, JSON.stringify(posting_json_metadata))
    let success = false

    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      console.log({result})
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      console.log({result})
      success = result.success
    }

    if(success) {
      yield put(updateProfileSuccess({success: true}, meta))
    }else{
      yield put(updateProfileFailure({success: false, errorMessage: 'Failed to update profile'}, meta))
    }
  } catch (error) {
    yield put(updateProfileFailure(error, meta))
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

function* watchClearNotificationRequest({ meta }) {
  yield call(clearNotificationRequest, meta)
}

function* watchGetAccountCommentsRequest({ payload, meta }) {
  yield call(getCommentsAccountRequest, payload, meta)
}

function* watchGetAccountListRequest({ payload, meta }) {
  yield call(getAccountListRequest, payload, meta)
}

function* watchCheckAccountFollowsListRequest({ payload, meta }) {
  yield call(checkAccountFollowsListRequest, payload, meta)
}

function* watchCheckAccountExistRequest({ payload, meta }) {
  yield call(checkAccountExistRequest, payload, meta)
}

function* watchUpdateProfileRequest({ payload, meta }) {
  yield call(updateProfileRequest, payload, meta)
}


export default function* sagas() {
  yield takeEvery(GET_PROFILE_REQUEST, watchGetProfileRequest)
  yield takeEvery(GET_ACCOUNT_POSTS_REQUEST, watchGetAccountPostRequest)
  yield takeEvery(GET_ACCOUNT_REPLIES_REQUEST, watchGetAccountRepliesRequest)
  yield takeEvery(GET_FOLLOWERS_REQUEST, watchGetFollowersRequest)
  yield takeEvery(GET_FOLLOWING_REQUEST, watchGetFollowingRequest)
  yield takeEvery(CLEAR_NOTIFICATIONS_REQUEST, watchClearNotificationRequest)
  yield takeEvery(GET_ACCOUNT_COMMENTS_REQUEST, watchGetAccountCommentsRequest)
  yield takeEvery(GET_ACCOUNT_LIST_REQUEST, watchGetAccountListRequest)
  yield takeEvery(CHECK_ACCOUNT_FOLLOWS_LIST_REQUEST, watchCheckAccountFollowsListRequest)
  yield takeEvery(CHECK_ACCOUNT_EXIST_REQUEST, watchCheckAccountExistRequest)
  yield takeEvery(UPDATE_PROFILE_REQUEST, watchUpdateProfileRequest)
}
