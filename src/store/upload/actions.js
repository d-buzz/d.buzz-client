export const UPLOAD_IMAGE_IPFS_REQUEST = 'UPLOAD_IMAGE_IPFS_REQUEST'
export const UPLOAD_IMAGE_IPFS_SUCCESS = 'UPLOAD_IMAGE_IPFS_SUCCESS'
export const UPLOAD_IMAGE_IPFS_FAILURE = 'UPLOAD_IMAGE_IPFS_FAILURE'

export const uploadImageIpfsRequest = (file) => ({
  type: UPLOAD_IMAGE_IPFS_REQUEST,
  payload: { file },
  meta: {
    thunk: true,
  },
})

export const uploadImageIpfsSuccess = (response, meta) => ({
  type: UPLOAD_IMAGE_IPFS_SUCCESS,
  payload: response,
  meta,
})

export const uploadImageIpfsFailure = (error, meta) => ({
  type: UPLOAD_IMAGE_IPFS_FAILURE,
  payload: error,
  meta,
})