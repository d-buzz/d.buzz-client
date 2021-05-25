import {
  GET_WALLET_BALANCE_SUCCESS,
  GET_WALLET_HISTORY_SUCCESS,
  SET_WALLET_HISTORY_START,
} from './actions'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  walletBalance : {},
  walletHistory : [],
  walletHistoryStart: -1,
})

export const wallet = (state = defaultState, { type, payload }) => {
  switch (type) {
  case GET_WALLET_BALANCE_SUCCESS:
    return state.set('walletBalance', payload)
  case GET_WALLET_HISTORY_SUCCESS:
    return state.set('walletHistory', payload)
  case SET_WALLET_HISTORY_START:
    return state.set('walletHistoryStart', payload)
  default:
    return state
  }
}
