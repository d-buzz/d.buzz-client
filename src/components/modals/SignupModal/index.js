import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { authenticateUserRequest } from 'store/auth/actions'
import { Spinner } from 'components/elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa'
import Button from '@material-ui/core/Button'
import { signOnHiveonboard } from 'services/helper'
import { SuccessConfirmation } from 'components/elements'
import CircularBrandIcon from 'components/elements/Icons/CircularBrandIcon'
import HiveButton from 'components/common/HiveButton'
import MetaMaskButton from 'components/common/MetaMaskButton'

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

const SignupModal = (props) => {

  const {
    show,
    onHide,
    authenticateUserRequest,
    signUpConfirmation,
  } = props

  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [hasMetaMaskInstalled, setHasMetaMaskIntalled] = useState(false)
  /* eslint-disable */

  const handleClickLogin = () => {
    setLoading(true)
    authenticateUserRequest('', '', false, false, true)
      .then(() => {
        setLoading(false)
      })
  }

  const handleClickSignup = () => {
    signOnHiveonboard()
  }

  useEffect(() => {
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
                <span className={classes.loginLabel}>Sign up on DBUZZ</span>
                {signUpConfirmation && (
                  <React.Fragment>
                    <div style={{ height: 100, width: 100 }} >
                      <SuccessConfirmation />
                    </div>
                    <span style={{ color: 'green '}}> You successfully created a HIVE account, and can now login to D.Buzz </span>
                  </React.Fragment>
                )}
              </center>
            </div>
              <React.Fragment>
                <React.Fragment>
                  <HiveButton onClick={handleClickSignup} title='Sign up with Hive'/>
                </React.Fragment>
                <FormSpacer />
                <React.Fragment>
                  {(hasMetaMaskInstalled) && (
                    <MetaMaskButton onClick={handleClickLogin} title='Signup with MetaMask'/>
                    )}
                  {!hasMetaMaskInstalled && (
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

export default connect(mapStateToProps, mapDispatchToProps)(SignupModal)
