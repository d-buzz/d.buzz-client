import React from 'react'
import routes from './routes'
import ScrollMemory from 'react-router-scroll-memory'
import { withRouter } from 'react-router'
import { Init, AuthGuard, ThemeProvider } from 'components'
import { renderRoutes } from 'react-router-config'
import { LastLocationProvider } from 'react-router-last-location'

const App = () => {
  return (
    <React.Fragment>
      <LastLocationProvider>
        <Init>
          <ThemeProvider>
            <ScrollMemory />
            <AuthGuard>
              {renderRoutes(routes)}
            </AuthGuard>
          </ThemeProvider>
        </Init>
      </LastLocationProvider>
    </React.Fragment>
  )
}

export default withRouter(App)
