import {
  GET_PROFILE_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  profile: {},
})

export const profile = (state = defaultState, { type, payload }) => {
  switch (type) {
    case GET_PROFILE_SUCCESS:
      return state.set('profile', payload)
    default:
      return state
  }
}

