import {
  OPEN_REPLY_MODAL,
  CLOSE_REPLY_MODAL,
  BROADCAST_NOTIFICATION,
  OPEN_USER_DIALOG,
  CLOSE_USER_DIALOG,
  SAVE_SCROLL_INDEX,
  CLEAR_SCROLL_INDEX,
  SET_BUZZ_MODAL_STATUS,
  OPEN_MUTE_DIALOG,
  CLOSE_MUTE_DIALOG,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  replyModalData: {},
  notificationBoxData: {},
  userDialogData: {},
  scrollIndex: -1,
  buzzModalStatus: false,
  muteDialogUser: { open: false, username: null },
})

export const interfaces = (state = defaultState, { type, payload }) => {
  switch (type) {
  case OPEN_REPLY_MODAL:
    return state.set('replyModalData', payload)
  case CLOSE_REPLY_MODAL:
    return state.set('replyModalData', payload)
  case BROADCAST_NOTIFICATION:
    return state.set('notificationBoxData', payload)
  case OPEN_USER_DIALOG:
    return state.set('userDialogData', payload)
  case CLOSE_USER_DIALOG:
    return state.set('userDialogData', payload)
  case SAVE_SCROLL_INDEX:
    return state.set('scrollIndex', payload)
  case CLEAR_SCROLL_INDEX:
    return state.set('scrollIndex', -1)
  case SET_BUZZ_MODAL_STATUS:
    return state.set('buzzModalStatus', payload)
  case OPEN_MUTE_DIALOG:
    return state.set('muteDialogUser', { open: true, ...payload })
  case CLOSE_MUTE_DIALOG:
    return state.set('muteDialogUser', { open: false, username: null })
  default:
    return state
  }
}
