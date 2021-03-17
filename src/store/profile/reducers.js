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
  CLEAR_ACCOUNT_BLACKLIST,
  CLEAR_ACCOUNT_FOLLOWED_BLACKLIST,
  SET_ACCOUNT_LIST_SEARCHKEY,
  CHECK_ACCOUNT_EXIST_SUCCESS,
  SET_MUTE_LIST_LAST_INDEX,
  SET_MUTE_LIST_UNFILTERED,
  SET_BLACKLIST_LAST_INDEX,
  SET_BLACKLIST_UNFILTERED,
  SET_FOLLOW_BLACKLIST_LAST_INDEX,
  SET_FOLLOW_BLACKLIST_UNFILTERED,
  SET_FOLLOW_MUTED_LAST_INDEX,
  SET_FOLLOW_MUTED_UNFILTERED,
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
  mutedListAll : [],
  blacklistedList: [],
  blacklistedListAll: [],
  followedMuted : [],
  followedMutedAll : [],
  followedBlacklist : [],
  followedBlacklistAll : [],
  accountLists : null,
  listSearchkey : { list_type: null, keyword: null },
  accountExist : {},
  muteListLastIndex : 0,
  blacklistLastIndex : 0,
  followBlacklistLastIndex : 0,
  followMutedLastIndex : 0,
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
  case CLEAR_ACCOUNT_BLACKLIST:
    return state.set('blacklistedList', [])
  case CLEAR_ACCOUNT_FOLLOWED_BLACKLIST:
    return state.set('followedBlacklist', [])
  case SET_ACCOUNT_LIST_SEARCHKEY:
    return state.set('listSearchkey', payload)
  case CHECK_ACCOUNT_EXIST_SUCCESS:
    return state.set('accountExist', payload)
  case SET_MUTE_LIST_LAST_INDEX:
    return state.set('muteListLastIndex', payload)
  case SET_MUTE_LIST_UNFILTERED:
    return state.set('mutedListAll', payload)
  case SET_BLACKLIST_LAST_INDEX:
    return state.set('blacklistLastIndex', payload)
  case SET_BLACKLIST_UNFILTERED:
    return state.set('blacklistedListAll', payload)
  case SET_FOLLOW_BLACKLIST_LAST_INDEX:
    return state.set('followBlacklistLastIndex', payload)
  case SET_FOLLOW_BLACKLIST_UNFILTERED:
    return state.set('followedBlacklistAll', payload)
  case SET_FOLLOW_MUTED_LAST_INDEX:
    return state.set('followMutedLastIndex', payload)
  case SET_FOLLOW_MUTED_UNFILTERED:
    return state.set('followedMutedAll', payload)
  default:
    return state
  }
}
