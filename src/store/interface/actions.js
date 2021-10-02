export const OPEN_REPLY_MODAL = 'OPEN_REPLY_MODAL'
export const CLOSE_REPLY_MODAL = 'CLOSE_REPLY_MODAL'

export const openReplyModal = (author, permlink, content, treeHistory, replyRef = 'list') => ({
  type: OPEN_REPLY_MODAL,
  payload: { open:true, author, permlink, content, treeHistory, replyRef },
})

export const closeReplyModal = () => ({
  type: CLOSE_REPLY_MODAL,
  payload: { open: false },
})

export const BROADCAST_NOTIFICATION = 'BROADCAST_NOTIFICATION'

export const broadcastNotification = (severity, message) => ({
  type: BROADCAST_NOTIFICATION,
  payload: { open: true, severity, message },
})

export const OPEN_USER_DIALOG = 'OPEN_USER_DIALOG'
export const CLOSE_USER_DIALOG = 'CLOSE_USER_DIALOG'

export const openUserDialog = (anchorEl, author) => ({
  type: OPEN_USER_DIALOG,
  payload: { open: true, author, anchorEl },
})

export const closeUserDialog = () => ({
  type: CLOSE_USER_DIALOG,
  payload: { open: false },
})

export const SAVE_SCROLL_INDEX = 'SAVE_SCROLL_INDEX'

export const saveScrollIndex = (index) => ({
  type: SAVE_SCROLL_INDEX,
  payload: index,
})

export const CLEAR_SCROLL_INDEX = 'CLEAR_SCROLL_INDEX'

export const clearScrollIndex = () => ({
  type: CLEAR_SCROLL_INDEX,
})

export const SET_WHATS_NEW_MODAL_STATUS = 'SET_WHATS_NEW_MODAL_STATUS'

export const setWhatsNewModalStatus = (status) => ({
  type: SET_WHATS_NEW_MODAL_STATUS,
  payload: status,
})

export const SET_BUZZ_CONFIRM_MODAL_STATUS = 'SET_BUZZ_CONFIRM_MODAL_STATUS'

export const setBuzzConfirmModalStatus = (status) => ({
  type: SET_BUZZ_CONFIRM_MODAL_STATUS,
  payload: status,
})

export const SET_BUZZ_MODAL_STATUS = 'SET_BUZZ_MODAL_STATUS'

export const setBuzzModalStatus = (status) => ({
  type: SET_BUZZ_MODAL_STATUS,
  payload: status,
})

export const SET_TWITTER_HEIGHTS = 'SET_TWITTER_HEIGHTS'

export const setTwitterHeights = (payload) => ({
  type: SET_TWITTER_HEIGHTS,
  payload: { payload },
})

export const OPEN_MUTE_DIALOG = 'OPEN_MUTE_DIALOG'
export const CLOSE_MUTE_DIALOG = 'CLOSE_MUTE_DIALOG'

export const openMuteDialog = (username, muteSuccessCallback = null) => ({
  type: OPEN_MUTE_DIALOG,
  payload: { username, muteSuccessCallback },
})

export const closeMuteDialog = () => ({
  type: CLOSE_MUTE_DIALOG,
})

export const OPEN_HIDE_BUZZ_DIALOG = 'OPEN_HIDE_BUZZ_DIALOG'
export const CLOSE_HIDE_BUZZ_DIALOG = 'CLOSE_HIDE_BUZZ_DIALOG'

export const openHideBuzzDialog = (author, permlink, hideBuzzSuccesCallback = null) => ({
  type: OPEN_HIDE_BUZZ_DIALOG,
  payload: { author, permlink, hideBuzzSuccesCallback },
})

export const closeHideBuzzDialog = () => ({
  type: CLOSE_HIDE_BUZZ_DIALOG,
})


export const OPEN_CENSORSHIP_DIALOG = 'OPEN_CENSORSHIP_DIALOG'
export const CLOSE_CENSOSHIP_DIALOG = 'CLOSE_CENSORSHIP_DIALOG'

export const openCensorshipDialog = (author, permlink, callback = null) => ({
  type: OPEN_CENSORSHIP_DIALOG,
  payload: { author, permlink, callback },
})

export const closeCensorshipDialog = () => ({
  type: CLOSE_CENSOSHIP_DIALOG,
})

export const SET_REFRESH_ROUTE_STATUS = 'SET_REFRESH_ROUTE_STATUS'
export const setRefreshRouteStatus = (pathname, timestamp) => ({
  type: SET_REFRESH_ROUTE_STATUS,
  payload: { pathname, timestamp },
})


export const CLEAR_REFRESH_ROUTE_STATUS = 'CLEAR_REFRESH_ROUTE_STATUS'
export const clearRefreshRouteStatus = () => ({
  type: CLEAR_REFRESH_ROUTE_STATUS,
})

export const OPEN_FOLLOW_MUTED_DIALOG = 'OPEN_FOLLOW_MUTED_DIALOG'
export const CLOSE_FOLLOW_MUTED_DIALOG = 'CLOSE_FOLLOW_MUTED_DIALOG'

export const openFollowMutedDialog = (username, followMutedSuccessCallback = null) => ({
  type: OPEN_FOLLOW_MUTED_DIALOG,
  payload: { username, followMutedSuccessCallback },
})

export const closeFollowMutedDialog = () => ({
  type: CLOSE_FOLLOW_MUTED_DIALOG,
})


export const OPEN_FOLLOW_BLACKLISTS_DIALOG = 'OPEN_FOLLOW_BLACKLISTS_DIALOG'
export const CLOSE_FOLLOW_BLACKLISTS_DIALOG = 'CLOSE_FOLLOW_BLACKLISTS_DIALOG'

export const openFollowBlacklistsDialog = (username, followBlacklistsSuccessCallback = null) => ({
  type: OPEN_FOLLOW_BLACKLISTS_DIALOG,
  payload: { username, followBlacklistsSuccessCallback },
})

export const closeFollowBlacklistsDialog = () => ({
  type: CLOSE_FOLLOW_BLACKLISTS_DIALOG,
})


export const OPEN_BLACKLIST_DIALOG = 'OPEN_BLACKLIST_DIALOG'
export const CLOSE_BLACKLIST_DIALOG = 'CLOSE_BLACKLIST_DIALOG'

export const openBlacklistDialog = (username, blacklistSuccessCallback = null) => ({
  type: OPEN_BLACKLIST_DIALOG,
  payload: { username, blacklistSuccessCallback },
})

export const closeBlacklistDialog = () => ({
  type: CLOSE_BLACKLIST_DIALOG,
})

export const SHOW_ACCOUNT_SEARCH_BUTTON = 'SHOW_ACCOUNT_SEARCH_BUTTON'
export const HIDE_ACCOUNT_SEARCH_BUTTON = 'HIDE_ACCOUNT_SEARCH_BUTTON'

export const showAccountSearchButton = (list_type) => ({
  type: SHOW_ACCOUNT_SEARCH_BUTTON,
  payload: { list_type },
})

export const hideAccountSearchButton = () => ({
  type: HIDE_ACCOUNT_SEARCH_BUTTON,
})

export const SET_ACCOUNT_SEARCH_LIST_KEYWORD = 'SET_ACCOUNT_SEARCH_LIST_KEYWORD'
export const setAccountSearchListKeyword = (keyword) => ({
  type: SET_ACCOUNT_SEARCH_LIST_KEYWORD,
  payload: keyword,
})

// buzz title
export const BUZZ_TITLE_MODAL = 'BUZZ_TITLE'

export const setBuzzTitleModalStatus = (title) => ({
  type: BUZZ_TITLE_MODAL,
  payload: title,
})