import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation, Redirect } from 'react-router-dom'

const AuthGuard = (props) => {
  const { children, user, fromLanding } = props
  const location = useLocation()
  const { pathname } = location
  const { is_authenticated } = user

  const isFreeRoute = ()  => {
    return pathname.match(/^(\/org)/g)
  }

  const isGuardedRoute = () => {
    return  pathname.match(/^(\/trending)/g)
  }

  // LOCAL STORAGE - Front-end only, no backend database

  useEffect(() => {
    const { username } = user

    if(username) {
      // Initialize user settings in localStorage if not present
      const existingData = localStorage.getItem('customUserData')
      if (!existingData) {
        const defaultSettings = {
          username: username,
          settings: {
            theme: 'light',
            videoEmbedsStatus: 'enabled',
            linkPreviewsStatus: 'enabled',
            showImagesStatus: 'enabled',
            showNSFWPosts: 'disabled'
          }
        }
        localStorage.setItem('customUserData', JSON.stringify(defaultSettings))
        console.log('New user settings initialized in localStorage')
      }
    } else {
      // guest
      console.log('%c[CURRENT SESSION]: ', 'color: goldenrod', 'Logged Out')
    }
    // eslint-disable-next-line
  }, [user])

  return (
    <React.Fragment>
      {pathname && (
        <React.Fragment>
          {is_authenticated && !isFreeRoute() && fromLanding && (
            <Redirect to={{ pathname: '/trending' }} />
          )}
          {!is_authenticated && isGuardedRoute() && (
            <Redirect to={{ pathname: '/' }} />
          )}
          {children}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
  fromLanding: state.auth.get('fromLanding'),
})

export default connect(mapStateToProps)(AuthGuard)
