import { put, call, takeLatest, race, delay } from 'redux-saga/effects'
import { getAccountNotifications } from 'services/api'
import {
  POLL_NOTIF_REQUEST,
  POLL_NOTIF_FAILURE,
  pollNotifSuccess,
  pollNotifFailure
} from './actions'

const POLLING_DELAY = 60000

function* poll() {
  while (true) {
    try {
      const notification = yield call(getAccountNotifications)
      console.log({ notification })
      yield put(pollNotifSuccess(notification))
      yield call(delay, POLLING_DELAY)
    } catch (error) {
      // If there's an error, polling will stop.
      yield put(pollNotifFailure(error))
    }
  }
}

function* watchPollingTasks() {
  while (true) {
    yield race([call(poll), takeLatest(POLL_NOTIF_FAILURE)])
  }
}


export default function* sagas() {
  yield takeLatest(POLL_NOTIF_REQUEST, watchPollingTasks)
}

