import ContainedButton from 'components/elements/Buttons/ContainedButton'
import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 550,
      minWidth: 100,
      color: '#ffffff',
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
  modalTitle: {
    color: theme.font.color,
    marginBottom: 10,
  },
  buttonsContainer: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  continueButton: {
    margin: '0 5px',
    color: theme.font.color,
  },
  cancelButton: {
    margin: '0 5px',
    background: 'grey',
  },
  leaveMessage: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 15,
    fontSize: '1.15em',
    color: theme.font.color,
  },
  link: {
    width: '80%',
    color: '#E61C34',
    fontWeight: 800,
    wordBreak: 'break-word',
  },
}))

const LinkConfirmationModal = (props) => {
  const {
    link,
    onHide,
  } = props
  const classes = useStyles()

  const handleCloseModal = () => {
    onHide(false)
  }

  const handleRedirectLink = () => {
    window.open((link.startsWith('https') ? link : `https://${link.replace('http://', '')}`), '_blank')
    onHide(false)
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={link} onHide={handleCloseModal}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h2 className={classes.modalTitle}>Your're about to leave DBuzz</h2>
            </center>
            <span className={classes.leaveMessage}>
              <b>This link will bring you to:</b>
              <p className={classes.link}>{link}</p>
            </span>
          </div>
          <div className={classes.buttonsContainer}>
            <ContainedButton
              onClick={handleRedirectLink}
              className={classes.continueButton}
              label='Continue'
              fontSize={18}
            />
            <ContainedButton
              onClick={handleCloseModal}
              className={classes.cancelButton}
              label='Cancel'
              fontSize={18}
            />
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default LinkConfirmationModal