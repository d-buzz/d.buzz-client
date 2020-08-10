import { put, call, takeLatest, take, race, delay } from 'redux-saga/effects'
import { getAccountNotifications } from 'services/api'
import {
  POLL_NOTIF_REQUEST,
  pollNotifSuccess,
  pollNotifFailure
} from './actions'

const POLLING_DELAY = 120000

function* poll() {
  while (true) {
    try {
      const notification = yield call(getAccountNotifications)
      console.log({ notification })
      yield put(pollNotifSuccess(notification))
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


export default function* sagas() {
  yield takeLatest(POLL_NOTIF_REQUEST, watchPollingTasks)
}

