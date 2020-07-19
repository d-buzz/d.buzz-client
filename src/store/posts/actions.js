export const GET_RANKED_POST_REQUEST = 'GET_RANKED_POST_REQUEST'
export const GET_RANKED_POST_SUCCESS = 'GET_RANKED_POST_SUCCESS'
export const GET_RANKED_POST_FAILURE = 'GET_RANKED_POST_FAILURE'

export const getRankedPostRequest = (sort = 'trending', start_permlink = '', start_author = '') => ({
  type: GET_RANKED_POST_REQUEST,
  payload: { sort, start_permlink, start_author },
  meta: {
    thunk: true,
  },
})

export const getRankedPostSuccess = (response, meta) => ({
  type: GET_RANKED_POST_SUCCESS,
  payload: response,
  meta,
})

export const getRankedPostFailure = (error, meta) => ({
  type: GET_RANKED_POST_FAILURE,
  payload: error,
  meta,
})

export const SET_LAST_POST = 'SET_LAST_POST'

export const setLastPost = (post) => ({
  type: SET_LAST_POST,
  payload: post,
})

export const GET_REPLIES_REQUEST = 'GET_REPLIES_REQUEST'
export const GET_REPLIES_SUCCESS = 'GET_REPLIES_SUCCESS'
export const GET_REPLIES_FAILURE = 'GET_REPLIES_FAILURE'

export const getRepliesRequest = (author, permlink) => ({
  type: GET_REPLIES_REQUEST,
  payload: { author, permlink },
  meta: {
    thunk: true,
  },
})

export const getRepliesSuccess = (response, meta) => ({
  type: GET_REPLIES_SUCCESS,
  payload: response,
  meta,
})

export const getRepliesFailure = (error, meta) => ({
  type: GET_REPLIES_FAILURE,
  payload: error,
  meta,
})

export const GET_CONTENT_REQUEST = 'GET_CONTENT_REQUEST'
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS'
export const GET_CONTENT_FAILURE = 'GET_CONTENT_FAILURE'

export const getContentRequest = (author, permlink) => ({
  type: GET_CONTENT_REQUEST,
  payload: { author, permlink },
  meta: {
    thunk: true,
  }
})

export const getContentSuccess = (response, meta) => ({
  type: GET_CONTENT_SUCCESS,
  payload: response,
  meta,
})

export const getContentFailure = (error, meta) => ({
  type: GET_CONTENT_FAILURE,
  payload: error,
  meta,
})

export const SET_HOME_IS_VISITED = 'SET_HOME_IS_VISITED'

export const setHomeIsVisited = (visited = true) => ({
  type: SET_HOME_IS_VISITED,
  payload: visited,
})
