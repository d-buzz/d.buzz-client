import {
  GET_SAVED_THEME_SUCCESS,
  SET_THEME_SUCCESS,
  GENERATE_STYLES,
  SET_RPC_NODE,
  GET_CENSOR_TYPES_SUCCESS,
  SET_DEFAULT_VOTING_WEIGHT_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'
import config from 'config'

const defaultState = fromJS({
  theme: {},
  themeStyles: {},
  rpcNode: config.DEFAULT_RPC_NODE,
  censorTypes: [],
  defaultVoteWeight: 1,
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
  case SET_DEFAULT_VOTING_WEIGHT_SUCCESS:
    return state.set('defaultVoteWeight', payload)
  default:
    return state
  }
}
