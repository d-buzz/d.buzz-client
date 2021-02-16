import { call, put, takeEvery } from "redux-saga/effects"

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
} from './actions'

import {
  getBestRpcNode,
  checkVersion,
  getCensorTypes,
  getKeyPair,
} from 'services/api'
import config from 'config'

import crypto from 'crypto'

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
  let  running = yield call([localStorage, localStorage.getItem], 'version')
  let latest = false

  if(!running) {
    running = JSON.stringify(remote)
  } else {
    const { prod, dev } = JSON.parse(running)
    const { BRANCH } = config

    latest = (BRANCH === 'dev' && dev === remote.dev) || (BRANCH === 'prod' && prod === remote.prod)
  }

  if(!latest) {
    yield call([localStorage, localStorage.setItem], 'version', JSON.stringify(remote))
  }

  yield put(checkVersionSuccess(latest, meta))
}

function* getBestRPCNode(meta) {
  const node = yield call(getBestRpcNode)
  console.log({ node })
  yield call([localStorage, localStorage.setItem], 'rpc', node)

  yield put(setRpcNode(node, meta))
}

function* getCensorTypesRequest(meta) {
  const types = yield call(getCensorTypes)
  console.log({ types })
  yield put(getCensorTypesSuccess(types, meta))
}

function* censorBuzzRequest(payload, meta) {
  const { author, permlink, type } = payload
  try {
    const keypairs = yield call(getKeyPair)

    const identity = '5Jmt1Gbj79xfGpMfmn64MH3k5xafJuMqxcc81T9KBnM1VGyzZaN'

    const transaction = {author: 'ssomeauthors', permlink: 'ssomepermlinks', type: 1, wif: identity}

    const signerObject = crypto.createSign("RSA-SHA512")
    signerObject.update(JSON.stringify(transaction))
    const signature = signerObject.sign(keypairs.pair["private"], "base64")

    console.log({ signature })
  } catch(error) {
    yield put(censorBuzzSuccess(error, meta))
  }
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

function* watchCheckVersionRequest({ meta }) {
  yield call(checkVersionRequest, meta)
}

function* watchGetCensorTypesRequest({ meta }) {
  yield call(getCensorTypesRequest, meta)
}

function* watchCensorBuzzRequest({ payload, meta }) {
  yield call(censorBuzzRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_SAVED_THEME_REQUEST, watchGetSavedThemeRequest)
  yield takeEvery(SET_THEME_REQUEST, watchSetThemeRequest)
  yield takeEvery(GET_BEST_RPC_NODE, watchGetBestRPCNode)
  yield takeEvery(CHECK_VERSION_REQUEST, watchCheckVersionRequest)
  yield takeEvery(GET_CENSOR_TYPES_REQUEST, watchGetCensorTypesRequest)
  yield takeEvery(CENSOR_BUZZ_REQUEST, watchCensorBuzzRequest)
}
