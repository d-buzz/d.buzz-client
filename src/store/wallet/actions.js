export const GET_WALLET_BALANCE_REQUEST = 'GET_WALLET_BALANCE_REQUEST'
export const GET_WALLET_BALANCE_SUCCESS = 'GET_WALLET_BALANCE_SUCCESS'
export const GET_WALLET_BALANCE_FAILURE = 'GET_WALLET_BALANCE_FAILURE'

export const getWalletBalanceRequest = (username) => ({
  type: GET_WALLET_BALANCE_REQUEST,
  payload: { username },
  meta: {
    thunk: true,
  },
})

export const getWalletBalanceSuccess = (response, meta) => ({
  type: GET_WALLET_BALANCE_SUCCESS,
  payload: response,
  meta,
})

export const getWalletBalanceFailure = (error, meta) => ({
  type: GET_WALLET_BALANCE_FAILURE,
  payload: error,
  meta,
})

export const CLAIM_REWARD_REQUEST = 'CLAIM_REWARD_REQUEST'
export const CLAIM_REWARD_SUCCESS = 'CLAIM_REWARD_SUCCESS'
export const CLAIM_REWARD_FAILURE = 'CLAIM_REWARD_FAILURE'

export const claimRewardRequest = () => ({
  type: CLAIM_REWARD_REQUEST,
  meta: {
    thunk: true,
  },
})

export const claimRewardSuccess = (response, meta) => ({
  type: CLAIM_REWARD_SUCCESS,
  payload: response,
  meta,
})

export const claimRewardFailure = (error, meta) => ({
  type: CLAIM_REWARD_FAILURE,
  payload: error,
  meta,
})

export const GET_WALLET_HISTORY_REQUEST = 'GET_WALLET_HISTORY_REQUEST'
export const GET_WALLET_HISTORY_SUCCESS = 'GET_WALLET_HISTORY_SUCCESS'
export const GET_WALLET_HISTORY_FAILURE = 'GET_WALLET_HISTORY_FAILURE'

export const getWalletHistoryRequest = (username) => ({
  type: GET_WALLET_HISTORY_REQUEST,
  payload: { username },
  meta: {
    thunk: true,
  },
})

export const getWalletHistorySuccess = (response, meta) => ({
  type: GET_WALLET_HISTORY_SUCCESS,
  payload: response,
  meta,
})

export const getWalletHistoryFailure = (error, meta) => ({
  type: GET_WALLET_HISTORY_FAILURE,
  payload: error,
  meta,
})