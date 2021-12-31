import { IconButton } from '@material-ui/core'
import CloseIcon from 'components/elements/Icons/CloseIcon'
import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  modal: {
    animation: 'zoomIn 350ms',
    width: 650,
    background: 'transparent',
    '& div.modal-content': {
      margin: '0 auto',
      background: 'transparent',
      width: 650,
      border: 'none',
    },
    '@media (max-width: 900px)': {
      width: '97% !important',
      '& div.modal-content': {
        margin: '0 auto',
        width: '97% !important',
      },
    },
  },
  modalBody: {
    padding: 0,
  },
  eventsModal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContainer: {
    height: '100%',
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    
    '& img': {
      width: 600,
      borderRadius: 20,
      animation: 'eventContainerAnimation infinite 3.5s',
    },
  },
  closeButton: {
    marginTop: -10,
    marginLeft: 5,
    marginBottom: 5,
    alignSelf: 'flex-end',
    background: `${theme.background.primary} !important`,
  },
}))

function EventsModal(props) {
  const { show, onHide } = props
  const classes = useStyles()

  const onHideModal = () => {
    onHide()
  }

  return (
    <React.Fragment>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={onHideModal}
        dialogClassName={classes.modal}
        animation={false}
      >
        <ModalBody className={classes.modalBody}>
          <div className={classes.eventsModal}>
            <IconButton className={classes.closeButton} onClick={onHideModal}>
              <CloseIcon />
            </IconButton>
            <span className={classes.eventContainer}>
              <img src={`${window.location.origin}/happy-new-year-2022.gif`} alt="Happy New Year 2022" />
            </span>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default EventsModal