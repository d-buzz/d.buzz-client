import React, { Suspense } from 'react'
import routes from './routes'
import { withRouter } from 'react-router'
import { Init, AuthGuard, ThemeLoader } from 'components'
import { renderRoutes } from 'react-router-config'
import { LastLocationProvider } from 'react-router-last-location'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    overflow: 'hidden !important',
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
      <Suspense fallback={<div>Loading...</div>}>
        <LastLocationProvider>
          <ThemeLoader>
            <Init>
              <AuthGuard>
                <AppWrapper>
                  {renderRoutes(routes)}
                </AppWrapper>
              </AuthGuard>
            </Init>
          </ThemeLoader>
        </LastLocationProvider>
      </Suspense>
    </React.Fragment>
  )
}

export default withRouter(App)
