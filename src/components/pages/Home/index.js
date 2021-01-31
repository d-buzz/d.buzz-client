import React  from 'react'
import { connect } from 'react-redux'
import { Feeds, Landing } from 'components'

const Home = (props) => {
  const { user } = props
  const { is_authenticated } = user

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
