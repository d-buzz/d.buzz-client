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
} from './actions'

import {
  getBestRpcNode,
  checkVersion,
  getCensorTypes,
  getKeyPair,
  extractLoginData,
  censorBuzz,
} from 'services/api'
import config from 'config'

import crypto from 'crypto'

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
  // let  running = yield call([localStorage, localStorage.getItem], 'version')
  // let latest = false

  // if(!running) {
  //   running = JSON.stringify(remote)
  // } else {
  const { BRANCH, VERSION } = config

  const latest = (VERSION === remote[BRANCH])
  // }

  if(!latest) {
    yield call([localStorage, localStorage.setItem], 'version', JSON.stringify(remote))
  }

  yield put(checkVersionSuccess(latest, meta))
}

function* getBestRPCNode(meta) {
  const node = yield call(getBestRpcNode)
  yield call([localStorage, localStorage.setItem], 'rpc', node)

  yield put(setRpcNode(node, meta))
}

function* getCensorTypesRequest(meta) {
  const types = yield call(getCensorTypes)
  yield put(getCensorTypesSuccess(types, meta))
}

function* censorBuzzRequest(payload, meta) {
  try {
    const { author, permlink, type } = payload
    const user = yield select(state => state.auth.get('user'))
    const censorList = yield select(state => state.auth.get('censorList'))
    const censorTypes = yield select(state => state.settings.get('censorTypes'))
    const typeName = censorTypes.filter((item) => item.id === type)[0]

    let { login_data } = user
    login_data = extractLoginData(login_data)

    const wif = login_data[1]

    const keypairs = yield call(getKeyPair)
    const transaction = {author, permlink, type, wif }

    const signerObject = crypto.createSign('RSA-SHA512')
    signerObject.update(JSON.stringify(transaction))
    const signature = signerObject.sign(keypairs.pair['private'], 'base64')

    yield call(censorBuzz, author, permlink, type, signature)

    yield put(setCensorList([...censorList, { author, permlink, type: typeName.name, type_id: type }]))
    yield put(censorBuzzSuccess(meta))

  } catch(error) {
    console.log({ error })
    yield put(censorBuzzFailure(error, meta))
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
