import React from 'react'
import routes from './routes'
import { withRouter } from 'react-router'
import { Init, AuthGuard, ThemeLoader } from 'components'
import { renderRoutes } from 'react-router-config'
import { LastLocationProvider } from 'react-router-last-location'
import { createUseStyles } from 'react-jss'
import { Helmet } from 'react-helmet'

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
      <Helmet>
        <meta charSet="utf-8" />
        <meta property="og:title" content="D.Buzz" />
        <meta property="og:description" content="D.Buzz | Micro-blogging for HIVE" />
        <meta property="og:og:image" content="https://d.buzzdbuzz.svg" />
      </Helmet>
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
    </React.Fragment>
  )
}

export default withRouter(App)
