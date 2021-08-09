import React, { useEffect } from 'react'
import routes from './routes'
import { withRouter } from 'react-router'
import { Init, AuthGuard, ThemeLoader } from 'components'
import { renderRoutes } from 'react-router-config'
import { LastLocationProvider } from 'react-router-last-location'
import { createUseStyles } from 'react-jss'
import { Helmet } from 'react-helmet'
import { redirectToUserProfile } from 'services/helper'
import { useLocation } from 'react-router-dom'
import TwitterEmbedAPI from 'components/pages/TwitterEmbedAPI'

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
  const { pathname } = useLocation()
  const twitterEmbedRoutes = pathname.match(/^\/twitterEmbed/)

  useEffect(() => {
    // redirect to user profile if link only contains @username
    redirectToUserProfile()
  }, [])

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:title" content="D.Buzz" />
        <meta property="og:description" content="D.Buzz | Micro-blogging for HIVE" />
        <meta property="og:image" content="https://d.buzz/dbuzz.png" />
        <meta property="title" content="D.Buzz" />
        <meta property="description" content="D.Buzz | Micro-blogging for HIVE" />
        <meta property="image" content="https://d.buzz/dbuzz.png" />
      </Helmet>
      <LastLocationProvider>
        <ThemeLoader>
          {!twitterEmbedRoutes ?
            <Init>
              <AuthGuard>
                <AppWrapper>
                  {renderRoutes(routes)}
                </AppWrapper>
              </AuthGuard>
            </Init> :
            <TwitterEmbedAPI />}
        </ThemeLoader>
      </LastLocationProvider>
    </React.Fragment>
  )
}

export default withRouter(App)
