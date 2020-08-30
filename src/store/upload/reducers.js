import {
  UPLOAD_IMAGE_IPFS_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  ipfs: {},
})

export const upload = (state = defaultState, { type, payload }) => {
  switch (type) {
    case UPLOAD_IMAGE_IPFS_SUCCESS:
      return state.set('ipfs', payload)
    default:
      return state
  }
}
