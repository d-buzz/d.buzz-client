import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { Feeds, Landing, LoginModal } from 'components'


const Home = (props) => {
  const { user } = props
  const { is_authenticated } = user
  const [showLogin, setShowLogin] = useState(false)
  const [signUpConfirmation, setSignUpConfirmation] = useState(false)
  const params = queryString.parse(props.location.search)
  const referrer = document.referrer

  const handleClickCloseLoginModal = () => {
    setShowLogin(false)
  }
  useEffect(() => {
    
    if ((params.status === 'success') && referrer === 'https://hiveonboard.com/') {
      console.log({referrer})
      setSignUpConfirmation(true)
      if(!is_authenticated) {
        setShowLogin(true)
      } else {
        setShowLogin(false)
      }
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <LoginModal
        show={showLogin}
        onHide={handleClickCloseLoginModal}
        signUpConfirmation={signUpConfirmation} />
      {is_authenticated && <Feeds />}
      {!is_authenticated && <Landing />}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(Home)
