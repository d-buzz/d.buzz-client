
export const POLL_NOTIF_REQUEST = 'POLL_NOTIF_REQUEST'
export const POLL_NOTIF_SUCCESS = 'POLL_NOTIF_SUCCESS'
export const POLL_NOTIF_FAILURE = 'POLL_NOTIF_FAILURE'
export const POLL_NOTIF_COUNT = 'POLL_NOTIF_COUNT'

export const pollNotifRequest = () => ({
  type: POLL_NOTIF_REQUEST,
  meta: {
    thunk: true,
  }
})

export const pollNotifSuccess = (response, meta) => ({
  type: POLL_NOTIF_SUCCESS,
  payload: response,
  meta,
})

export const pollNotifFailure = (error, meta) => ({
  type: POLL_NOTIF_FAILURE,
  payload: error,
  meta,
})

export const pollNotifCount = (response) => ({
  type: POLL_NOTIF_COUNT,
  payload: response,
})
