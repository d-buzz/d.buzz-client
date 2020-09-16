import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { Spinner } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import classNames from 'classnames'
import { hasCompatibleKeychain } from 'services/helper'
import Form from 'react-bootstrap/Form'
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa'
import Button from '@material-ui/core/Button'

const useStyles = createUseStyles(theme => ({
  loginButton: {
    marginTop: 15,
    width: 100,
    height: 35,
    cursor: 'pointer',
  },
  checkBox: {
    cursor: 'pointer',
  },
  label: {
    fontFamily: 'Segoe-Bold',
    ...theme.font,
  },
  modal: {
    '& div.modal-content': {
      borderRadius: '15px 15px !important',
      border: 'none',
      width: 400,
      margin: '0 auto',
      backgroundColor: theme.background.primary,
    },
    '& input.form-control': {
      borderRadius: '50px 50px',
      fontSize: 14,
      ...theme.search.background,
      ...theme.font,
    },
    '& label': {
      fontSize: 14,
      ...theme.font,
    },
  },
  browserExtension: {
    borderColor: 'red !important',
    ...theme.font,
    '&:hover': {
      color: '#e61b33 !important',
      backgroundColor: 'pink !important',
    },
  },
}))

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
  const [hasInstalledKeychain, setHasInstalledKeychain] = useState(false)
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

  const handleClickCheckbox = (e) => {
    const { target } = e
    const { name } = target

    if(name === 'keychain') {
      const isCompatible = hasCompatibleKeychain() ? true: false
      setHasInstalledKeychain(isCompatible)
      setUseKeychain(!useKeychain)
      setPassword('') 
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
          {hasInstalledKeychain && (
            <React.Fragment>
              <span >
                <Form.Check
                  id="checkbox"
                  type="checkbox"
                  name="keychain"
                  label="Login with Hive Keychain"
                  className={classNames(classes.checkBox, classes.label)}
                  onClick={handleClickCheckbox}
                />
              </span>
            </React.Fragment>
          )}
          {!hasInstalledKeychain && (
            <React.Fragment>
              <span >
                <Form.Check
                  id="checkbox"
                  type="checkbox"
                  name="keychain"
                  label="Login with Hive Keychain"
                  className={classNames(classes.checkBox, classes.label)}
                  onClick={handleClickCheckbox}
                />
              </span>
              <FormSpacer />
              {useKeychain && (
                <React.Fragment>
                  <center><h6 className={classes.label}>Install Hive Keychain</h6>
                    <Button  
                      classes={{root: classes.browserExtension}}
                      style={{borderRadius: 50}}
                      variant="outlined" 
                      startIcon={<FaChrome />}  
                      href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=en" 
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Chrome
                    </Button>
                    <Button 
                      classes={{root: classes.browserExtension}}
                      variant="outlined" 
                      style={{borderRadius: 50, marginLeft: 15}}
                      startIcon={<FaFirefoxBrowser />} 
                      href="https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/" 
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Firefox
                    </Button>
                  </center>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          <center>
            {!loading && (
              <ContainedButton
                onClick={handleClickLogin}
                transparent={true}
                className={classes.loginButton}
                fontSize={15}
                disabled={(!useKeychain && (`${username}`.trim() !== '' || `${password}`.trim() !== '')) || (`${username}`.trim() !== '' && useKeychain) || (useKeychain && !hasInstalledKeychain)}
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
