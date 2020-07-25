
import { combineReducers } from 'redux'
import { fork, all } from 'redux-saga/effects'
import { reducer as thunkReducer } from 'redux-saga-thunk'
import { posts } from './posts/reducers'
import { auth } from './auth/reducers'
import * as postSagas from './posts/sagas'
import * as authSagas from './auth/sagas'

export const rootReducer = combineReducers({
  thunk: thunkReducer,
  posts,
  auth,
})

export function* rootSaga() {
  yield all([
    ...Object.values(postSagas),
    ...Object.values(authSagas),
  ].map(fork))
}
