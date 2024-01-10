import React, { useEffect } from 'react'
import routes from './routes'
import { withRouter } from 'react-router'
import { Init, AuthGuard, ThemeLoader } from 'components'
import { renderRoutes } from 'react-router-config'
import { LastLocationProvider } from 'react-router-last-location'
import { createUseStyles } from 'react-jss'
import { Helmet } from 'react-helmet'
import { redirectOldLinks } from 'services/helper'
import { useLocation } from 'react-router-dom'
const TwitterEmbedAPI = React.lazy(() => import('components/pages/TwitterEmbedAPI'))

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
  const currentSiteUrl = window.location.protocol + '//' + window.location.host

  useEffect(() => {
    // redirect old links to the new ones
    redirectOldLinks()
  }, [])

  if(window.location.host !== 'd.buzz'){
    const passwordWall = localStorage.getItem('passwordWall')
    if(passwordWall !== "dbuzz"){
      let passwordW = null
      while(passwordW == null || passwordW !== "dbuzz"){
        passwordW = prompt("The password is dbuzz (all lower-case).")
      }
      localStorage.setItem('passwordWall', passwordW)
    }
  }
  
  return (
    <React.Fragment>
      <React.Suspense fallback={<span> </span>}>
        <Helmet>
          <link rel="canonical" href={currentSiteUrl} />
          <meta property="og:title" content="D.Buzz" />
          <meta property="og:description" content="D.Buzz | Micro-blogging for HIVE | Connect with thought leaders and like-minded individuals on d.buzz. Explore trending topics, share your insights, and join the community today." />
          <meta property="og:image" content="https://d.buzz/dbuzz.svg" />
          <meta property="title" content="D.Buzz" />
          <meta property="description" content="D.Buzz | Micro-blogging for HIVE | Connect with thought leaders and like-minded individuals on d.buzz. Explore trending topics, share your insights, and join the community today." />
          <meta property="image" content="https://d.buzz/dbuzz-icon.svg" />
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
      </React.Suspense>
    </React.Fragment>
  )
}

export default withRouter(App)
