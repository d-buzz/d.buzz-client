export const UPVOTE_REQUEST = 'UPVOTE_REQUEST'
export const UPVOTE_SUCCESS = 'UPVOTE_SUCCESS'
export const UPVOTE_FAILURE = 'UPVOTE_FAILURE'

export const upvoteRequest = (author, permlink, percentage) => ({
  type: UPVOTE_REQUEST,
  payload: { author, permlink, percentage },
  meta: {
    thunk: true,
  },
})

export const upvoteSuccess = (response, meta) => ({
  type: UPVOTE_SUCCESS,
  payload: response,
  meta,
})

export const upvoteFailure = (error, meta) => ({
  type: UPVOTE_FAILURE,
  payload: error,
  meta,
})

export const GET_HOME_POSTS_REQUEST = 'GET_HOME_POSTS_REQUEST'
export const GET_HOME_POSTS_SUCCESS = 'GET_HOME_POSTS_SUCCESS'
export const GET_HOME_POSTS_FAILURE = 'GET_HOME_POSTS_FAILURE'

export const getHomePostsRequest = (start_permlink = null, start_author = null) => ({
  type: GET_HOME_POSTS_REQUEST,
  payload: { start_permlink, start_author },
  meta: {
    thunk: true,
  },
})

export const getHomePostsSuccess = (response, meta) => ({
  type: GET_HOME_POSTS_SUCCESS,
  payload: response,
  meta,
})

export const getHomePostsFailure = (error, meta) => ({
  type: GET_HOME_POSTS_FAILURE,
  payload: error,
  meta,
})

export const SET_HOME_LAST_POST = 'SET_HOME_LAST_POST'

export const setHomeLastPost = (post) => ({
  type: SET_HOME_LAST_POST,
  payload: post,
})

export const GET_TRENDING_POSTS_REQUEST = 'GET_TRENDING_POSTS_REQUEST'
export const GET_TRENDING_POSTS_SUCCESS = 'GET_TRENDING_POSTS_SUCCESS'
export const GET_TRENDING_POSTS_FAILURE = 'GET_TRENDING_POSTS_FAILURE'

export const getTrendingPostsRequest = (start_permlink = '', start_author = '') => ({
  type: GET_TRENDING_POSTS_REQUEST,
  payload: { start_permlink, start_author },
  meta: {
    thunk: true,
  },
})

export const getTrendingPostsSuccess = (response, meta) => ({
  type: GET_TRENDING_POSTS_SUCCESS,
  payload: response,
  meta,
})

export const getTrendingPostsFailure = (error, meta) => ({
  type: GET_TRENDING_POSTS_FAILURE,
  payload: error,
  meta,
})

export const SET_TRENDING_LAST_POST = 'SET_TRENDING_LAST_POST'

export const setTrendingLastPost = (post) => ({
  type: SET_TRENDING_LAST_POST,
  payload: post,
})

export const GET_LATEST_POSTS_REQUEST = 'GET_LATEST_POSTS_REQUEST'
export const GET_LATEST_POSTS_SUCCESS = 'GET_LATEST_POSTS_SUCCESS'
export const GET_LATEST_POSTS_FAILURE = 'GET_LATEST_POSTS_FAILURE'

export const getLatestPostsRequest = (start_permlink = '', start_author = '') => ({
  type: GET_LATEST_POSTS_REQUEST,
  payload: { start_permlink, start_author },
  meta: {
    thunk: true,
  },
})

export const getLatestPostsSuccess = (response, meta) => ({
  type: GET_LATEST_POSTS_SUCCESS,
  payload: response,
  meta,
})

export const getLatestPostsFailure = (error, meta) => ({
  type: GET_LATEST_POSTS_FAILURE,
  payload: error,
  meta,
})

export const SET_LATEST_LAST_POST = 'SET_LATEST_LAST_POST'

export const setLatestLastPost = (post) => ({
  type: SET_LATEST_LAST_POST,
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
  },
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

export const GET_ACTIVE_VOTES_REQUEST = 'GET_ACTIVE_VOTES_REQUEST'
export const GET_ACTIVE_VOTES_SUCCESS = 'GET_ACTIVE_VOTES_SUCCESS'
export const GET_ACTIVE_VOTES_FAILURE = 'GET_ACTIVE_VOTES_FAILURE'

export const getActiveVotesRequest = (author, permlink) => ({
  type: GET_ACTIVE_VOTES_REQUEST,
  payload: { author, permlink },
  meta: {
    thunk: true,
  },
})

export const getActiveVotesSuccess = (response, meta) => ({
  type: GET_ACTIVE_VOTES_SUCCESS,
  payload: response,
  meta,
})

export const getActiveVotesFailure = (error, meta) => ({
  type: GET_ACTIVE_VOTES_FAILURE,
  payload: error,
  meta,
})

export const GET_TRENDING_TAGS_REQUEST = 'GET_TRENDING_TAGS_REQUEST'
export const GET_TRENDING_TAGS_SUCCESS = 'GET_TRENDING_TAGS_SUCCESS'
export const GET_TRENDING_TAGS_FAILURE = 'GET_TRENDING_TAGS_FAILURE'

export const getTrendingTagsRequest = () => ({
  type: GET_TRENDING_TAGS_REQUEST,
  meta: {
    thunk: true,
  },
})

export const getTrendingTagsSuccess = (response, meta) => ({
  type: GET_TRENDING_TAGS_SUCCESS,
  payload: response,
  meta,
})

export const getTrendingTagsFailure = (error, meta) => ({
  type: GET_TRENDING_TAGS_FAILURE,
  payload: error,
  meta,
})

// feeds visitation markers, prevent loading when loading previous history
export const SET_HOME_IS_VISITED = 'SET_HOME_IS_VISITED'

export const setHomeIsVisited = (visited = true) => ({
  type: SET_HOME_IS_VISITED,
  payload: visited,
})

export const SET_TRENDING_IS_VISITED = 'SET_TRENDING_IS_VISITED'

export const setTrendingIsVisited = (visited = true) => ({
  type: SET_TRENDING_IS_VISITED,
  payload: visited,
})

export const SET_LATEST_IS_VISITED = 'SET_LATEST_IS_VISITED'

export const setLatestIsVisited = (visited = true) => ({
  type: SET_LATEST_IS_VISITED,
  payload: visited,
})

// clear stores

export const CLEAR_CONTENT = 'CLEAR_CONTENT'

export const clearContent = () => ({
  type: CLEAR_CONTENT,
})

export const CLEAR_HOME_POSTS = 'CLEAR_HOME_POSTS'

export const clearHomePosts = () => ({
  type: CLEAR_HOME_POSTS,
})

export const CLEAR_TRENDING_POSTS = 'CLEAR_TRENDING_POSTS'

export const clearTrendingPosts = () => ({
  type: CLEAR_TRENDING_POSTS,
})

export const CLEAR_LATEST_POSTS = 'CLEAR_LATEST_POSTS'

export const clearLatestPosts = () => ({
  type: CLEAR_LATEST_POSTS,
})

export const CLEAR_REPLIES = 'CLEAR_REPLIES'

export const clearReplies = () => ({
  type: CLEAR_REPLIES,
})

export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE'

export const uploadFileRequest = (file, progress, ipfs) => ({
  type: UPLOAD_FILE_REQUEST,
  payload: { file, progress, ipfs },
  meta: {
    thunk: true,
  },
})

export const uploadFileSuccess = (response, meta) => ({
  type: UPLOAD_FILE_SUCCESS,
  payload: response,
  meta,
})

export const uploadFileError = (error, meta) => ({
  type: UPLOAD_FILE_FAILURE,
  payload: error,
  meta,
})

export const UPLOAD_VIDEO_REQUEST = 'UPLOAD_VIDEO_REQUEST'
export const UPLOAD_VIDEO_SUCCESS = 'UPLOAD_VIDEO_SUCCESS'
export const UPLOAD_VIDEO_FAILURE = 'UPLOAD_VIDEO_FAILURE'

export const uploadVideoRequest = (video, progress) => ({
  type: UPLOAD_VIDEO_REQUEST,
  payload: { video, progress },
  meta: {
    thunk: true,
  },
})

export const uploadVideoSuccess = (response, meta) => ({
  type: UPLOAD_VIDEO_SUCCESS,
  payload: response,
  meta,
})

export const uploadVideoError = (error, meta) => ({
  type: UPLOAD_VIDEO_FAILURE,
  payload: error,
  meta,
})

export const PUBLISH_POST_REQUEST = 'PUBLISH_POST_REQUEST'
export const PUBLISH_POST_SUCCESS = 'PUBLISH_POST_SUCCESS'
export const PUBLISH_POST_FAILURE = 'PUBLISH_POST_FAILURE'

export const publishPostRequest = (body, tags, payout, perm) => ({
  type: PUBLISH_POST_REQUEST,
  payload: { body, tags, payout, perm },
  meta: {
    thunk: true,
  },
})

export const publishPostSuccess = (response, meta) => ({
  type: PUBLISH_POST_SUCCESS,
  payload: response,
  meta,
})

export const publishPostFailure = (error, meta) => ({
  type: PUBLISH_POST_FAILURE,
  payload: error,
  meta,
})

export const PUBLISH_REPLY_REQUEST = 'PUBLISH_REPLY_REQUEST'
export const PUBLISH_REPLY_SUCCESS = 'PUBLISH_REPLY_SUCCESS'
export const PUBLISH_REPLY_FAILURE = 'PUBLISH_REPLY_FAILURE'

export const publishReplyRequest = (parent_author, parent_permlink, body, ref, treeHistory) => ({
  type: PUBLISH_REPLY_REQUEST,
  payload: { parent_author, parent_permlink, body,  ref, treeHistory},
  meta: {
    thunk: true,
  },
})

export const publishReplySuccess = (response, meta) => ({
  type: PUBLISH_REPLY_SUCCESS,
  payload: response,
  meta,
})

export const publishReplyFailure = (error, meta) => ({
  type: PUBLISH_REPLY_FAILURE,
  payload: error,
  meta,
})

export const GET_SEARCH_TAG_REQUEST = 'GET_SEARCH_TAG_REQUEST'
export const GET_SEARCH_TAG_SUCCESS = 'GET_SEARCH_TAG_SUCCESS'
export const GET_SEARCH_TAG_FAILURE = 'GET_SEARCH_TAG_FAILURE'

export const getSearchTagsRequest = (tag) => ({
  type: GET_SEARCH_TAG_REQUEST,
  payload: { tag },
  meta: {
    thunk: true,
  },
})

export const getSearchTagsSuccess = (response, meta) => ({
  type: GET_SEARCH_TAG_SUCCESS,
  payload: response,
  meta,
})

export const getSearchTagFailure = (error, meta) => ({
  type: GET_SEARCH_TAG_FAILURE,
  payload: error,
  meta,
})

export const SET_LAST_SEARCH_TAG = 'SET_LAST_SEARCH_TAG'

export const setLastSearchTag = (response) => ({
  type: SET_LAST_SEARCH_TAG,
  payload: response,
})

export const SET_TAGS_IS_VISITED = 'SET_TAGS_IS_VISITED'

export const setTagsIsVisited = (visited = true) => ({
  type: SET_TAGS_IS_VISITED,
  payload: visited,
})

export const CLEAR_TAGS_POST = 'CLEAR_TAGS_POST'

export const clearTagsPost = () => ({
  type: CLEAR_TAGS_POST,
})

export const CLEAR_LAST_SEARCH_TAG = 'CLEAR_LAST_SEARCH_TAG'

export const clearLastSearchTag = () => ({
  type: CLEAR_LAST_SEARCH_TAG,
})

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST'
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS'
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE'

export const followRequest = (following) => ({
  type: FOLLOW_REQUEST,
  payload: { following },
  meta: {
    thunk: true,
  },
})

export const followSuccess = (response, meta) => ({
  type: FOLLOW_SUCCESS,
  payload: response,
  meta,
})

export const followFailure = (error, meta) => ({
  type: FOLLOW_FAILURE,
  payload: error,
  meta,
})

export const SET_HAS_BEEN_FOLLOWED_RECENTLY = 'SET_HAS_BEEN_FOLLOWED_RECENTLY'

export const setHasBeenFollowedRecently = (following) => ({
  type: SET_HAS_BEEN_FOLLOWED_RECENTLY,
  payload: following,
})

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST'
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS'
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE'

export const unfollowRequest = (following) => ({
  type: UNFOLLOW_REQUEST,
  payload: { following },
  meta: {
    thunk: true,
  },
})

export const unfollowSuccess = (response, meta) => ({
  type: UNFOLLOW_SUCCESS,
  payload: response,
  meta,
})

export const unfollowFailure = (error, meta) => ({
  type: UNFOLLOW_FAILURE,
  payload: error,
  meta,
})

export const SET_HAS_BEEN_UNFOLLOWED_RECENTLY =
  'SET_HAS_BEEN_UNFOLLOWED_RECENTLY'

export const setHasBeenUnfollowedRecently = (following) => ({
  type: SET_HAS_BEEN_UNFOLLOWED_RECENTLY,
  payload: following,
})

export const SET_PAGE_FROM = 'SET_PAGE_FROM'

export const setPageFrom = (from) => ({
  type: SET_PAGE_FROM,
  payload: from,
})

export const SEARCH_REQUEST = 'SEARCH_REQUEST'
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS'
export const SEARCH_FAILURE = 'SEARCH_FAILURE'

export const searchRequest = (query) => ({
  type: SEARCH_REQUEST,
  payload: { query },
  meta: {
    thunk: true,
  },
})

export const searchSuccess = (response, meta) => ({
  type: SEARCH_SUCCESS,
  payload: response,
  meta,
})

export const searchFailure = (error, meta) => ({
  type: SEARCH_FAILURE,
  payload: error,
  meta,
})

export const CLEAR_SEARCH_POSTS = 'CLEAR_SEARCH_POSTS'

export const clearSearchPosts = () => ({
  type: CLEAR_SEARCH_POSTS,
})

export const CLEAR_APPEND_REPLY = 'CLEAR_APPEND_REPLY'

export const clearAppendReply = () => ({
  type: CLEAR_APPEND_REPLY,
})

export const GET_FOLLOW_DETAILS_REQUEST = 'GET_FOLLOW_DETAILS_REQUEST'
export const GET_FOLLOW_DETAILS_SUCCESS = 'GET_FOLLOW_DETAILS_SUCCESS'
export const GET_FOLLOW_DETAILS_FAILURE = 'GET_FOLLOW_DETAILS_FAILURE'

export const getFollowDetailsRequest = (name) => ({
  type: GET_FOLLOW_DETAILS_REQUEST,
  payload: { name },
  meta: {
    thunk: true,
  },
})

export const getFollowDetailsSuccess = (response, meta) => ({
  type: GET_FOLLOW_DETAILS_SUCCESS,
  payload: response,
  meta,
})

export const getFollowDetailsFailure = (error, meta) => ({
  type: GET_FOLLOW_DETAILS_FAILURE,
  payload: error,
  meta,
})

export const GET_LINK_META_REQUEST = 'GET_LINK_META_REQUEST'
export const GET_LINK_META_SUCCESS = 'GET_LINK_META_SUCCESS'
export const GET_LINK_META_FAILURE = 'GET_LINK_META_FAILURE'

export const getLinkMetaRequest = (url) => ({
  type: GET_LINK_META_REQUEST,
  payload: { url },
  meta: {
    thunk: true,
  },
})

export const getLinkMetaSuccess = (response, meta) => ({
  type: GET_LINK_META_SUCCESS,
  payload: response,
  meta,
})

export const getLinkMetaFailure = (error, meta) => ({
  type: GET_LINK_META_FAILURE,
  payload: error,
  meta,
})

export const SET_CONTENT_REDIRECT = 'SET_CONTENT_REDIRECT'
export const UNSET_CONTENT_REDIRECT = 'UNSET_CONTENT_REDIRECT'

export const setContentRedirect = (content) => ({
  type: SET_CONTENT_REDIRECT,
  payload: content,
})

export const unsetContentRedirect = () => ({
  type: UNSET_CONTENT_REDIRECT,
})

export const PUBLISH_UPDATE_REQUEST = 'PUBLISH_UPDATE_REQUEST'
export const PUBLISH_UPDATE_SUCCESS = 'PUBLISH_UPDATE_SUCCESS'
export const PUBLISH_UPDATE_FAILURE = 'PUBLISH_UPDATE_FAILURE'

export const publishUpdateRequest = (permlink, body) => ({
  type: PUBLISH_UPDATE_REQUEST,
  payload: { permlink, body },
  meta: {
    thunk: true,
  },
})

export const publishUpdateSuccess = (response, meta) => ({
  type: PUBLISH_UPDATE_SUCCESS,
  payload: response,
  meta,
})

export const publishUpdateFailure = (error, meta) => ({
  type: PUBLISH_UPDATE_FAILURE,
  payload: error,
  meta,
})

export const REFLECT_UPDATED_MUTE_LIST = 'REFLECT_UPDATED_MUTE_LIST'
export const REFLECT_UPDATED_MUTE_LIST_LATEST =
  'REFLECT_UPDATED_MUTE_LIST_LATEST'
export const REFLECT_UPDATED_MUTE_LIST_TRENDING =
  'RELECT_UPDATED_MUTE_LIST_TRENDING'
export const REFLECT_UPDATED_MUTE_LIST_HOME = 'REFLECT_UPDATED_MUTE_LIST_HOME'

export const reflectUpdateMuteList = () => ({
  type: REFLECT_UPDATED_MUTE_LIST,
})

export const reflectUpdatedMuteListLatest = (response) => ({
  type: REFLECT_UPDATED_MUTE_LIST_LATEST,
  payload: response,
})

export const reflectUpdatedMuteListTrending = (response) => ({
  type: REFLECT_UPDATED_MUTE_LIST_TRENDING,
  payload: response,
})

export const reflectUpdatedMuteListHome = (response) => ({
  type: REFLECT_UPDATED_MUTE_LIST_HOME,
  payload: response,
})

export const SAVE_RECENT_UPVOTES = 'SAVE_RECENT_UPVOTES'

export const saveReceptUpvotes = (response) => ({
  type: SAVE_RECENT_UPVOTES,
  payload: response,
})

// text field to draft
export const SAVE_POST_AS_DRAFT = 'SAVE_POST_AS_DRAFT'

export const savePostAsDraft = (postContent) => ({
  type: SAVE_POST_AS_DRAFT,
  payload: postContent,
})

// buzz threads
export const BUZZ_THREADS = 'BUZZ_THREADS'

export const updateBuzzThreads = (title) => ({
  type: BUZZ_THREADS,
  payload: title,
})

// buzz title
export const BUZZ_TITLE = 'BUZZ_TITLE'

export const updateBuzzTitle = (title) => ({
  type: BUZZ_TITLE,
  payload: title,
})
