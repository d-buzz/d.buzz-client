import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation, Redirect } from 'react-router-dom'
import { getUserCustomData, initilizeUserInDatabase } from 'services/database/api'

const AuthGuard = (props) => {
  const { children, user, fromLanding } = props
  const location = useLocation()
  const { pathname } = location
  const { is_authenticated } = user

  const isFreeRoute = ()  => {
    return pathname.match(/^(\/org)/g)
  }

  const isGuardedRoute = () => {
    return pathname.match(/^(\/latest)/g) || pathname.match(/^(\/trending)/g)
  }

  // DECENTRALIZED DATABASE

  useEffect(() => {
    const { username } = user

    if(username) {
      getUserCustomData(username).then(data => {
        if(data !== 'User not found') {
          localStorage.setItem('customUserData', JSON.stringify(...data))
        } else {
          // initialize datbase here
          initilizeUserInDatabase(username).then(() => {
            console.log('new user initialized')
          })
        }
      })
    } else {
      
      // guest
      console.log('%c[CURRENT SESSION]: ', 'color: goldenrod', 'Logged Out')
    }
    // eslint-disable-next-line
  }, [])

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
