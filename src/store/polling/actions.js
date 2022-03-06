
export const POLL_NOTIF_REQUEST = 'POLL_NOTIF_REQUEST'
export const POLL_NOTIF_SUCCESS = 'POLL_NOTIF_SUCCESS'
export const POLL_NOTIF_FAILURE = 'POLL_NOTIF_FAILURE'
export const POLL_NOTIF_COUNT = 'POLL_NOTIF_COUNT'

export const pollNotifRequest = () => ({
  type: POLL_NOTIF_REQUEST,
})

export const pollNotifSuccess = (response) => ({
  type: POLL_NOTIF_SUCCESS,
  payload: response,
})

export const pollNotifFailure = (error) => ({
  type: POLL_NOTIF_FAILURE,
  payload: error,
})

export const pollNotifCount = (response) => ({
  type: POLL_NOTIF_COUNT,
  payload: response,
})

export const FILTER_NOTIFICATIONS_REQUEST = 'FILTER_NOTIFICATIONS_REQUEST'
export const FILTER_NOTIFICATIONS_SUCCESS = 'FILTER_NOTIFICATIONS_SUCCESS'
export const FILTER_NOTIFICATIONS_FAILURE = 'FILTER_NOTIFICATIONS_FAILURE'

export const filterNotificationRequest = (name) => ({
  type: FILTER_NOTIFICATIONS_REQUEST,
  payload: { name },
  meta: {
    thunk: true,
  },
})

export const filterNotificationsSuccess = (response) => ({
  type: FILTER_NOTIFICATIONS_SUCCESS,
  payload: response,
})

export const filterNotificationsFailure = (error, meta) => ({
  type: FILTER_NOTIFICATIONS_FAILURE,
  payload: error,
  meta,
})

export const HAS_CONNECTION_REQUEST = 'HAS_CONNECTION_REQUEST'
export const HAS_CONNECTION_SUCCESS = 'HAS_CONNECTION_SUCCESS'
export const HAS_CONNECTION_FAILURE = 'HAS_CONNECTION_FAILURE'

export const hasConnectionRequest = () => ({
  type: HAS_CONNECTION_REQUEST,
})

export const hasConnectionSuccess = (response) => ({
  type: HAS_CONNECTION_SUCCESS,
  payload: response
})

export const hasConnectionFailure = (error) => ({
  type: HAS_CONNECTION_FAILURE,
  payload: error
})