import { call, put, select, takeEvery } from "redux-saga/effects"

import {
  GET_SAVED_THEME_REQUEST,
  getSavedThemeSuccess,
  getSavedThemeFailure,

  SET_THEME_REQUEST,
  setThemeSuccess,
  setThemeFailure,

  GET_BEST_RPC_NODE,
  setRpcNode,

  CHECK_VERSION_REQUEST,
  checkVersionSuccess,

  GET_CENSOR_TYPES_REQUEST,
  getCensorTypesSuccess,

  CENSOR_BUZZ_REQUEST,
  censorBuzzSuccess,
  censorBuzzFailure,

  SET_DEFAULT_VOTING_WEIGHT_REQUEST,
  setDefaultVotingWeightSuccess,

  GET_WS_NODE_HAS,
  setWSNodeHAS,
} from './actions'

import {
  checkVersion,
  getCensorTypes,
  censorBuzz,
  geRPCNode,
} from 'services/api'
import config from 'config'

import { setCensorList } from '../auth/actions'

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

function* getBestRPCNode(meta) {
  const node = yield call(geRPCNode)

  yield call([localStorage, localStorage.setItem], 'rpc-node', node)

  yield put(setRpcNode(node, meta))
}

function* getWSNodeHASRequest(meta) {
  const hasServer = config.HAS_WS
  yield call([localStorage, localStorage.setItem], 'websocketHAS', hasServer)

  yield put(setWSNodeHAS(hasServer, meta))
}

function* getCensorTypesRequest(meta) {
  const types = yield call(getCensorTypes)
  yield put(getCensorTypesSuccess(types, meta))
}

function* censorBuzzRequest(payload, meta) {
  try {
    const { author, permlink, type } = payload
    const censorList = yield select(state => state.auth.get('censorList'))
    const censorTypes = yield select(state => state.settings.get('censorTypes'))
    const typeName = censorTypes.filter((item) => item.id === type)[0]

    yield call(censorBuzz, author, permlink, type)

    yield put(setCensorList([...censorList, { author, permlink, type: typeName.name, type_id: type }]))
    yield put(censorBuzzSuccess(meta))

  } catch(error) {
    yield put(censorBuzzFailure(error, meta))
  }
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

function* watchGetBestRPCNode({ meta }) {
  yield call(getBestRPCNode, meta)
}

function* watchGetWSNodeHAS({ meta }) {
  yield call(getWSNodeHASRequest, meta)
}

function* watchCheckVersionRequest({ meta }) {
  yield call(checkVersionRequest, meta)
}

function* watchGetCensorTypesRequest({ meta }) {
  yield call(getCensorTypesRequest, meta)
}

function* watchCensorBuzzRequest({ payload, meta }) {
  yield call(censorBuzzRequest, payload, meta)
}

function* watchSetDefaultVotingWeightRequest({ payload, meta }) {
  yield call(setDefaultVotingWeightRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_SAVED_THEME_REQUEST, watchGetSavedThemeRequest)
  yield takeEvery(SET_THEME_REQUEST, watchSetThemeRequest)
  yield takeEvery(GET_BEST_RPC_NODE, watchGetBestRPCNode)
  yield takeEvery(GET_WS_NODE_HAS, watchGetWSNodeHAS)
  yield takeEvery(CHECK_VERSION_REQUEST, watchCheckVersionRequest)
  yield takeEvery(GET_CENSOR_TYPES_REQUEST, watchGetCensorTypesRequest)
  yield takeEvery(CENSOR_BUZZ_REQUEST, watchCensorBuzzRequest)
  yield takeEvery(SET_DEFAULT_VOTING_WEIGHT_REQUEST, watchSetDefaultVotingWeightRequest)
}
