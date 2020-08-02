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
    default:
      return state
  }
}

