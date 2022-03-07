import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  modal: {
    width: 630,
    '& div.modal-content': {
      margin: '0 auto',
      backgroundColor: theme.background.primary,
      width: 630,
      borderRadius: '20px 20px !important',
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
    paddingLeft: 15,
    paddingRight: 15,
  },
  confirmModalBody: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    '& .title': {
      color: theme.font.color,
      fontSize: '1.5em',
      fontWeight: 800,
    },

    '& .description': {
      margin: '15px 0',
      color: '#E61C34',
      fontSize: '1.25em',
      fontWeight: 600,
    },

    '& .modalButtons': {
      marginTop: 10,
      display: 'flex',
      width: '100%',

      '& button': {
        outlineWidth: 0,
        border: 'none',

        '&:disabled': {
          opacity: '0.5',
          cursor: 'none',

          '&:hover': {
            background: '#E61C34',
          },
        },
      },

      '& .modalButton': {
        padding: 8,
        width: '100%',
        flex: 0.5,
        textAlign: 'center',
        borderRadius: 35,
        color: '#000000',
        fontSize: '1.2em',
        fontWeight: '600',
        userSelect: 'none',
        cursor: 'pointer',
      },
  
      '& .cancel': {
        background: '#F5F8FA',
        marginRight: 8,
  
        '&:hover': {
          background: '#EDF0F2',
        },
      },
  
      '& .discard': {
        background: '#E61C34',
        color: '#ffffff',
  
        '&:hover': {
          background: '#B71C1C',
        },
      },
    },
  },
}))

function DeletePocketConfirmModal(props) {
  const { show, onHide, pocket, handleDeletePocket } = props
  const classes = useStyles()

  const handleOnDelete = () => {
    handleDeletePocket()
  }

  const onCancel = () => {
    onHide(!true)
  }

  return (
    <React.Fragment>
      <Modal
        backdrop='static'
        keyboard={false}
        show={show}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={false}
      >
        <ModalBody className={classes.modalBody}>
          <div className={classes.confirmModalBody}>
            <span className='title'>Delete {pocket} Pocket?</span>
            <div className="description">This will also delete all the buzzes in the pocket!</div>
            <div className='modalButtons'>
              <button className='cancel modalButton' onClick={onCancel}>Cancel</button>
              <button className='discard modalButton' onClick={handleOnDelete}>Delete</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default DeletePocketConfirmModal