import {
  POLL_NOTIF_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  notifications: [],
})

export const polling = (state = defaultState, { type, payload }) => {
  switch (type) {
    case POLL_NOTIF_SUCCESS:
      return state.set('notifications', payload)
    default:
      return state
  }
}
