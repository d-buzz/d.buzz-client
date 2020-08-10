import {
  POLL_NOTIF_SUCCESS,
  POLL_NOTIF_COUNT,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  notifications: [],
  count: 0,
})

export const polling = (state = defaultState, { type, payload }) => {
  switch (type) {
    case POLL_NOTIF_SUCCESS:
      return state.set('notifications', payload)
    case POLL_NOTIF_COUNT:
      return state.set('count', payload)
    default:
      return state
  }
}
