import {
  AUTHENTICATE_USER_SUCCESS,
  GET_SAVED_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  SUBSCRIBE_SUCCESS,
  SET_FROM_LANDING,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  user: {},
  fromLanding: false,
})

export const auth = (state = defaultState, { type, payload }) => {
  switch (type) {
  case AUTHENTICATE_USER_SUCCESS:
    return state.set('user', payload)
  case GET_SAVED_USER_SUCCESS:
    return state.set('user', payload)
  case SIGNOUT_USER_SUCCESS:
    return state.set('user', payload)
  case SUBSCRIBE_SUCCESS:
    return state.setIn(['user', 'is_subscribe'], payload)
  case SET_FROM_LANDING:
    return state.set('fromLanding', payload)
  default:
    return state
  }
}
