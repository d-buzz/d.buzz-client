import {
  GET_SAVED_THEME_SUCCESS,
  SET_THEME_SUCCESS,
  GENERATE_STYLES,
  SET_RPC_NODE,
  GET_CENSOR_TYPES_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  theme: {},
  themeStyles: {},
  rpcNode: 'https://api.hive.blog',
  censorTypes: [],
})

export const settings = (state = defaultState, { type, payload }) => {
  switch (type) {
  case GET_SAVED_THEME_SUCCESS:
    return state.set('theme', payload)
  case SET_THEME_SUCCESS:
    return state.set('theme', payload)
  case GENERATE_STYLES:
    return state.set('themeStyles', payload)
  case SET_RPC_NODE:
    return state.set('rpcNode', payload)
  case GET_CENSOR_TYPES_SUCCESS:
    return state.set('censorTypes', payload)
  default:
    return state
  }
}
