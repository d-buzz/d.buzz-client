import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootReducer, rootSaga } from './index'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'
import config from 'config'

const sagaMiddleWare = createSagaMiddleware()
const middleWare = applyMiddleware(thunkMiddleware, sagaMiddleWare)
let composeEnhancers = compose

if(config.BRANCH === 'dev') {
  composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
}

export default createStore(
  rootReducer,
  {},
  composeEnhancers(middleWare),
)

sagaMiddleWare.run(rootSaga)
