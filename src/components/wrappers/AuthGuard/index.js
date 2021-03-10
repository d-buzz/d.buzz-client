import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation, Redirect } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

const AuthGuard = (props) => {
  const { children, user, fromLanding } = props
  const location = useLocation()
  const { pathname } = location
  const { is_authenticated } = user
  const history = useHistory()

  const isFreeRoute = ()  => {
    return pathname.match(/^(\/org)/g)
  }

  const isGuardedRoute = () => {
    return pathname.match(/^(\/latest)/g) || pathname.match(/^(\/trending)/g)
  }

  useEffect(() => {
    if(!is_authenticated){
      history.push("/")
    }
  // eslint-disable-next-line
  }, [is_authenticated])

  return (
    <React.Fragment>
      {pathname && (
        <React.Fragment>
          {is_authenticated && !isFreeRoute() && fromLanding && (
            <Redirect to={{ pathname: '/latest' }} />
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
