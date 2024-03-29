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
  SHOW_ACCOUNT_SEARCH_BUTTON,
  HIDE_ACCOUNT_SEARCH_BUTTON,
  SET_ACCOUNT_SEARCH_LIST_KEYWORD,
  SET_BUZZ_CONFIRM_MODAL_STATUS,
  SET_WHATS_NEW_MODAL_STATUS,
  BUZZ_TITLE_MODAL,
  DRAFTS_MODAL,
  SAVE_DRAFTS_MODAL,
  SET_VIEW_IMAGE_MODAL,
  SET_LINK_CONFIRMATION_MODAL,
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
  accountSearchListButton : { show : false, list_type: null },
  accountSearchListKeyword : '',
  buzzTitleModalStatus: false,
  viewImageModal: {
    selectedImage: '',
    images: [],
  },
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
  case SET_WHATS_NEW_MODAL_STATUS:
    return state.set('whatsNewModalStatus', payload)
  case SET_BUZZ_CONFIRM_MODAL_STATUS:
    return state.set('buzzConfirmModalStatus', payload)
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
  case SHOW_ACCOUNT_SEARCH_BUTTON:
    return state.set('accountSearchListButton', { show: true, ...payload })
  case HIDE_ACCOUNT_SEARCH_BUTTON:
    return state.set('accountSearchListButton', { show: false, list_type: null })
  case SET_ACCOUNT_SEARCH_LIST_KEYWORD:
    return state.set('accountSearchListKeyword', payload)
  case BUZZ_TITLE_MODAL:
    return state.set('buzzTitleModalStatus', payload)
  case DRAFTS_MODAL:
    return state.set('draftsModalStatus', payload)
  case SAVE_DRAFTS_MODAL:
    return state.set('saveDraftsModalStatus', payload)
  case SET_VIEW_IMAGE_MODAL:
    return state.set('viewImageModal', payload)
  case SET_LINK_CONFIRMATION_MODAL:
    return state.set('linkConfirmationModal', payload)
  default:
    return state
  }
}
