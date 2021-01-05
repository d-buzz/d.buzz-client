import {
  AUTHENTICATE_USER_SUCCESS,
  GET_SAVED_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  SUBSCRIBE_SUCCESS,
  SET_FROM_LANDING,
  SET_MUTE_LIST,
  SET_HAS_PAYOUT_AGREED,
  SET_INTENT_BUZZ,
  CLEAR_INTENT_BUZZ,
  SET_OPACITY_USERS,
  SET_FROM_INTENT_BUZZ,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  user: {},
  fromLanding: false,
  mutelist: [],
  payoutAgreed: false,
  opacityUsers: [],
  intentBuzz: {},
  fromIntentBuzz: false,
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
  case SET_MUTE_LIST:
    return state.set('mutelist', payload)
  case SET_HAS_PAYOUT_AGREED:
    return state.set('payoutAgreed', payload)
  case SET_INTENT_BUZZ:
    return state.set("intentBuzz", payload)
  case CLEAR_INTENT_BUZZ:
    return state.set("intentBuzz", {})
  case SET_OPACITY_USERS:
    return state.set('opacityUsers', payload)
  case SET_FROM_INTENT_BUZZ:
    return state.set('fromIntentBuzz', payload)
  default:
    return state
  }
}
