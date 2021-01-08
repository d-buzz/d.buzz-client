import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton, Avatar } from 'components/elements'
import { createUseStyles } from 'react-jss'
import classNames from 'classnames'
import { setThemeRequest, generateStyles } from 'store/settings/actions'
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
    height: 55,
    marginBottom: 15,
    borderRadius: '5px 5px',
    cursor: 'pointer',
    lineHeight: 0.8,
    border: `3px solid ${theme.background.primary}`,
    '& label': {
      paddingTop: 9,
      cursor: 'pointer',
    },
    '&:hover': {
      border: '3px solid #e61c34',
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
    border: '3px solid #e61c34',
  },
  accountButtons: {
    backgroundColor: theme.background.primary,
    border: theme.border.primary,
    '& label': {
      color: theme.font.color,
    },
  },
}))


const ThemeModal = (props) => {
  const {
    show,
    accounts,
    onHide,
  } = props

  const classes = useStyles()


  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Switch User</h6>
            </center>
            {accounts.map((item) => (
              <div
                className={classNames(classes.button, classes.accountButtons)}
              >
                <div style={{ padding: 2, width: '95%', margin: '0 auto', }}>
                  <Avatar author={item.username} height={45} />
                </div>
              </div>
            ))}
          </div>
          <center>
            <ContainedButton
              onClick={onHide}
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
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setThemeRequest,
    generateStyles,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeModal)
