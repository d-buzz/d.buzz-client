import { call, put, takeEvery, select } from "redux-saga/effects"

import {
  GET_WALLET_BALANCE_REQUEST,
  getWalletBalanceSuccess,
  getWalletBalanceFailure,

  CLAIM_REWARD_REQUEST,
  claimRewardSuccess,
  claimRewardFailure,

  GET_WALLET_HISTORY_REQUEST,
  getWalletHistorySuccess,
  getWalletHistoryFailure,
  setWalletHistoryStart,
} from "./actions"

import {
  fetchGlobalProperties,
  fetchAccounts,
  fetchAccountTransferHistory,
  getEstimateAccountValue,
  generateClaimRewardOperation,
  broadcastOperation,
  broadcastKeychainOperation,
  extractLoginData,
} from 'services/api'

import { errorMessageComposer } from "services/helper"
import hive from '@hiveio/hive-js'

function* getWalletBalanceRequest(payload, meta) {
  try {
    const { username } = payload

    const props = yield call(fetchGlobalProperties)
    const account = yield call(fetchAccounts, username)
    const estAV = yield call(getEstimateAccountValue, account[0])

    const { vesting_shares, to_withdraw, withdrawn, delegated_vesting_shares, received_vesting_shares } = account[0]
    const { total_vesting_fund_hive, total_vesting_shares } = props

    const receiveVesting = parseFloat(parseFloat(total_vesting_fund_hive) * (parseFloat(received_vesting_shares) / parseFloat(total_vesting_shares)),6)
    const avail = parseFloat(vesting_shares) - (parseFloat(to_withdraw) - parseFloat(withdrawn)) / 1e6 - parseFloat(delegated_vesting_shares)
    const vestHive = parseFloat(parseFloat(total_vesting_fund_hive) * (parseFloat(avail) / parseFloat(total_vesting_shares)),6)

    const walletInfo = {
      pending_rewards: account[0].reward_hbd_balance,
      hive_tokens: account[0].balance,
      hive_power : parseFloat(parseFloat(vestHive) + parseFloat(receiveVesting)).toFixed(3),
      hbd : account[0].hbd_balance,
      savings: account[0].savings_balance,
      savings_hbd : account[0].savings_hbd_balance,
      estimate_account_value: estAV,
    }
    yield put(getWalletBalanceSuccess(walletInfo, meta))
  } catch (error) {
    yield put(getWalletBalanceFailure(error, meta))
  }

}

function* claimRewardRequest(meta) {
  try {
    const user = yield select(state => state.auth.get('user'))
    const { username, useKeychain } = user
    const account = yield call(fetchAccounts, username)

    const operation = yield call(generateClaimRewardOperation, username, 
      account[0].reward_hive_balance, account[0].reward_hbd_balance, account[0].reward_vesting_balance)

    let success = false
    if(useKeychain) {
      const result = yield call(broadcastKeychainOperation, username, operation)
      success = result.success
    } else {
      let { login_data } = user
      login_data = extractLoginData(login_data)

      const wif = login_data[1]
      const result = yield call(broadcastOperation, operation, [wif])
      success = result.success
    }

    if(success){
      yield put(claimRewardSuccess({ success: true }, meta))
    }else{
      yield put(claimRewardFailure({ success: false, errorMessage: "Failed to claim rewards" }, meta))
    }
    
  } catch (error) {
    const errorMessage = errorMessageComposer('claim_reward', error)
    yield put(claimRewardFailure({ success: false, errorMessage }, meta))
  }
}

function* getWalletHistoryRequest(payload, meta) {
  try {
    const { username } = payload
    
    const user = yield select(state => state.auth.get('user'))
    const history = yield select(state => state.wallet.get('walletHistory'))
    const historyStart = yield select(state => state.wallet.get('walletHistoryStart'))
    const props = yield call(fetchGlobalProperties)

    const { username : loginUser } = user
    const result = yield call(fetchAccountTransferHistory, username, historyStart, 1000)
  
    yield put(setWalletHistoryStart(result[0][0]))
    const { total_vesting_fund_hive, total_vesting_shares } = props

    let transfers = []
    if(result.length > 0) { 
      result.forEach((trx) => {
        trx[1].number = trx[0]
        trx[1].operation = trx[1].op[0]
        trx[1].op = trx[1].op[1]

        let main_user = ''
        let amount = ''
        let description = ''
        if(trx[1].operation === 'transfer'){
          main_user = trx[1].op.from === loginUser ? trx[1].op.to : trx[1].op.from
          amount = trx[1].op.amount
          description = trx[1].op.from === loginUser ? 'Transferred to ' : 'Received from '
        }else if(trx[1].operation === 'claim_reward_balance') {
          main_user = trx[1].op.account
          amount = `${parseFloat(hive.formatter.vestToHive(trx[1].op.reward_vests, total_vesting_shares, total_vesting_fund_hive)).toFixed(3)} HIVE`
          description = 'Claimed rewards'
        }else if(trx[1].operation === 'interest') {
          main_user = trx[1].op.owner
          amount = trx[1].op.interest
          description = 'Received interest'
        }else if(trx[1].operation === 'transfer_from_savings'){
          main_user = trx[1].op.from
          amount = trx[1].op.amount
          description = 'Transferred from savings'
        }else if(trx[1].operation === 'transfer_to_savings'){
          main_user = trx[1].op.from
          amount = trx[1].op.amount
          description = 'Transferred to savings'
        }else if(trx[1].operation === 'withdraw_vesting'){
          main_user = trx[1].op.account
          amount = trx[1].op.vesting_shares
          description = 'Withdraw from vesting'
        }else if(trx[1].operation === 'transfer_to_vesting'){
          main_user = trx[1].op.from
          amount = trx[1].op.amount
          description = 'Powered up'
        }
        trx[1].main_user = main_user
        trx[1].amount = amount
        trx[1].description = description
        transfers.push(trx[1])
      })
    }
    transfers = transfers.reverse()
    if(history) {
      transfers = [...history, ...transfers]
    }

    transfers = transfers.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['trx_id']).indexOf(obj['trx_id']) === pos
    })

   
    yield put(getWalletHistorySuccess(transfers, meta))
  } catch (error) {
    yield put(getWalletHistoryFailure(error, meta))
  }
}

function* watchGetWalletBalanceRequest({payload, meta}) {
  yield call(getWalletBalanceRequest, payload, meta)
}

function* watchClaimRewardRequest({meta}) {
  yield call(claimRewardRequest,  meta)
}

function* watchGetWalletHistoryRequest({payload, meta}) {
  yield call(getWalletHistoryRequest, payload, meta)
}

export default function* sagas() {
  yield takeEvery(GET_WALLET_BALANCE_REQUEST, watchGetWalletBalanceRequest)
  yield takeEvery(CLAIM_REWARD_REQUEST, watchClaimRewardRequest)
  yield takeEvery(GET_WALLET_HISTORY_REQUEST, watchGetWalletHistoryRequest)
}
