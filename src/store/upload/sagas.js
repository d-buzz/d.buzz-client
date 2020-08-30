import { call, put, takeEvery } from "redux-saga/effects"

import {
  UPLOAD_IMAGE_IPFS_REQUEST,
  uploadImageIpfsSuccess,
  uploadImageIpfsFailure,
} from './actions'

import {
  uploadIpfsFile,
} from 'services/api'

function* uploadImageIpfsRequest(payload, meta) {
  try{
    const { file } = payload
    const dataFile = yield call(uploadIpfsFile, file)

    yield put(uploadImageIpfsSuccess(dataFile[0], meta))
  } catch(error) {
    yield put(uploadImageIpfsFailure(error, meta))
  }
}


function* watchUploadImageIpfsRequest({ payload, meta}) {
  yield call(uploadImageIpfsRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(UPLOAD_IMAGE_IPFS_REQUEST, watchUploadImageIpfsRequest)
}
