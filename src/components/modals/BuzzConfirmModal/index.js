import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import { updateBuzzThreads, updateBuzzTitle } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setBuzzModalStatus } from 'store/interface/actions'

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
      color: theme.font.color,
      marginTop: 5,
      fontSize: '1.2em',
      fontWeight: 400,
    },

    '& .modalButtons': {
      marginTop: 10,
      display: 'flex',
      width: '100%',
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
}))

function BuzzConfirmModal(props) {
  const { show, onHide, updateBuzzThreads, buzzThreads, setBuzzModalStatus, setContent, updateBuzzTitle } = props
  const classes = useStyles()

  const handleOnHide = () => {
    onHide()
    updateBuzzThreads({1: {id: 1, content: ''}})
    setBuzzModalStatus(false)
    updateBuzzTitle('')
  }

  const onCancel = () => {
    onHide()
    if(setContent) {
      setContent('')
    }
  }

  return (
    <React.Fragment>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={false}
      >
        <ModalBody className={classes.modalBody}>
          <div className={classes.confirmModalBody}>
            <span className='title'>Discard {buzzThreads && Object.keys(buzzThreads).length > 1 ? 'Thread' : 'Buzz'}?</span>
            <p className='description'>This can’t be undone and you’ll lose your draft.</p>
            <div className="modalButtons">
              <span className="cancel modalButton" onClick={onCancel}>Keep</span>
              <span className="discard modalButton" onClick={handleOnHide}>Discard</span>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  buzzThreads: state.posts.get('buzzThreads'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      updateBuzzThreads,
      setBuzzModalStatus,
      updateBuzzTitle,
    },dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(BuzzConfirmModal)
