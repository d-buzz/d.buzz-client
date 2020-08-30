
import { combineReducers } from 'redux'
import { fork, all } from 'redux-saga/effects'
import { reducer as thunkReducer } from 'redux-saga-thunk'
import { posts } from './posts/reducers'
import { auth } from './auth/reducers'
import { profile } from './profile/reducers'
import { polling } from './polling/reducers'
import { upload } from './upload/reducers'
import * as postSagas from './posts/sagas'
import * as authSagas from './auth/sagas'
import * as profileSagas from './profile/sagas'
import * as pollSagas from './polling/sagas'
import * as uploadSagas from './upload/sagas'

export const rootReducer = combineReducers({
  thunk: thunkReducer,
  posts,
  auth,
  profile,
  polling,
  upload,
})

export function* rootSaga() {
  yield all([
    ...Object.values(postSagas),
    ...Object.values(authSagas),
    ...Object.values(profileSagas),
    ...Object.values(pollSagas),
    ...Object.values(uploadSagas),
  ].map(fork))
}
