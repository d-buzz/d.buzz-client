import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Feeds, Landing } from 'components'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'

const Home = (props) => {
  const { user } = props
  const { is_authenticated } = user
  const { search } = useLocation()
  const params = queryString.parse(search)

  useEffect(() => {
    if(typeof params === 'object' && typeof params.ref !== 'undefined') {
      window.location.replace(`https://hiveonboard.com/create-account?ref=${params.ref}`)
    }
  }, [params])

  return (
    <div>
      {is_authenticated && <Feeds />}
      {!is_authenticated && <Landing />}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(Home)
