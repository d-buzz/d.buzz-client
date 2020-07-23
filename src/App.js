import React from 'react'
import routes from './routes'
import { withRouter } from 'react-router'
import { Init } from 'components'
import { renderRoutes } from "react-router-config"

const App = () => {
  return (
    <React.Fragment>
      <Init>
        { renderRoutes(routes) }
      </Init>
    </React.Fragment>
  )
}

export default withRouter(App)
