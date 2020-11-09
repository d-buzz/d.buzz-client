import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { closeMuteDialog } from 'store/interface/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
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
    height: 60,
    marginBottom: 15,
    borderRadius: '5px 5px',
    cursor: 'pointer',
    lineHeight: 0.8,
    border: `3px solid ${theme.background.primary}`,
    '& :first-child': {
      paddingTop: 5,
    },
    '& label': {
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
  innerModal: {
    width: '98%',
    margin: '0 auto',
    height: 'max-content',
  },
  text: {
    ...theme.font,
  },
}))


const MuteModal = (props) => {
  const {
    closeMuteDialog,
    muteModal,
  } = props
  const [open, setOpen] = useState(false)
  const [username, setUsernamae] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    if(muteModal && muteModal.hasOwnProperty('open')) {
      const { open, username } = muteModal
      setOpen(open)
      setUsernamae(username)
    }
  }, [muteModal])

  const onHide = () => {
    closeMuteDialog()
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={open} onHide={onHide}>
        <ModalBody>
          <div className={classes.innerModal}>
            <center>
              <h6>Add user to mutelist?</h6>
              <p className={classes.text}>
                Would you like to add <b>@{username}</b> to your list of
                muted users?
              </p>
            </center>
          </div>
          <div style={{ display: 'inline-block' }}>
            <ContainedButton
              onClick={onHide}
              className={classes.closeButton}
              fontSize={14}
              label="Add"
            />
          </div>
          <div style={{ display: 'inline-block', float: 'right' }}>
            <ContainedButton
              onClick={onHide}
              className={classes.closeButton}
              fontSize={14}
              transparent={true}
              label="Cancel"
            />
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
  muteModal: state.interfaces.get('muteDialogUser'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closeMuteDialog,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteModal)
