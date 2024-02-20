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
// src/sentry.js
import * as Sentry from '@sentry/react'
import {Profiler} from "@sentry/react"


Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  enabled: process.env.REACT_APP_SENTRY_DSN !== undefined,
  tracesSampleRate:  1.0,
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})
initReactFastclick()

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <HttpsRedirect>
        <Profiler id="App" tracesSampleRate={1.0}>
          <App />
        </Profiler>
      </HttpsRedirect>
    </Router>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
