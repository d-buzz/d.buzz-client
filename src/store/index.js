
import { combineReducers } from 'redux'
import { fork, all } from 'redux-saga/effects'

import { posts } from './posts/reducers'
import { reducer as thunkReducer } from 'redux-saga-thunk'
import * as postSagas from './posts/sagas'

export const rootReducer = combineReducers({
  thunk: thunkReducer,
  posts,
})
  
export function* rootSaga() {
  yield all([
    ...Object.values(postSagas),
  ].map(fork))
}