import {
  GET_SAVED_THEME_SUCCESS,
  SET_THEME_SUCCESS,
  GENERATE_STYLES,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  theme: {},
  themeStyles: {},
})

export const settings = (state = defaultState, { type, payload }) => {
  switch (type) {
  case GET_SAVED_THEME_SUCCESS:
    return state.set('theme', payload)
  case SET_THEME_SUCCESS:
    return state.set('theme', payload)
  case GENERATE_STYLES:
    return state.set('themeStyles', payload)
  default:
    return state
  }
}
