import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton, Avatar } from 'components/elements'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { setThemeRequest, generateStyles } from 'store/settings/actions'
import { switchAccountRequest } from 'store/auth/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 400,
      minWidth: 100,
      margin: '0 auto',
      '& h6': {
        ...theme.font,
      },
    },
    '& input.form-control': {
      borderRadius: '50px 50px',
      fontSize: 14,
    },
    '& label': {
      fontSize: 14,
    },
  },
  button: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    borderRadius: '5px 5px',
    cursor: 'pointer',
    lineHeight: 0.8,
    border: `3px solid ${theme.background.primary}`,
    '& label': {
      paddingTop: 9,
      cursor: 'pointer',
    },
  },
  darkModeButton: {
    backgroundColor: 'rgb(21, 32, 43)',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
  },
  ligthModeButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    '& label': {
      fontSize: 14,
      color: 'black',
      display: 'block',
    },
  },
  grayModeButton: {
    backgroundColor: '#202225',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
  },
  notes: {
    fontSize: 14,
    ...theme.font,
  },
  closeButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  active: {
    border: '3px solid #e61c34 !important',
    cursor: 'default !important',
  },
  accountButtons: {
    backgroundColor: theme.background.primary,
    border: theme.border.primary,
    '& label': {
      color: theme.font.color,
    },
  },
  buttonInner: {
    padding: 2,
    width: '95%',
    margin: '0 auto',
  },
  hoverable: {
    '&:hover': {
      border: '3px solid #e61c34',
    },
  },
  wrapper: {
    width: '98%',
    margin: '0 auto',
    height: 'max-content',
  },
}))


const SwitchUserModal = (props) => {
  const {
    show,
    user,
    accounts,
    onHide,
    addUserCallBack,
    switchAccountRequest,
  } = props

  const { username: activeUser } = user
  const classes = useStyles()

  const handleClickSwitchUser = (username) => () => {
    switchAccountRequest(username)
      .then(() => {
        window.location.reload()
      })
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div className={classes.wrapper}>
            <center>
              <h6>Switch User</h6>
            </center>
            {accounts.map(({ username }) => (
              <div
                onClick={activeUser !== username ? handleClickSwitchUser(username) : () => {}}
                className={classNames(classes.button, classes.accountButtons, activeUser !== username ? classes.hoverable : classes.active)}
              >
                <div className={classes.buttonInner}>
                  <Avatar author={username} height={40} />&nbsp;
                  <label>{username} ({activeUser === username ? 'online': 'offline'})</label>
                </div>
              </div>
            ))}
          </div>
          <center>
            <ContainedButton
              onClick={addUserCallBack}
              className={classes.closeButton}
              fontSize={14}
              label="Add user"
            />
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
  accounts: state.auth.get('accounts'),
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setThemeRequest,
    generateStyles,
    switchAccountRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchUserModal)
