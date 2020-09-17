import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from 'store/store'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import IpfsRouter from 'ipfs-react-router'
// import { createBrowserHistory } from 'history'
// import { wrapHistory } from 'oaf-react-router'
import ScrollMemory from 'react-router-scroll-memory'
import 'bootstrap/dist/css/bootstrap.min.css'
import './override.css'

// const history = createBrowserHistory()

// const settings = {
//   disableAutoScrollRestoration: true,
//   restorePageStateOnPop: true,
//   smoothScroll: true,
// }

// wrapHistory(history, settings)

ReactDOM.render(
  <Provider store={store}>
    <IpfsRouter>
      <ScrollMemory />
      <App />
    </IpfsRouter>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
