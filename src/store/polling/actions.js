
export const POLL_NOTIF_REQUEST = 'POLL_NOTIF_REQUEST'
export const POLL_NOTIF_SUCCESS = 'POLL_NOTIF_SUCCESS'
export const POLL_NOTIF_FAILURE = 'POLL_NOTIF_FAILURE'

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
