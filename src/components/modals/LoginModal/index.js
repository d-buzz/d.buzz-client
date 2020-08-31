import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl'
import FormCheck from 'react-bootstrap/FormCheck'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { Spinner } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import classNames from 'classnames'

const useStyles = createUseStyles({
  loginButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  checkBox: {
    '&input': {
      cusor: 'pointer',
    },
  },
  label: {
    fontFamily: 'Segoe-Bold',
  },
  modal: {
    '& div.modal-content': {
      borderRadius: '15px 15px !important',
      border: 'none',
      width: 400,
      margin: '0 auto',
    },
    '& input.form-control': {
      borderRadius: '50px 50px',
      fontSize: 14,
    },
    '& label': {
      fontSize: 14,
    },
  },
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
        if(!is_authenticated) {
          setHasAuthenticationError(true)
        }
      })
  }

  const onKeyDown = (e) => {
    if(e.key === 'Enter') {
      if((username.trim() !== '' && useKeychain) || (username.trim() !== '' && !useKeychain && `${password}`.trim() !== '')) {
        handleClickLogin()
      }
    }
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
            <center>
              <h6 className={classes.label}>Hi there, welcome back!</h6>
              {hasAuthenticationError && (
                <label style={{ color: 'red' }}>Authentication failed, please check credentials and retry again</label>
              )}
            </center>
          </div>
          <FormLabel className={classes.label}>Username</FormLabel>
          <FormControl
            disabled={loading}
            name="username"
            type="text"
            value={username}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <FormSpacer />
          {!useKeychain && (
            <React.Fragment>
              <FormLabel className={classes.label}>Posting key</FormLabel>
              <FormControl
                disabled={loading}
                name="password"
                type="password"
                value={password}
                onChange={onChange}
                onKeyDown={onKeyDown}
              />
              <FormSpacer />
            </React.Fragment>
          )}
          <FormCheck
            name="keychain"
            type="checkbox"
            label="Use hivekeychain"
            className={classNames(classes.checkBox, classes.label)}
            onChange={onCheckBoxChanged}
          />
          <center>
            {!loading && (
              <ContainedButton
                onClick={handleClickLogin}
                transparent={true}
                className={classes.loginButton}
                fontSize={15}
                label="Submit"
              />
            )}
            {loading && (
              <Spinner size={40} loading={true} />
            )}
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
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)
