import { call, put, takeEvery } from 'redux-saga/effects'
import {
  TEST_REQUEST,
  testSuccess,
} from './actions'

function* testRequest(payload, meta){
  yield put(testSuccess('test is successful', meta))
}

function* watchTestRequest({payload, meta}) {
  yield call(testRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(TEST_REQUEST, watchTestRequest)
}

