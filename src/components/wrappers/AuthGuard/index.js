import React from 'react'
import { connect } from 'react-redux'
import { useLocation, Redirect } from 'react-router-dom'

const AuthGuard = (props) => {
  const { children, user } = props
  const location = useLocation()
  const { pathname } = location
  const { is_authenticated } = user

  const isUnguardedRoute = () => {
    return (pathname === '/login' || pathname.includes('/ug'))
  }

  return (
    <React.Fragment>
      {
         isUnguardedRoute() && is_authenticated && (
          <Redirect to={{ pathname: '/', }} />
        )
      }
      {
        !isUnguardedRoute() && !is_authenticated && (
          <Redirect to={{ pathname: '/login', }} />
        )
      }
      { children }
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(AuthGuard)
