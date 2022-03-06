import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createEpicMiddleware } from 'redux-observable'
import { rootReducer, rootSaga } from './index'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'
import config from 'config'

const sagaMiddleWare = createSagaMiddleware()
const epicMiddleWare = createEpicMiddleware()
const middleWare = applyMiddleware(thunkMiddleware, sagaMiddleWare)
const composeEnhancers = (typeof window !== 'undefined' && config.BRANCH === 'dev' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export default createStore(
  rootReducer,
  {},
  composeEnhancers(middleWare),
)

sagaMiddleWare.run(rootSaga)
epicMiddleWare.run(rootSaga)