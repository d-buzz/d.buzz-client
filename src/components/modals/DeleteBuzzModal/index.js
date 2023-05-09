import ContainedButton from 'components/elements/Buttons/ContainedButton'
import Spinner from 'components/elements/progress/Spinner'
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { deleteBuzzWithPostingKey, deleteBuzzWitKeychain } from 'services/api'
import { broadcastNotification } from 'store/interface/actions'
import { bindActionCreators } from 'redux'

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
    '& label': {
      fontSize: 14,
    },
  },
  modalTitle: {
    color: theme.font.color,
    marginBottom: 10,
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 15,
    fontSize: '1.15em',
    color: theme.font.color,

    '& p': {
      margin: '0px !important',
    },
  },
  buttonsContainer: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  deleteButton: {
    margin: '0 5px',
    color: theme.font.color,
  },
  cancelButton: {
    margin: '0 5px',
    background: 'grey',
  },
  deletingBuzzContainer: {
    margin: '15px 0',
    width: '100%',
  },
}))

const DeleteBuzzModal = (props) => {
  const {
    show,
    onHide,
    user={},
    buzzId='',
    broadcastNotification,
  } = props
  const classes = useStyles()

  const [author] = useState(buzzId.split('/')[0].replace('@', ''))
  const [permalink] = useState(buzzId.split('/')[1].replace('@', ''))

  const [deletingBuzz, setDeletingBuzz] = useState(false)

  const handleCloseModal = () => {
    onHide(false)
  }

  const handleSuccessResponse = (response) => {
    const { success } = response

    if(success) {
      setTimeout(() => {
        broadcastNotification('success', `Deleted buzz successfully.`)
      }, 3000)
      setTimeout(() => {
        setDeletingBuzz(false)
        handleCloseModal()
        window.location = `${window.location.origin}/@${author}`
      }, 5000)
    } else {
      broadcastNotification('error', `Cannot delete this buzz.`)
      setDeletingBuzz(false)

      setTimeout(() => {
        handleCloseModal()
      }, 3000)
    }
  }

  const handleErrorResponse = (err) => {
    setDeletingBuzz(false)

    if(err.toString() === '-32003') {
      broadcastNotification('error', 'Buzz cannot be deleted after the payout.')
    } else {
      broadcastNotification('error', `Cannot delete this buzz.`)
    }

    setTimeout(() => {
      handleCloseModal()
    }, 3000)
  }

  const handleDeleteBuzz = () => {
    setDeletingBuzz(true)

    if(user.useKeychain) {
      deleteBuzzWitKeychain(author, permalink)
        .then((response) => {
          handleSuccessResponse(response)
        })
        .catch((err) => {
          handleErrorResponse(err)
        })
    } else {
      deleteBuzzWithPostingKey(user, author, permalink)
        .then((response) => {
          handleSuccessResponse(response)
        })
        .catch((err) => {
          handleErrorResponse(err)
        })
    }
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={show} onHide={handleCloseModal}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h2 className={classes.modalTitle}>{!deletingBuzz ? 'Are  you sure?': 'Deleting Buzz'}</h2>
            </center>
            {!deletingBuzz &&
              <span className={classes.message}>
                <p>You are about to delete the buzz:</p>
                <p><b>{buzzId}</b></p>
              </span>}
          </div>
          {!deletingBuzz ?
            <>
              <div className={classes.buttonsContainer}>
                <ContainedButton
                  onClick={handleDeleteBuzz}
                  className={classes.deleteButton}
                  label='Delete'
                  fontSize={18}
                />
                <ContainedButton
                  onClick={handleCloseModal}
                  className={classes.cancelButton}
                  label='Cancel'
                  fontSize={18}
                />
              </div>
            </> :
            <div className={classes.deletingBuzzContainer}>
              <Spinner loading={true} size={50}/>
            </div>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteBuzzModal)