import React from 'react'
import routes from './routes'
import ScrollMemory from 'react-router-scroll-memory'
import { withRouter } from 'react-router'
import { Init, AuthGuard, ThemeLoader } from 'components'
import { renderRoutes } from 'react-router-config'
import { LastLocationProvider } from 'react-router-last-location'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    backgroundColor: theme.background.primary,
  },
}))

const AppWrapper = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      {children}
    </div>
  )
}

const App = () => {
  return (
    <React.Fragment>
      <LastLocationProvider>
        <ThemeLoader>
          <Init>
            <ScrollMemory />
            <AuthGuard>
              <AppWrapper>
                {renderRoutes(routes)}
              </AppWrapper>
            </AuthGuard>
          </Init>
        </ThemeLoader>
      </LastLocationProvider>
    </React.Fragment>
  )
}

export default withRouter(App)
