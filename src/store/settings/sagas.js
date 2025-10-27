import { call, put, takeEvery } from "redux-saga/effects"

import {
  GET_SAVED_THEME_REQUEST,
  getSavedThemeSuccess,
  getSavedThemeFailure,

  SET_THEME_REQUEST,
  setThemeSuccess,
  setThemeFailure,

  GET_RPC_NODE,
  setRpcNode,

  CHECK_VERSION_REQUEST,
  checkVersionSuccess,

  SET_DEFAULT_VOTING_WEIGHT_REQUEST,
  setDefaultVotingWeightSuccess,
} from './actions'

import {
  checkVersion,
  getActiveRPCNode,
} from 'services/api'
import config from 'config'

function* getSavedThemeRequest(payload, meta) {
  let theme = { mode: 'light' }
  try {
    let saved = yield call([localStorage, localStorage.getItem], 'theme')
    saved = JSON.parse(saved)
    if(saved !== null) {
      theme = saved
    }
    yield put(getSavedThemeSuccess(theme, meta))
  } catch(error) {
    yield put(getSavedThemeFailure(error, meta))
  }
}

function* setThemeRequest(payload, meta) {
  try {
    const { mode } = payload
    const theme = { mode }
    yield call([localStorage, localStorage.setItem], 'theme', JSON.stringify(theme))
    yield put(setThemeSuccess(theme, meta))
  } catch(error) {
    yield put(setThemeFailure(error, meta))
  }
}

function* checkVersionRequest(meta) {
  const remote = yield call(checkVersion)

  const { BRANCH, VERSION } = config

  const latest = (VERSION === remote[BRANCH])

  if(!latest) {
    yield call([localStorage, localStorage.setItem], 'version', JSON.stringify(remote))
  }

  yield put(checkVersionSuccess(latest, meta))
}

function* getRPCNode(meta) {
  const node = yield call(getActiveRPCNode)

  yield call([localStorage, localStorage.setItem], 'rpc-node', node)

  yield put(setRpcNode(node, meta))
}

function* setDefaultVotingWeightRequest(payload, meta) {
  const { weight } = payload
  yield call([localStorage, localStorage.setItem], 'voteWeight', weight)
  yield put(setDefaultVotingWeightSuccess(weight, meta))
}

function* watchGetSavedThemeRequest({ payload, meta }) {
  yield call(getSavedThemeRequest, payload, meta)
}

function* watchSetThemeRequest({ payload, meta }) {
  yield call(setThemeRequest, payload ,meta)
}

function* watchGetRPCNode({ meta }) {
  yield call(getRPCNode, meta)
}

function* watchCheckVersionRequest({ meta }) {
  yield call(checkVersionRequest, meta)
}

function* watchSetDefaultVotingWeightRequest({ payload, meta }) {
  yield call(setDefaultVotingWeightRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_SAVED_THEME_REQUEST, watchGetSavedThemeRequest)
  yield takeEvery(SET_THEME_REQUEST, watchSetThemeRequest)
  yield takeEvery(GET_RPC_NODE, watchGetRPCNode)
  yield takeEvery(CHECK_VERSION_REQUEST, watchCheckVersionRequest)
  yield takeEvery(SET_DEFAULT_VOTING_WEIGHT_REQUEST, watchSetDefaultVotingWeightRequest)
}
