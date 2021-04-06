import {
  POLL_NOTIF_SUCCESS,
  POLL_NOTIF_COUNT,
  FILTER_NOTIFICATIONS_SUCCESS,
} from './actions'
import {
  CLEAR_NOTIFICATIONS_SUCCESS,
} from '../profile/actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  notifications: [],
  count: 0,
  notificationFilter: 'ALL',
})

export const polling = (state = defaultState, { type, payload }) => {
  switch (type) {
  case POLL_NOTIF_SUCCESS:
    return state.set('notifications', payload)
  case POLL_NOTIF_COUNT:
    return state.set('count', payload)
  case CLEAR_NOTIFICATIONS_SUCCESS:
    return state.set('count', payload)
  case FILTER_NOTIFICATIONS_SUCCESS:
    return state.set('notificationFilter', payload)
  default:
    return state
  }
}
