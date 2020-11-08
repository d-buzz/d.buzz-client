export const AUTHENTICATE_USER_REQUEST = 'AUTHENTICATE_USER_REQUEST'
export const AUTHENTICATE_USER_SUCCESS = 'AUTHENTICATE_USER_SUCCESS'
export const AUTHENTICATE_USER_FAILURE = 'AUTHENTICATE_USER_FAILURE'

export const authenticateUserRequest = (username, password, useKeychain) => ({
  type: AUTHENTICATE_USER_REQUEST,
  payload: { username, password, useKeychain },
  meta: {
    thunk: true,
  },
})

export const authenticateUserSuccess = (response, meta) => ({
  type: AUTHENTICATE_USER_SUCCESS,
  payload: response,
  meta,
})

export const authenticateUserFailure = (error, meta) => ({
  type: AUTHENTICATE_USER_FAILURE,
  payload: error,
  meta,
})

export const SIGNOUT_USER_REQUEST = 'SIGNOUT_USER_REQUEST'
export const SIGNOUT_USER_SUCCESS = 'SIGNOUT_USER_SUCCESS'
export const SIGNOUT_USER_FAILURE = 'SIGNOUT_USER_FAILURE'

export const signoutUserRequest = () => ({
  type: SIGNOUT_USER_REQUEST,
  meta: {
    thunk: true,
  },
})

export const signoutUserSuccess = (response, meta) => ({
  type: SIGNOUT_USER_SUCCESS,
  payload: response,
  meta,
})

export const signoutUserFailure = (error, meta) => ({
  type: SIGNOUT_USER_FAILURE,
  payload: error,
  meta,
})

export const GET_SAVED_USER_REQUEST = 'GET_SAVED_USER_REQUEST'
export const GET_SAVED_USER_SUCCESS = 'GET_SAVED_USER_SUCCESS'
export const GET_SAVED_USER_FAILURE = 'GET_SAVED_USER_FAILURE'

export const getSavedUserRequest = () => ({
  type:  GET_SAVED_USER_REQUEST,
  meta: {
    thunk: true,
  },
})

export const getSavedUserSuccess = (response, meta) => ({
  type: GET_SAVED_USER_SUCCESS,
  payload: response,
  meta,
})

export const getSavedUserFailure = (error, meta) => ({
  type: GET_SAVED_USER_FAILURE,
  payload: error,
  meta: {
    thunk: true,
  },
})

export const SUBSCRIBE_REQUEST = 'SUBSCRIBE_REQUEST'
export const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS'
export const SUBSCRIBE_FAILURE = 'SUBSCRIBE_FAILURE'

export const subscribeRequest = () => ({
  type: SUBSCRIBE_REQUEST,
  meta: {
    thunk: true,
  },
})

export const subscribeSuccess = (result, meta) => ({
  type: SUBSCRIBE_SUCCESS,
  payload: result,
  meta,
})

export const subscribeFailure = (error, meta) => ({
  type: SUBSCRIBE_FAILURE,
  payload: error,
  meta,
})

export const CHECK_HAS_UPDATE_AUTHORITY_REQUEST = 'CHECK_HAS_UPDATE_AUTHORITY_REQUEST'
export const CHECK_HAS_UPDATE_AUTHORITY_SUCCESS = 'CHECK_HAS_UPDATE_AUTHORITY_SUCCESS'
export const CHECK_HAS_UPDATE_AUTHORITY_FAILURE = 'CHECK_HAS_UPDATE_AUTHORITY_FAILURE'

export const checkHasUpdateAuthorityRequest = (author) => ({
  type: CHECK_HAS_UPDATE_AUTHORITY_REQUEST,
  payload: { author },
  meta: {
    thunk: true,
  },
})

export const checkHasUpdateAuthoritySuccess = (response, meta) => ({
  type: CHECK_HAS_UPDATE_AUTHORITY_SUCCESS,
  payload: response,
  meta,
})

export const checkHasUpdateAuthorityFailure = (error, meta) => ({
  type: CHECK_HAS_UPDATE_AUTHORITY_FAILURE,
  payload: error,
  meta,
})

export const SET_FROM_LANDING = 'SET_FROM_LANDING'

export const setFromLanding = (status) => ({
  type: SET_FROM_LANDING,
  payload: { status },
})

export const SET_MUTE_LIST = 'SET_MUTE_LIST'
export const GET_MUTE_LIST = 'GET_MUTE_LIST'

export const setMuteList = (response) => ({
  type: SET_MUTE_LIST,
  payload: response,
})
