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

export const getAccountPostsRequest = (username, start_permlink = null, start_author = null) => ({
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

export const GET_ACCOUNT_COMMENTS_REQUEST = 'GET_ACCOUNT_COMMENTS_REQUEST'
export const GET_ACCOUNT_COMMENTS_SUCCESS = 'GET_ACCOUNT_COMMENTS_SUCCESS'
export const GET_ACCOUNT_COMMENTS_FAILURE = 'GET_ACCOUNT_COMMNETS_FAILURE'

export const getAccountCommentsRequest = (username, start_permlink = null, start_author = null) => ({
  type: GET_ACCOUNT_COMMENTS_REQUEST,
  payload: { username, start_permlink, start_author },
  meta: {
    thunk: true,
  },
})

export const getAccountCommentsSucess = (response, meta) => ({
  type: GET_ACCOUNT_COMMENTS_SUCCESS,
  payload: response,
  meta,
})

export const getAccountCommentsFailure = (error, meta) => ({
  type: GET_ACCOUNT_COMMENTS_FAILURE,
  payload: error,
  meta,
})

export const SET_LAST_ACCOUNT_COMMENT = 'SET_LAST_ACCOUNT_COMMENT'

export const setLastAccountComment = (response) => ({
  type: SET_LAST_ACCOUNT_COMMENT,
  payload: response,
})

export const CLEAR_ACCOUNT_COMMENTS = 'CLEAR_ACCOUNT_COMMENTS'

export const clearAccountComments = () => ({
  type: CLEAR_ACCOUNT_COMMENTS,
})


export const GET_ACCOUNT_LIST_REQUEST = 'GET_ACCOUNT_LIST_REQUEST'
export const GET_ACCOUNT_LIST_SUCCESS = 'GET_ACCOUNT_LIST_SUCCESS'
export const GET_ACCOUNT_LIST_FAILURE = 'GET_ACCOUNT_LIST_FAILURE'
export const getAccountListRequest = (observer, list_type, lastIndex=0, filter=true) => ({
  type: GET_ACCOUNT_LIST_REQUEST,
  payload: { observer, list_type, lastIndex, filter},
  meta: {
    thunk: true,
  },
})

export const getAccountListSuccess = (response, meta) => ({
  type: GET_ACCOUNT_LIST_SUCCESS,
  payload: response,
  meta,
})

export const getAccountListFailure = (error, meta) => ({
  type: GET_ACCOUNT_LIST_FAILURE,
  payload: error,
  meta,
})

export const SET_ACCOUNT_BLACKLIST = 'SET_ACCOUNT_BLACKLIST'
export const setAccountBlacklist = (response) => ({
  type: SET_ACCOUNT_BLACKLIST,
  payload: response,
})

export const SET_ACCOUNT_FOLLOWED_BLACKLIST = 'SET_ACCOUNT_FOLLOWED_BLACKLIST'
export const setAccountFollowedBlacklist = (response) => ({
  type: SET_ACCOUNT_FOLLOWED_BLACKLIST,
  payload: response,
})

export const SET_ACCOUNT_MUTED_LIST = 'SET_ACCOUNT_MUTED_LIST'
export const setAccountMutedList = (response) => ({
  type: SET_ACCOUNT_MUTED_LIST,
  payload: response,
})

export const SET_ACCOUNT_FOLLOWED_MUTED_LIST = 'SET_ACCOUNT_FOLLOWED_MUTED_LIST'
export const setAccountFollowedMutedList = (response) => ({
  type: SET_ACCOUNT_FOLLOWED_MUTED_LIST,
  payload: response,
})

export const CLEAR_ACCOUNT_BLACKLIST = 'CLEAR_ACCOUNT_BLACKLIST'
export const clearAccountBlacklist = () => ({
  type: CLEAR_ACCOUNT_BLACKLIST,
})

export const CLEAR_ACCOUNT_FOLLOWED_BLACKLIST = 'CLEAR_ACCOUNT_FOLLOWED_BLACKLIST'
export const clearAccountFollowedBlacklist = () => ({
  type: CLEAR_ACCOUNT_FOLLOWED_BLACKLIST,
})

export const CLEAR_ACCOUNT_MUTED_LIST = 'CLEAR_ACCOUNT_MUTED_LIST'
export const clearAccountMutedList = () => ({
  type: CLEAR_ACCOUNT_MUTED_LIST,
})

export const CLEAR_ACCOUNT_FOLLOWED_MUTED_LIST = 'CLEAR_ACCOUNT_FOLLOWED_MUTED_LIST'
export const clearAccountFollowedMutedList = () => ({
  type: CLEAR_ACCOUNT_FOLLOWED_MUTED_LIST,
})

export const CHECK_ACCOUNT_FOLLOWS_LIST_REQUEST = 'CHECK_ACCOUNT_FOLLOWS_LIST_REQUEST'
export const CHECK_ACCOUNT_FOLLOWS_LIST_SUCCESS = 'CHECK_ACCOUNT_FOLLOWS_LIST_SUCCESS'
export const CHECK_ACCOUNT_FOLLOWS_LIST_FAILURE = 'CHECK_ACCOUNT_FOLLOWS_LIST_FAILURE'
export const CheckAccountFollowsListRequest = (observer) => ({
  type: CHECK_ACCOUNT_FOLLOWS_LIST_REQUEST,
  payload: { observer },
  meta: {
    thunk: true,
  },
})

export const checkAccountFollowsListSuccess = (response, meta) => ({
  type: CHECK_ACCOUNT_FOLLOWS_LIST_SUCCESS,
  payload: response,
  meta,
})

export const checkAccountFollowsListFailure = (error, meta) => ({
  type: CHECK_ACCOUNT_FOLLOWS_LIST_FAILURE,
  payload: error,
  meta,
})

export const SET_ACCOUNT_LIST_SEARCHKEY = 'SET_ACCOUNT_LIST_SEARCHKEY'
export const setAccountListSearchkey = (list_type, keyword=null) => ({
  type: SET_ACCOUNT_LIST_SEARCHKEY,
  payload: { list_type, keyword },
})

export const CHECK_ACCOUNT_EXIST_REQUEST = 'CHECK_ACCOUNT_EXIST_REQUEST'
export const CHECK_ACCOUNT_EXIST_SUCCESS = 'CHECK_ACCOUNT_EXIST_SUCCESS'
export const CHECK_ACCOUNT_EXIST_FAILURE = 'CHECK_ACCOUNT_EXIST_FAILURE'
export const checkAccountExistRequest = (username) => ({
  type: CHECK_ACCOUNT_EXIST_REQUEST,
  payload: { username },
  meta: {
    thunk: true,
  },
})

export const checkAccountExistSuccess = (response, meta) => ({
  type: CHECK_ACCOUNT_EXIST_SUCCESS,
  payload: response,
  meta,
})

export const checkAccountExistFailure = (error, meta) => ({
  type: CHECK_ACCOUNT_EXIST_FAILURE,
  payload: error,
  meta,
})

export const SET_MUTE_LIST_LAST_INDEX = 'SET_MUTE_LIST_LAST_INDEX'
export const setMuteListLastIndex = (response) => ({
  type: SET_MUTE_LIST_LAST_INDEX,
  payload: response,
})

export const SET_MUTE_LIST_UNFILTERED = 'SET_MUTE_LIST_UNFILTERED'
export const setMuteListUnfiltered = (response) => ({
  type: SET_MUTE_LIST_UNFILTERED,
  payload: response,
})

export const SET_BLACKLIST_LAST_INDEX = 'SET_BLACKLIST_LAST_INDEX'
export const setBlacklistLastIndex = (response) => ({
  type: SET_BLACKLIST_LAST_INDEX,
  payload: response,
})

export const SET_BLACKLIST_UNFILTERED = 'SET_BLACKLIST_UNFILTERED'
export const setBlacklistUnfiltered = (response) => ({
  type: SET_BLACKLIST_UNFILTERED,
  payload: response,
})


export const SET_FOLLOW_BLACKLIST_LAST_INDEX = 'SET_FOLLOW_BLACKLIST_LAST_INDEX'
export const setFollowBlacklistLastIndex = (response) => ({
  type: SET_FOLLOW_BLACKLIST_LAST_INDEX,
  payload: response,
})

export const SET_FOLLOW_BLACKLIST_UNFILTERED = 'SET_FOLLOW_BLACKLIST_UNFILTERED'
export const setFollowBlacklistUnfiltered = (response) => ({
  type: SET_FOLLOW_BLACKLIST_UNFILTERED,
  payload: response,
})


export const SET_FOLLOW_MUTED_LAST_INDEX = 'SET_FOLLOW_MUTED_LAST_INDEX'
export const setFollowMutedLastIndex = (response) => ({
  type: SET_FOLLOW_MUTED_LAST_INDEX,
  payload: response,
})

export const SET_FOLLOW_MUTED_UNFILTERED = 'SET_FOLLOW_MUTED_UNFILTERED'
export const setFollowMutedUnfiltered = (response) => ({
  type: SET_FOLLOW_MUTED_UNFILTERED,
  payload: response,
})


export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST'
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS'
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE'
export const updateProfileRequest = (account, posting_json_metadata) => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: { account, posting_json_metadata },
  meta: {
    thunk: true,
  },
})

export const updateProfileSuccess = (response, meta) => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: response,
  meta,
})

export const updateProfileFailure = (error, meta) => ({
  type: UPDATE_PROFILE_FAILURE,
  payload: error,
  meta,
})

export const UPDATE_PROFILE_METADATA = 'UPDATE_PROFILE_METADATA'
export const updateProfileMetadata = (metadata) => ({
  type: UPDATE_PROFILE_METADATA,
  payload: metadata,
})
