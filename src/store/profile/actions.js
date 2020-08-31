export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST'
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE'

export const getProfileRequest = (username) => ({
  type: GET_PROFILE_REQUEST,
  payload: { username },
  meta: {
    thunk: true,
  },
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

export const getAccountPostsRequest = (username, start_permlink = '', start_author = '') => ({
  type: GET_ACCOUNT_POSTS_REQUEST,
  payload: { username, start_permlink, start_author },
  meta: {
    thunk: true,
  },
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

export const GET_ACCOUNT_REPLIES_REQUEST = 'GET_ACCOUNT_REPLIES_REQUEST'
export const GET_ACCOUNT_REPLIES_SUCCESS = 'GET_ACCOUNT_REPLIES_SUCCESS'
export const GET_ACCOUNT_REPLIES_FAILURE = 'GET_ACCOUNT_REPLIES_FAILURE'

export const getAccountRepliesRequest = (username, start_permlink = '', start_author = '') => ({
  type: GET_ACCOUNT_REPLIES_REQUEST,
  payload: { username, start_permlink, start_author },
  meta: {
    thunk: true,
  },
})

export const getAccountRepliesSuccess = (response, meta) => ({
  type: GET_ACCOUNT_REPLIES_SUCCESS,
  payload: response,
  meta,
})

export const getAccountRepliesFailure = (error, meta) => ({
  type: GET_ACCOUNT_REPLIES_FAILURE,
  payload: error,
  meta,
})

export const SET_LAST_ACCOUNT_POSTS = 'SET_LAST_ACCOUNT_POSTS'

export const setLastAccountPosts = (response) => ({
  type: SET_LAST_ACCOUNT_POSTS,
  payload: response,
})

export const SET_PROFILE_IS_VISITED = 'SET_PROFILE_IS_VISITED'

export const setProfileIsVisited = (visited = true) => ({
  type: SET_PROFILE_IS_VISITED,
  payload: visited,
})

export const CLEAR_ACCOUNT_POSTS = 'CLEAR_ACCOUNT_POSTS'

export const clearAccountPosts = () => ({
  type: CLEAR_ACCOUNT_POSTS,
})

export const CLEAR_ACCOUNT_REPLIES = 'CLEAR_ACCOUNT_REPLIES'

export const clearAccountReplies = () => ({
  type: CLEAR_ACCOUNT_REPLIES,
})

export const CLEAR_ACCOUNT_FOLLOWERS = 'CLEAR_FOLLOWERS'

export const clearAccountFollowers = () => ({
  type: CLEAR_ACCOUNT_FOLLOWERS,
})

export const CLEAR_PROFILE = 'CLEAR_PROFILE'

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
})


export const SET_LAST_ACCOUNT_REPLY = 'SET_LAST_ACCOUNT_REPLY'

export const setLastAccountReply = (response) => ({
  type: SET_LAST_ACCOUNT_REPLY,
  payload: response,
})

export const GET_FOLLOWERS_REQUEST = 'GET_FOLLOWERS_REQUEST'
export const GET_FOLLOWERS_SUCCESS = 'GET_FOLLOWERS_SUCCESS'
export const GET_FOLLOWERS_FAILURE = 'GET_FOLLOWERS_fAILURE'

export const getFollowersRequest = (username, start_follower = '') => ({
  type: GET_FOLLOWERS_REQUEST,
  payload: { username, start_follower },
  meta: {
    thunk: true,
  },
})

export const getFollowersSuccess = (response, meta) => ({
  type: GET_FOLLOWERS_SUCCESS,
  payload: response,
  meta,
})

export const getFollowersFailure = (error, meta) => ({
  type: GET_FOLLOWERS_FAILURE,
  payload: error,
  meta,
})

export const SET_LAST_FOLLOWER = 'SET_LAST_FOLLOWER'

export const setLastFollower = (response) => ({
  type: SET_LAST_FOLLOWER,
  payload: response,
})

export const GET_FOLLOWING_REQUEST = 'GET_FOLLOWING_REQUEST'
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWING_SUCCESS'
export const GET_FOLLOWING_FAILURE = 'GET_FOLLOWING_FAILURE'

export const getFollowingRequest = (username, start_following = '') => ({
  type: GET_FOLLOWING_REQUEST,
  payload: { username, start_following },
  meta: {
    thunk: true,
  },
})

export const getFollowingSuccess = (response, meta) => ({
  type: GET_FOLLOWING_SUCCESS,
  payload: response,
  meta,
})

export const getFollowingFailure = (error, meta) => ({
  type: GET_FOLLOWING_FAILURE,
  payload: error,
  meta,
})

export const SET_LAST_FOLLOWING = 'SET_LAST_FOLLOWING'

export const setLastFollowing = (response) => ({
  type: SET_LAST_FOLLOWING,
  payload: response,
})

export const CLEAR_ACCOUNT_FOLLOWING = 'CLEAR_FOLLOWING'

export const clearAccountFollowing = () => ({
  type: CLEAR_ACCOUNT_FOLLOWING,
})

export const CLEAR_NOTIFICATIONS_REQUEST = 'CLEAR_NOTIFICATIONS_REQUEST'
export const CLEAR_NOTIFICATIONS_SUCCESS = 'CLEAR_NOTIFICATIONS_SUCCESS'
export const CLEAR_NOTIFICATIONS_FAILURE = 'CLEAR_NOTIFICATIONS_FAILURE'

export const clearNotificationsRequest = () => ({
  type: CLEAR_NOTIFICATIONS_REQUEST,
  meta: {
    thunk: true,
  },
})

export const clearNotificationsSuccess = (response, meta) => ({
  type: CLEAR_NOTIFICATIONS_SUCCESS,
  payload: response,
  meta,
})

export const clearNotificationsFailure = (error, meta) => ({
  type: CLEAR_NOTIFICATIONS_FAILURE,
  payload: error,
  meta,
})
