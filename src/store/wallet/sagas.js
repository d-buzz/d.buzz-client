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
  generateClaimRewardOperation,
  broadcastOperation,
  broadcastKeychainOperation,
  extractLoginData,
  getHivePrice,
  getHivePower,
  getHbdPrice,
} from 'services/api'

import { errorMessageComposer } from "services/helper"

function* getWalletBalanceRequest(payload, meta) {
  try {
    const { username } = payload

    const account = yield call(fetchAccounts, username)

    const hivePriceUSD = yield call(getHivePrice)
    const hbdPriceUSD = yield call(getHbdPrice)

    const hiveBalance = parseFloat(account[0].balance.split(" ")[0])
    const hbdBalance = parseFloat(account[0].hbd_balance)

    const hivePower = parseFloat((yield call(getHivePower, username)).toFixed(3))
    const estimatedAccountValue = ((hiveBalance + hivePower) * hivePriceUSD + hbdBalance * hbdPriceUSD).toFixed(2)

    const hiveTokens = `${parseFloat(account[0].balance) === 0 ? `0` : parseFloat(account[0].balance).toFixed(2)} HIVE`
    const hiveSavings = `${parseFloat(account[0].savings_balance) === 0 ? `0` : parseFloat(account[0].savings_balance).toFixed(2)} HIVE`
    const hbdSavings = `${parseFloat(account[0].savings_hbd_balance) === 0 ? `0` : parseFloat(account[0].savings_hbd_balance).toFixed(2)} HBD`

    const walletInfo = {
      pending_rewards: account[0].reward_hbd_balance,
      hive_tokens: hiveTokens,
      hive_power : hivePower,
      hbd : account[0].hbd_balance,
      savings: hiveSavings,
      savings_hbd : hbdSavings,
      estimate_account_value: estimatedAccountValue,
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
          import('@hiveio/hive-js').then((hive) => {
            amount = `${parseFloat(hive.formatter.vestToHive(trx[1].op.reward_vests, total_vesting_shares, total_vesting_fund_hive)).toFixed(3)} HIVE`
          })
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
