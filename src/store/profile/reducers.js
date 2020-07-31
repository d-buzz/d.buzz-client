import {
  GET_PROFILE_SUCCESS,
  GET_ACCOUNT_POSTS_SUCCESS,
  SET_OLD_ACCOUNT_POSTS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  profile: {},
  posts: [],
  old: [],
})

export const profile = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_PROFILE_SUCCESS:
      return state.set('profile', payload)
    case GET_ACCOUNT_POSTS_SUCCESS:
      return state.set('posts', payload)
    case SET_OLD_ACCOUNT_POSTS:
      return state.set('old', payload)
    default:
      return state
  }
}

