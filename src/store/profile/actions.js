export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST'
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE'

export const getProfileRequest = (username) => ({
  type: GET_PROFILE_REQUEST,
  payload: { username },
  meta: {
    thunk: true,
  }
})

export const getProfileSuccess = (response, meta) => ({
  type: GET_PROFILE_SUCCESS,
  payload: response,
  meta,
})

export const getProfileFailure = (error, meta) => ({
  type: GET_PROFILE_FAILURE,
  payload: error,
  meta,
})

export const GET_ACCOUNT_POSTS_REQUEST = 'GET_ACCOUNT_POSTS_REQUEST'
export const GET_ACCOUNT_POSTS_SUCCESS = 'GET_ACCOUNT_POSTS_SUCCESS'
export const GET_ACCOUNT_POSTS_FAILURE = 'GET_ACCOUNT_POSTS_FAILURE'

export const getAccountPostsRequest = (username, start_permlink = '') => ({
  type: GET_ACCOUNT_POSTS_REQUEST,
  payload: { username, start_permlink },
  meta: {
    thunk: true,
  }
})

export const getAccountPostsSuccess = (response, meta) => ({
  type: GET_ACCOUNT_POSTS_SUCCESS,
  payload: response,
  meta,
})

export const getAccountPostsFailure = (error, meta) => ({
  type: GET_ACCOUNT_POSTS_FAILURE,
  payload: error,
  meta,
})
