
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

export const FILTER_NOTIFICATION_REQUEST = 'FILTER_NOTIFICATIONS_REQUEST'
export const FILTER_NOTIFICATIONS_FAILURE = 'FILTER_NOTIFICATIONS_FAILURE'

export const filterNotificationRequest = (name) => ({
  type: FILTER_NOTIFICATION_REQUEST,
  payload: { name },
  meta: {
    thunk: true,
  },
})

export const filterNotificationsFailure = (error, meta) => ({
  type: FILTER_NOTIFICATIONS_FAILURE,
  payload: error,
  meta,
})