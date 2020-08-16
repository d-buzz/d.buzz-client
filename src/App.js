import React from 'react'
import routes from './routes'
import ScrollMemory from 'react-router-scroll-memory'
import { withRouter } from 'react-router'
import { Init, AuthGuard } from 'components'
import { renderRoutes } from "react-router-config"

const App = () => {
  return (
    <React.Fragment>
      <Init>
        <ScrollMemory />
        <AuthGuard>
          {renderRoutes(routes)}
        </AuthGuard>
      </Init>
    </React.Fragment>
  )
}

export default withRouter(App)
