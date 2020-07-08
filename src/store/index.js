
import { combineReducers } from 'redux'
import { fork, all } from 'redux-saga/effects'

import { tests } from './tests/reducers'
import { reducer as thunkReducer } from 'redux-saga-thunk'
import * as testSagas from './tests/sagas'

export const rootReducer = combineReducers({
  thunk: thunkReducer,
  tests,
})
  
export function* rootSaga() {
  yield all([
    ...Object.values(testSagas),
  ].map(fork))
}