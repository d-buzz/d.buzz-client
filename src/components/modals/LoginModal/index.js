import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import FormCheck from 'react-bootstrap/FormCheck'
import FormControl from 'react-bootstrap/FormControl'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { Spinner } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { pending } from 'redux-saga-thunk'
import classNames from 'classnames'
import { hasCompatibleKeychain } from 'services/helper'
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa'
import Button from '@material-ui/core/Button'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-router-dom'
import { signOnHiveonboard } from 'services/helper'
import { SuccessConfirmation } from 'components/elements'

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
      maxWidth: 400,
      minWidth: 100,
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
  noAccount: {
    fontSize: 14,
  },
  signup: {
    color: '#d32f2f !important',
    wordBreak: 'break-word !important',
    whiteSpace: 'nowrap',
    fontSize: 14,
  },
  username: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameHint: {
    margin: 0,
    marginRight: 5,
    padding: '3px 15px',
    paddingBottom: 6,
    color: theme.font.color,
    background: theme.context.view.backgroundColor,
    border: '1px solid #CED4DA',
    borderRadius: 25,
    userSelect: 'none',
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
    // loading,
    fromIntentBuzz,
    buzzIntentCallback = () => { },
    accounts,
    user,
    signUpConfirmation,
  } = props

  const classes = useStyles()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState()
  const [useKeychain, setUseKeychain] = useState(false)
  const [hasInstalledKeychain, setHasInstalledKeychain] = useState(false)
  const [hasAuthenticationError, setHasAuthenticationError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const { target } = e
    const { name, value } = target

    if (name === 'username') {
      setUsername(value.replace(/[@!#$%^&*()+=/\\~`,;:"'_-\s]/gi, ''))
    } else if (name === 'password') {
      setPassword(value.replace(/[\s]/gi, ''))
    }
    setHasAuthenticationError(false)
  }

  const handleClickCheckbox = (e) => {
    const { target } = e
    const { name, checked } = target

    if (name === 'keychain') {
      if (checked) {
        const isCompatible = hasCompatibleKeychain() ? true : false
        setHasInstalledKeychain(isCompatible)
        setPassword('')
      }
      setUseKeychain(checked)
    }
  }

  const handleClickLogin = () => {
    setLoading(true)
    authenticateUserRequest(username, password, useKeychain)
      .then(({ is_authenticated }) => {
        if (!is_authenticated) {
          setHasAuthenticationError(true)
          setLoading(false)
        } else {
          if (fromIntentBuzz && buzzIntentCallback) {
            buzzIntentCallback()
            setLoading(false)
          }
          onHide()
        }
      })
    setTimeout(() => {
      setHasAuthenticationError(true)
      setLoading(false)
    }, 10000)
  }

  const isDisabled = () => {
    return ((!useKeychain && (`${username}`.trim() === "" || `${password}`.trim() === "" || username === undefined || password === undefined))
      || (useKeychain && (`${username}`.trim() === '' || username === undefined))
    )
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!isDisabled()) {
        handleClickLogin()
      }
    }
  }

  const handleClickSignup = () => {
    signOnHiveonboard()
  }

  const hasSwitcherMatch = () => {
    let hasMatch = false
    const { is_authenticated } = user
    if(accounts && Array.isArray(accounts) && accounts.length !== 0 && is_authenticated) {
      accounts.forEach((item) => {
        if(item.username === username) {
          hasMatch = true
        }
      })
    }
    return hasMatch
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
            <center>
              <h6 className={classes.label}>Hi there, welcome back!</h6>
              {signUpConfirmation && (
                <React.Fragment>
                  <div style={{ height: 100, width: 100 }} >
                    <SuccessConfirmation />
                  </div>
                  <span style={{ color: 'green '}}> You successfully created a HIVE account, and can now login to D.Buzz </span>
                </React.Fragment>
              )}
              {hasAuthenticationError && (
                <span style={{ color: 'red' }}>Authentication failed, please check credentials and retry again.</span>
              )}
              {hasSwitcherMatch() && (<span style={{ color: 'red' }}>You are trying to login a username that is already added in the account switcher</span>)}
            </center>
          </div>
          <FormLabel className={classes.label}>Username</FormLabel>
          <div className={classes.username}>
            <b className={classes.usernameHint}>@</b>
            <FormControl
              disabled={loading}
              name="username"
              type="text"
              value={username}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>
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
                <FormCheck
                  id="default-checkbox"
                  type="checkbox"
                  name="keychain"
                  checked={useKeychain}
                  label="Login with Hive Keychain"
                  className={classNames(classes.checkBox, classes.label)}
                  onChange={handleClickCheckbox}
                />
              </span>
            </React.Fragment>
          )}
          {!hasInstalledKeychain && !isMobile && (
            <React.Fragment>
              <span >
                <FormCheck
                  id="checkbox"
                  type="checkbox"
                  name="keychain"
                  checked={useKeychain}
                  label="Login with Hive Keychain"
                  className={classNames(classes.checkBox, classes.label)}
                  onChange={handleClickCheckbox}
                />
              </span>
              <FormSpacer />
              {useKeychain && (
                <React.Fragment>
                  <center><h6 className={classes.label}>Install Hive Keychain</h6>
                    <Button
                      classes={{ root: classes.browserExtension }}
                      style={{ borderRadius: 50 }}
                      variant="outlined"
                      startIcon={<FaChrome />}
                      href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=en"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Chrome
                    </Button>
                    <Button
                      classes={{ root: classes.browserExtension }}
                      variant="outlined"
                      style={{ borderRadius: 50, marginLeft: 15 }}
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
                disabled={isDisabled() || hasSwitcherMatch()}
                label="Submit"
              />
            )}
            {loading && (
              <Spinner size={40} loading={true} />
            )}
          </center>
          <FormSpacer />
          <center>
            <span className={classNames(classes.noAccount,classes.label)}>Don't have an account?</span>
            <Link to={"#"} onClick={handleClickSignup} className={classNames(classes.label, classes.signup)}>
              &nbsp;<span>Sign up</span>
            </Link>
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  // loading: pending(state, 'AUTHENTICATE_USER_REQUEST'),
  accounts: state.auth.get('accounts'),
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    authenticateUserRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)
