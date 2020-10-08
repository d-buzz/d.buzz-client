import React from 'react'
// import ReactDOM from 'react-dom'
import { hydrate, render } from "react-dom"
import App from './App'
import store from 'store/store'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import {
  HashRouter as Router,
} from 'react-router-dom'
import initReactFastclick from 'react-fastclick'
import 'bootstrap/dist/css/bootstrap.min.css'
import './override.css'

initReactFastclick()

const AppBody = () => {
  return (
    <Provider store={store}>
      <Router>
        {/* <ScrollMemory /> */}
        <App />
      </Router>
    </Provider>
  )
}

const rootElement = document.getElementById("root")

if (rootElement.hasChildNodes()) {
  hydrate(<AppBody />, rootElement)
} else {
  render(<AppBody />, rootElement)
}

// ReactDOM.render(
//   <App />,
//   document.getElementById('root'),
// )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
