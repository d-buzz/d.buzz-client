import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootReducer, rootSaga } from './index'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'

const sagaMiddleWare = createSagaMiddleware()
const middleWare = applyMiddleware(thunkMiddleware, sagaMiddleWare)
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export default createStore( 
  rootReducer, 
  {}, 
  composeEnhancers(middleWare)
)

sagaMiddleWare.run(rootSaga)