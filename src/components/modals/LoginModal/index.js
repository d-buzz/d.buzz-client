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
import QRCode from 'qrcode.react'
import { hasCompatibleKeychain } from 'services/helper'
import Button from '@material-ui/core/Button'
import { isMobile } from 'react-device-detect'
import { SuccessConfirmation } from 'components/elements'
import { Checkbox } from '@material-ui/core'
import { ProgressBar } from 'react-bootstrap'
import { HiveKeyChainIcon } from 'components/elements'
// import MetaMaskButton from 'components/common/MetaMaskButton'
import CircularBrandIcon from 'components/elements/Icons/CircularBrandIcon'
import HiveButton from 'components/common/HiveButton'
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa'
import { window } from 'rxjs'
import MetaMaskButton from 'components/common/MetaMaskButton'
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
  const [useHAS, setUseHAS] = useState(false)
  const [useCeramic, setUseCeramic] = useState(false)
  const [hasInstalledKeychain, setHasInstalledKeychain] = useState(false)
  const [qrCode, setQRCode] = useState(null)
  const [hasAuthenticationError, setHasAuthenticationError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMetaMaskInstalled, setHasMetaMaskIntalled] = useState(true)
  const [loginMethod, setLoginMethod] = useState(null)
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
    setHasAuthenticationError(false)
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

  const handleClickHAS = (e) => {
    const { target } = e
    const { name, checked } = target
    
    if (name === 'HAS') {
      if (checked) {
        setPassword('')
      }
      setUseHAS(checked)
    }
  }

  const handleClickBack = () => {
    setQRCode(null)
    localStorage.removeItem('hasQRcode')
  }

  const handleGoBack = () => {
    setLoginMethod(null)
    setUseKeychain(false)
    setUseHAS(false)
    setUseCeramic(false)
  }


  const handleClickLogin = () => {
    setLoading(true)
    setHasAuthenticationError(false)
    authenticateUserRequest(username.replace(/[@!#$%^&*()+=/\\~`,;:"'_\s]/gi, ''), password, useKeychain, useHAS, useCeramic)
      .then(({ is_authenticated }) => {

        if (useHAS) {
          const hasExpiredDelayInterval = setInterval(() => {
            // console.log('this', hasExpiredDelay)
            hasExpiredDelay -= 1
            setHasExpiredDelay(hasExpiredDelay)

            setLoading(false)
            const rawQR = localStorage.getItem('hasQRcode')
            setQRCode(rawQR)

            if (hasExpiredDelay === 0) {
              // console.log('sample hit')
              clearInterval(hasExpiredDelayInterval)
              setHasExpiredDelay(60)
              localStorage.removeItem('hasQRcode')
              handleClickBack()
            }
          }, 1000)  

        } else if (!useHAS) {
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
        }

        if(useCeramic) {
          setUseCeramic(false)
          setHasAuthenticationError(false)
        }
      })
      
    // setTimeout(() => {
    //   setHasAuthenticationError(true)
    //   setLoading(false)
    // }, 10000)
  }

  const isDisabled = () => {
    return ((!useKeychain && !useHAS && (`${username}`.trim() === "" || `${password}`.trim() === "" || username === undefined || password === undefined))
      || (useKeychain && (`${username}`.trim() === '' || username === undefined)) || (useHAS && (`${username}`.trim() === '' || username === undefined))
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

  const handleCeramicLogin = () => {
    setUseCeramic(true)
  }

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

  const handleOpenMetaMask = () => {
    window.location.href = 'https://metamask.app.link/dapp/next.d.buzz'
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          {(qrCode === null) && (
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
                  {hasAuthenticationError && (
                    <span style={{ color: 'red' }}>Authentication failed, please check credentials and retry again.</span>
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
                {!useKeychain && !useHAS && !useCeramic && (
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
                    {/* <FormControlLabel
                      className='checkBox'
                      control={
                        <Checkbox 
                          id="checkbox"
                          type="checkbox"
                          name="HAS"
                          checked={useHAS}
                          disabled={useKeychain}
                          onChange={handleClickHAS}
                          icon={<HiveAuthenticationServiceIcon/>} 
                        />
                      }
                      label="Login With Hive Authentication Service"
                    /> */}
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
                            disabled={useHAS}
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
                    <HiveButton onClick={() => setLoginMethod('HIVE')} disabled={useKeychain || useHAS || useCeramic} title='Login with Hive'/>
                  </React.Fragment>
                  <FormSpacer />
                  <React.Fragment>
                    {/* {(hasMetaMaskInstalled) && !isMobile && accounts.length === 0 && ( */}
                    <MetaMaskButton onClick={handleCeramicLogin} disabled={useKeychain || useHAS || useCeramic} title='Login with MetaMask'/>
                    {/* // )} */}
                    {/* {(isMobile && !hasMetaMaskInstalled) && (
                      <MetaMaskButton onClick={handleOpenMetaMask} disabled={useKeychain || useHAS || useCeramic} title='Login with MetaMask'/>
                    )} */}
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
              {loginMethod !== null && !loading &&
                    <ContainedButton
                      onClick={handleGoBack}
                      transparent={true}
                      className={classes.loginButton}
                      fontSize={15}
                      label="Go Back"
                    />
                  }
                {loading && (
                  <Spinner size={40} loading={true} />
                )}
              </center>
              <FormSpacer />
            </React.Fragment>
          )}
          {(qrCode !== null) && (
            <React.Fragment>
              <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
                <center>
                  <h3 className={classes.label}>Login to D.Buzz!</h3>
                  {!isMobile && <h6>Open your Hive Keychain Mobile app to scan the QRcode and approve the request</h6>}
                  {isMobile && <h6>Tap on the QR Code to open Hive Keychain Mobile app and approve the request</h6>}
                  <br />
                  <a href={isMobile ? qrCode : '#'}>
                    <QRCode 
                      value={qrCode}
                      size={!isMobile ? '150' : '100'}
                    />
                  </a>
                
                  <br />
                  <br />
                  <h1>{hasExpiredDelay}</h1>
                  <ProgressBar animated now={hasExpiredDelay} max={60} />

                  {!loading && (
                    <ContainedButton
                      onClick={handleClickBack}
                      transparent={true}
                      className={classes.loginButton}
                      fontSize={15}
                      label="Go Back"
                    />
                  )}
                  {loading && (
                    <Spinner size={40} loading={true} />
                  )}
                </center>
              </div>
            </React.Fragment>
          )}
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
