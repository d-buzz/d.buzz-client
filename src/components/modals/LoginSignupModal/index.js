import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hasCompatibleKeychain } from 'services/helper'
import Button from '@material-ui/core/Button'
// import MetaMaskButton from 'components/common/MetaMaskButton'
import CircularBrandIcon from 'components/elements/Icons/CircularBrandIcon'
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa'
import { window } from 'rxjs'

const useStyles = createUseStyles(theme => ({
  loginSignupButton: {
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
  loginSignupLabel: {
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

const LoginSignupModal = (props) => {

  const {
    show,
    onHide,
    authenticateUserRequest,
    // loading,
    fromIntentBuzz,
    buzzIntentCallback = () => { },
  } = props

  const classes = useStyles()
  const [useCeramic, setUseCeramic] = useState(false)
  /* eslint-disable */
  let [hasExpiredDelay, setHasExpiredDelay] = useState(60)

  const handleClickLoginSignup = () => {
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
  }

  useEffect(() => {
    if(useCeramic) {
      handleClickLoginSignup()
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
                  <span className={classes.loginSignupLabel}>Login or Sign-up to Upvote or Comment</span>
                </center>
              </div>
              <React.Fragment>
                  <div style={{ marginLeft: 10, textAlign: 'left'}}>
                    <br />
                        <React.Fragment>
                          <FormSpacer />
                          <center><h6 className={classes.label}>Login/Sign-up</h6>
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
                            <br />
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
                        </React.Fragment>
                  </div>
                </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignupModal)
