import {
  OPEN_REPLY_MODAL,
  CLOSE_REPLY_MODAL,
  BROADCAST_NOTIFICATION,
  OPEN_USER_DIALOG,
  CLOSE_USER_DIALOG,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  replyModalData: {},
  notificationBoxData: {},
  userDialogData: {},
})

export const interfaces = (state = defaultState, { type, payload }) => {
  switch (type) {
  case OPEN_REPLY_MODAL:
    return state.set('replyModalData', payload)
  case CLOSE_REPLY_MODAL:
    return state.set('replyModalData', {})
  case BROADCAST_NOTIFICATION:
    return state.set('notificationBoxData', payload)
  case OPEN_USER_DIALOG:
    return state.set('userDialogData', payload)
  case CLOSE_USER_DIALOG:
    return state.set('userDialogData', {})
  default:
    return state
  }
}
