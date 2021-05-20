import {
  GET_WALLET_BALANCE_SUCCESS,
  GET_WALLET_HISTORY_SUCCESS,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  walletBalance : {},
  walletHistory : [],
})

export const wallet = (state = defaultState, { type, payload }) => {
  switch (type) {
  case GET_WALLET_BALANCE_SUCCESS:
    return state.set('walletBalance', payload)
  case GET_WALLET_HISTORY_SUCCESS:
    return state.set('walletHistory', payload)
  default:
    return state
  }
}
