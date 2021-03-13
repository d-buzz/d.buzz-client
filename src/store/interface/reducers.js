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
  OPEN_HIDE_BUZZ_DIALOG,
  CLOSE_HIDE_BUZZ_DIALOG,
  OPEN_CENSORSHIP_DIALOG,
  CLOSE_CENSOSHIP_DIALOG,
  SET_REFRESH_ROUTE_STATUS,
  CLEAR_REFRESH_ROUTE_STATUS,
  OPEN_FOLLOW_MUTED_DIALOG,
  CLOSE_FOLLOW_MUTED_DIALOG,
  OPEN_FOLLOW_BLACKLISTS_DIALOG,
  CLOSE_FOLLOW_BLACKLISTS_DIALOG,
  OPEN_BLACKLIST_DIALOG,
  CLOSE_BLACKLIST_DIALOG,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  replyModalData: {},
  notificationBoxData: {},
  userDialogData: {},
  scrollIndex: -1,
  buzzModalStatus: false,
  muteDialogUser: { open: false, username: null },
  hideBuzzDialog: { open: false, author: null, permlink: null },
  censorshipDialog: { open: false, author: null, permlink: null },
  refreshRouteStatus : { pathname: null, timestamp: null },
  followMutedListDialog : { open: false, username: null },
  followBlacklistsDialog : { open: false, username: null },
  blacklistDialog: { open: false, username: null },
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
  case OPEN_HIDE_BUZZ_DIALOG:
    return state.set('hideBuzzDialog', { open: true, ...payload })
  case CLOSE_HIDE_BUZZ_DIALOG:
    return state.set('hideBuzzDialog', { open: false, author: null, permlink: null })
  case OPEN_CENSORSHIP_DIALOG:
    return state.set('censorshipDialog', { open: true, ...payload })
  case CLOSE_CENSOSHIP_DIALOG:
    return state.set('censorshipDialog', { open: false, author: null, permlink: null })
  case SET_REFRESH_ROUTE_STATUS:
    return state.set('refreshRouteStatus', payload)
  case CLEAR_REFRESH_ROUTE_STATUS:
    return state.set('refreshRouteStatus', { pathname: null, timestamp: null })
  case OPEN_FOLLOW_MUTED_DIALOG:
    return state.set('followMutedListDialog', { open: true, ...payload })
  case CLOSE_FOLLOW_MUTED_DIALOG:
    return state.set('followMutedListDialog', { open: false, username: null })
  case OPEN_FOLLOW_BLACKLISTS_DIALOG:
    return state.set('followBlacklistsDialog', { open: true, ...payload })
  case CLOSE_FOLLOW_BLACKLISTS_DIALOG:
    return state.set('followBlacklistsDialog', { open: false, username: null })
  case OPEN_BLACKLIST_DIALOG:
    return state.set('blacklistDialog', { open: true, ...payload })
  case CLOSE_BLACKLIST_DIALOG:
    return state.set('blacklistDialog', { open: false, username: null })
  default:
    return state
  }
}
