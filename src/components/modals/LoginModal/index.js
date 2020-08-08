import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl'
import FormCheck from 'react-bootstrap/FormCheck'
import InputGroup from 'react-bootstrap/InputGroup'
import { useHistory } from 'react-router-dom'
import { ContainedButton, LockIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { HashtagLoader } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'

const useStyles = createUseStyles({
  loginButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  checkBox: {
    '&input': {
      cusor: 'pointer',
    }
  }
})

const FormSpacer = () => {
  return (
    <div style={{ height: 15, width: '100%' }}></div>
  )
}

const LoginModal = (props) => {

  const {
    show,
    onHide,
    authenticateUserRequest,
    loading,
  } = props

  const classes = useStyles()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [useKeychain, setUseKeychain] = useState(false)
  const [hasAuthenticationError, setHasAuthenticationError] = useState(false)
  const history = useHistory()

  const onChange = (e) => {
    const { target } = e
    const { name, value } = target

    if(name === 'username') {
      setUsername(value)
    } else if(name === 'password') {
      setPassword(value)
    }
    setHasAuthenticationError(false)
  }

  const onCheckBoxChanged = (e) => {
    const { target } = e
    const { name, checked } = target

    if(name === 'keychain') {
      if(checked) { setPassword('') }
      setUseKeychain(checked)
    }
  }

  const handleClickLogin = () => {
    authenticateUserRequest(username, password, useKeychain)
      .then(({ is_authenticated }) => {
        if(is_authenticated) {
          history.replace('/')
        } else {
          setHasAuthenticationError(true)
        }
      })
  }

  return (
    <React.Fragment>
      <Modal show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
            <center>
              <h5>Hi there, welcome back!</h5>
              {
                hasAuthenticationError && (
                  <label style={{ color: 'red' }}>Authentication failed, please check credentials and retry again</label>
                )
              }
            </center>
          </div>
          <FormLabel>Username</FormLabel>
          <FormControl disabled={loading} name="username" type="text" value={username} onChange={onChange} />
          <FormSpacer />
          {
            !useKeychain && (
              <React.Fragment>
                <FormLabel>Password</FormLabel>
                <FormControl disabled={loading} name="password" type="password" value={password} onChange={onChange} />
                <FormSpacer />
              </React.Fragment>
            )
          }
          <FormCheck
            name="keychain"
            type="checkbox"
            label="Use hivekeychain"
            className={classes.checkBox}
            onChange={onCheckBoxChanged}
          />
          <center>
            {
              !loading && (
                <ContainedButton
                  onClick={handleClickLogin}
                  transparent={true}
                  className={classes.loginButton}
                  fontSize={15}
                  label="Submit"
                />
              )
            }
            {
              loading && (
                <HashtagLoader loading={true} />
              )
            }
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  loading: pending(state, 'AUTHENTICATE_USER_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    authenticateUserRequest,
  }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)
