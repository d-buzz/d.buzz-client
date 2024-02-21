import React from 'react'
import ReactDOM from 'react-dom/'
import App from './App'
import store from 'store/store'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import initReactFastclick from 'react-fastclick'
import 'bootstrap/dist/css/bootstrap.min.css'
import './override.css'
import HttpsRedirect from 'react-https-redirect'

initReactFastclick()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <HttpsRedirect>
        <App />
      </HttpsRedirect>
    </Router>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        if (event.target.state === "activated") {
          window.location.reload()
        }
      })
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" })
    }
  },
})
