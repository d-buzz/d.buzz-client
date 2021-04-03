import { put, call, takeLatest, select, race, delay, takeEvery } from 'redux-saga/effects'
import {
  POLL_NOTIF_REQUEST,
  pollNotifSuccess,
  pollNotifFailure,
  pollNotifCount,
  FILTER_NOTIFICATIONS_REQUEST,
  filterNotificationsFailure,
} from './actions'
import {
  getAccountNotifications,
  getUnreadNotificationsCount,
} from 'services/api'

const POLLING_DELAY = 30000

function* poll() {
  while (true) {
    try {
      const user = yield select(state => state.auth.get('user'))
      const { username } = user

      const notification = yield call(getAccountNotifications, username)
      const count = yield call(getUnreadNotificationsCount, username)

      yield put(pollNotifSuccess(notification))
      yield put(pollNotifCount(count))
      yield delay(POLLING_DELAY)
    } catch (error) {
      yield put(pollNotifFailure(error))
    }
  }
}

function* watchPollingTasks() {
  while (true) {
    yield race([call(poll)])
  }
}

function filter(notification, name) {
  let notifs = notification
  if (name.toUpperCase() !== 'ALL') {
    notifs = notifs.filter((value) => value.type === name.toLowerCase())
  }
  return notifs
}

function* watchFilterNotification(payload) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const { username } = user
    const { payload: { name } } = payload

    let notification = yield call(getAccountNotifications, username)
    notification = filter(notification, name)
    yield put(pollNotifSuccess(notification))
  } catch (error) {
    yield put(filterNotificationsFailure(error))
  }
}

export default function* sagas() {
  yield takeLatest(POLL_NOTIF_REQUEST, watchPollingTasks)
  yield takeEvery(FILTER_NOTIFICATIONS_REQUEST, watchFilterNotification)
}
