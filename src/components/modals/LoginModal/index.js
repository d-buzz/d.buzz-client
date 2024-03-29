import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import FormLabel from 'react-bootstrap/FormLabel'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { Spinner } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hasCompatibleKeychain } from 'services/helper'
import Button from '@material-ui/core/Button'
import { isMobile } from 'react-device-detect'
import { SuccessConfirmation } from 'components/elements'
import { Checkbox } from '@material-ui/core'
import { HiveKeyChainIcon } from 'components/elements'
// import MetaMaskButton from 'components/common/MetaMaskButton'
import CircularBrandIcon from 'components/elements/Icons/CircularBrandIcon'
import HiveButton from 'components/common/HiveButton'
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa'
import { window } from 'rxjs'
const FormControlLabel = React.lazy((() => import('@material-ui/core/FormControlLabel')))

const useStyles = createUseStyles(theme => ({
  loginButton: {
    marginTop: 5,
    marginBottom: 15,
    width: '100%',
    height: 35,
    cursor: 'pointer',
  },
  checkBox: {
    cursor: 'pointer',

    '& hover': {
      cursor: 'pointer',
    },

    '& .label': {
      color: theme.font.color,
    },
  },
  label: {
    fontFamily: 'Segoe-Bold',
    ...theme.font,
  },
  loginLabel: {
    display: 'flex',
    fontSize: '1.8em',
    fontWeight: 800,
    justifyContent: 'center',
    margin: '15px 0',
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
    fontFamily: 600,
  },
  inputField: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    border: '1px solid #e61c34',
    borderRadius: 50,
    overflow: 'hidden',
    padding: '5px 10px',
    outlineWidth: 'none',
    transition: 'all 250ms',
    '&:focus': {
      outlineWidth: 0,
      boxShadow: '0 0 0 2px #e65768',
    },
    '&:focus-within': {
      boxShadow: '0 0 0 2px #e65768',
    },
  },
  textField: {
    border: 'none',
    outlineWidth: 'none',
    color: theme.font.color,
    width: '100%',
    padding: '0 10px',
    fontWeight: 600,
    backgroundColor: 'transparent !important',
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

  const usernameRef = useRef()
  const postingRef = useRef()

  const classes = useStyles()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState()
  const [useKeychain, setUseKeychain] = useState(false)
  const [useCeramic, setUseCeramic] = useState(false)
  const [hasInstalledKeychain, setHasInstalledKeychain] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMetaMaskInstalled, setHasMetaMaskIntalled] = useState(false)
  const [loginMethod, setLoginMethod] = useState('HIVE')
  /* eslint-disable */
  let [hasExpiredDelay, setHasExpiredDelay] = useState(60)
  
  const onChange = (e) => {
    const { target } = e
    const { name, value } = target

    if (name === 'username') {
      setUsername('@' + value.replace(/[@!#$%^&*()+=/\\~`,;:"'_\s]/gi, ''))
    } else if (name === 'password') {
      setPassword(value.replace(/[\s]/gi, ''))
    }
  }

  const handleClickKeychain = (e) => {
    const { target } = e
    const { name, checked } = target

    if (name === 'keychain') {
      setUseKeychain(checked)
      if(checked) {
        setPassword('')
      }
    }
  }

  const handleClickLogin = () => {
    setLoading(true)
    authenticateUserRequest(username.replace(/[@!#$%^&*()+=/\\~`,;:"'_\s]/gi, ''), password, useKeychain, useCeramic)
      .then(({ is_authenticated }) => {

        if (!is_authenticated) {
          setLoading(false)
        } else {
          if (fromIntentBuzz && buzzIntentCallback) {
            buzzIntentCallback()
            setLoading(false)
          }
          onHide()
        }

        if(useCeramic) {
          setUseCeramic(false)
        }
      })
  }

  const isDisabled = () => {
    return ((!useKeychain && (`${username}`.trim() === "" || `${password}`.trim() === "" || username === undefined || password === undefined))
      || (useKeychain && (`${username}`.trim() === '' || username === undefined)) || ((`${username}`.trim() === '' || username === undefined))
    )
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!isDisabled()) {
        handleClickLogin()
      }
    }
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

  // const handleCeramicLogin = () => {
  //   setUseCeramic(true)
  // }

  useEffect(() => {
    if(useCeramic) {
      handleClickLogin()
    }
  }, [useCeramic])
  

  useEffect(() => {
    const isCompatible = hasCompatibleKeychain() ? true : false
    setHasInstalledKeychain(isCompatible)

    if (typeof window.ethereum !== 'undefined') {
      setHasMetaMaskIntalled(true)
    }
  }, [])

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <React.Fragment>
            <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
              <center>
                <CircularBrandIcon />
                <span className={classes.loginLabel}>Log in to DBUZZ</span>
                {signUpConfirmation && (
                  <React.Fragment>
                    <div style={{ height: 100, width: 100 }} >
                      <SuccessConfirmation />
                    </div>
                    <span style={{ color: 'green '}}> You successfully created a HIVE account, and can now login to D.Buzz </span>
                  </React.Fragment>
                )}
                {hasSwitcherMatch() && (<span style={{ color: 'red' }}>You are trying to login a username that is already added in the account switcher</span>)}
              </center>
            </div>
            {loginMethod === 'HIVE' ?
              <React.Fragment>
                {!useCeramic && (
                <React.Fragment>
                  <FormLabel className={classes.label}>Username</FormLabel>
                  <div className={classes.inputField} tabIndex={0} onFocus={() => usernameRef.current.focus()}>
                    <input
                      ref={usernameRef}
                      className={classes.textField}
                      disabled={loading}
                      name="username"
                      type="text"
                      value={ username || '@' }
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                      />
                  </div>
                </React.Fragment>
              )}
              <FormSpacer />
              {!useKeychain && !useCeramic && (
                <React.Fragment>
                  <FormLabel className={classes.label}>Posting key</FormLabel>
                  <div className={classes.inputField} tabIndex={0} onFocus={() => postingRef.current.focus()}>
                    <input
                      ref={postingRef}
                      className={classes.textField}
                      disabled={loading}
                      name="password"
                      type="password"
                      value={password}
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                    />
                  </div>
                  <FormSpacer />
                </React.Fragment>
              )}
              <center>
                {!loading &&!useCeramic && (
                  <ContainedButton
                    onClick={handleClickLogin}
                    transparent={true}
                    className={classes.loginButton}
                    fontSize={15}
                    disabled={isDisabled() || hasSwitcherMatch()}
                    label="Submit"
                  />
                )}
              </center>
              {!useCeramic && (
                <div style={{ marginLeft: 10, textAlign: 'left'}}>
                  <br />
                  {hasInstalledKeychain ?
                    <FormControlLabel
                      className='checkBox'
                      control={
                        <Checkbox 
                          id="checkbox"
                          type="checkbox"
                          name="keychain"
                          checked={useKeychain}
                          onChange={handleClickKeychain}
                          icon={<HiveKeyChainIcon/>} 
                        />
                      }
                      label=" Login With Hive Keychain"
                    /> :
                    !isMobile && !hasInstalledKeychain &&
                      <React.Fragment>
                        <FormSpacer />
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
                        <br />
                      </React.Fragment>}
                </div>
              )}
              </React.Fragment> :
              <React.Fragment>
                <React.Fragment>
                  <HiveButton onClick={() => setLoginMethod('HIVE')} disabled={useKeychain || useCeramic} title='Login with Hive'/>
                </React.Fragment>
                <FormSpacer />
                <React.Fragment>
                  {!hasMetaMaskInstalled && !isMobile && (
                    <React.Fragment>
                      <FormSpacer />
                      <center><h6 className={classes.label}>Install Metamask</h6>
                        <Button
                          classes={{ root: classes.browserExtension }}
                          style={{ borderRadius: 50 }}
                          variant="outlined"
                          startIcon={<FaChrome />}
                          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
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
                          href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Firefox
                        </Button>
                      </center>
                    </React.Fragment>
                  )}
                </React.Fragment>
              </React.Fragment>
            }
            <center>
              {loading && (
                <Spinner size={40} loading={true} />
              )}
            </center>
            <FormSpacer />
          </React.Fragment>
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
