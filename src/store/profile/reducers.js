import {
  GET_PROFILE_SUCCESS,
  GET_ACCOUNT_POSTS_SUCCESS,
  SET_LAST_ACCOUNT_POSTS,
  SET_PROFILE_IS_VISITED,
  CLEAR_ACCOUNT_POSTS
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  profile: {},
  posts: [],
  last: [],
  isProfileVisited: false,
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
    default:
      return state
  }
}

