import {
  GET_PROFILE_SUCCESS,
  GET_ACCOUNT_POSTS_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  profile: {},
  profilePosts: {}
})

export const profile = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_PROFILE_SUCCESS:
      return state.set('profile', payload)
    case GET_ACCOUNT_POSTS_SUCCESS:
      return state.set('profilePosts', payload)
    default:
      return state
  }
}

