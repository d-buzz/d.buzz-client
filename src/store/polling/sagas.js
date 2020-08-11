import { put, call, takeLatest, select, race, delay } from 'redux-saga/effects'
import {
  POLL_NOTIF_REQUEST,
  pollNotifSuccess,
  pollNotifFailure,
  pollNotifCount,
} from './actions'
import {
  getAccountNotifications,
  getUnreadNotificationsCount
} from 'services/api'

const POLLING_DELAY = 60000

function* poll(meta) {
  while (true) {
    try {
      const user = yield select(state => state.auth.get('user'))
      const { username } = user
      // const username = 'postnzt'
      const notification = yield call(getAccountNotifications, username)
      const count = yield call(getUnreadNotificationsCount, username)

      yield put(pollNotifSuccess(notification, meta))
      yield put(pollNotifCount(count))
      yield delay(POLLING_DELAY)
    } catch (error) {
      yield put(pollNotifFailure(error))
    }
  }
}

function* watchPollingTasks({ meta }) {
  while (true) {
    yield race([call(poll, meta)])
  }
}


export default function* sagas() {
  yield takeLatest(POLL_NOTIF_REQUEST, watchPollingTasks)
}

