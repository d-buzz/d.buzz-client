import {
  GET_PROFILE_SUCCESS,
  GET_ACCOUNT_POSTS_SUCCESS,
  SET_LAST_ACCOUNT_POSTS,
  SET_PROFILE_IS_VISITED,
  CLEAR_ACCOUNT_POSTS,
  GET_ACCOUNT_REPLIES_SUCCESS,
  CLEAR_ACCOUNT_REPLIES,
  SET_LAST_ACCOUNT_REPLY,
  GET_FOLLOWERS_SUCCESS,
  CLEAR_PROFILE,
  SET_LAST_FOLLOWER,
  CLEAR_ACCOUNT_FOLLOWERS,
  GET_FOLLOWING_SUCCESS,
  SET_LAST_FOLLOWING,
  CLEAR_ACCOUNT_FOLLOWING,
  GET_ACCOUNT_COMMENTS_SUCCESS,
  SET_LAST_ACCOUNT_COMMENT,
  CLEAR_ACCOUNT_COMMENTS,
  GET_ACCOUNT_LIST_SUCCESS,
  SET_ACCOUNT_BLACKLIST,
  SET_ACCOUNT_FOLLOWED_BLACKLIST,
  SET_ACCOUNT_MUTED_LIST,
  SET_ACCOUNT_FOLLOWED_MUTED_LIST,
  CLEAR_ACCOUNT_MUTED_LIST,
  CLEAR_ACCOUNT_FOLLOWED_MUTED_LIST,
  SET_ACCOUNT_LIST_SEARCHKEY,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  profile: {},
  posts: [],
  last: [],
  isProfileVisited: false,
  replies: [],
  lastReply: [],
  followers: [],
  lastFollower: [],
  following: [],
  lastFollowing: [],
  comments: [],
  lastComment: [],
  mutedList: [],
  blacklistedList: [],
  followedMuted : [],
  followedBlacklist : [],
  accountLists : {},
  listSearchkey : { list_type: null, keyword: null },
})

export const profile = (state = defaultState, { type, payload }) => {
  switch (type) {
  case GET_PROFILE_SUCCESS:
    return state.set('profile', payload)
  case GET_ACCOUNT_POSTS_SUCCESS:
    return state.set('posts', payload)
  case SET_LAST_ACCOUNT_POSTS:
    return state.set('last', payload)
  case SET_PROFILE_IS_VISITED:
    return state.set('isProfileVisited', payload)
  case CLEAR_ACCOUNT_POSTS:
    return state.set('posts', [])
  case GET_ACCOUNT_REPLIES_SUCCESS:
    return state.set('replies', payload)
  case CLEAR_ACCOUNT_REPLIES:
    return state.set('replies', [])
  case SET_LAST_ACCOUNT_REPLY:
    return state.set('lastReply', payload)
  case GET_FOLLOWERS_SUCCESS:
    return state.set('followers', payload)
  case CLEAR_PROFILE:
    return state.set('profile', {})
  case SET_LAST_FOLLOWER:
    return state.set('lastFollower', payload)
  case CLEAR_ACCOUNT_FOLLOWERS:
    return state.set('followers', [])
  case GET_FOLLOWING_SUCCESS:
    return state.set('following', payload)
  case SET_LAST_FOLLOWING:
    return state.set('lastFollowing', payload)
  case CLEAR_ACCOUNT_FOLLOWING:
    return state.set('following', [])
  case GET_ACCOUNT_COMMENTS_SUCCESS:
    return state.set('comments', payload)
  case SET_LAST_ACCOUNT_COMMENT:
    return state.set('lastComment', payload)
  case CLEAR_ACCOUNT_COMMENTS:
    return state.set('comments', [])
  case GET_ACCOUNT_LIST_SUCCESS:
    return state.set('accountLists', payload)
  case SET_ACCOUNT_BLACKLIST:
    return state.set('blacklistedList', payload)
  case SET_ACCOUNT_FOLLOWED_BLACKLIST:
    return state.set('followedBlacklist', payload)
  case SET_ACCOUNT_MUTED_LIST:
    return state.set('mutedList', payload)
  case SET_ACCOUNT_FOLLOWED_MUTED_LIST:
    return state.set('followedMuted', payload)
  case CLEAR_ACCOUNT_MUTED_LIST:
    return state.set('mutedList', [])
  case CLEAR_ACCOUNT_FOLLOWED_MUTED_LIST:
    return state.set('followedMuted', [])
  case SET_ACCOUNT_LIST_SEARCHKEY:
    return state.set('listSearchkey', payload)
  default:
    return state
  }
}
