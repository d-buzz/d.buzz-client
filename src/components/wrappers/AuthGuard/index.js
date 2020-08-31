import React from 'react'
import { connect } from 'react-redux'
import { useLocation, Redirect } from 'react-router-dom'

const AuthGuard = (props) => {
  const { children, user } = props
  const location = useLocation()
  const { pathname } = location
  const { is_authenticated } = user

  const isFreeRoute = ()  => {
    return pathname.match(/^(\/org)/g)
  }

  const isUnguardedRoute = () => {
    return pathname.match(/^(\/ug)/g)
  }

  return (
    <React.Fragment>
      {isUnguardedRoute() && is_authenticated && !isFreeRoute() && (
        <Redirect to={{ pathname: '/' }} />
      )}
      {!isUnguardedRoute() && !is_authenticated && !isFreeRoute() && (
        <Redirect to={{ pathname: '/ug' }} />
      )}
      {children}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(AuthGuard)
