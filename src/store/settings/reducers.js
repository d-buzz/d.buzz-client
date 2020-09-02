import {
  GET_SAVED_THEME_SUCCESS,
  SET_THEME_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  theme: {},
})

export const settings = (state = defaultState, { type, payload }) => {
  switch (type) {
  case GET_SAVED_THEME_SUCCESS:
    return state.set('theme', payload)
  case SET_THEME_SUCCESS:
    return state.set('theme', payload)
  default:
    return state
  }
}
