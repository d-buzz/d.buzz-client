import React, {useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { CreateBuzzForm } from 'components'
import { setBuzzConfirmModalStatus, setSaveDraftsModalStatus } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BuzzConfirmModal from '../BuzzConfirmModal'
import SaveDraftModal from '../SaveDraftModal'

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
  draftsContainer: {
    width: '100%',
    display: 'inline',
    
    '& .save_draft_button': {
      float: 'right',
      lineHeight: 1,
      padding: '10px 13px',
      border: '2px solid #e74b5d',
      color: '#e74b5d',
      borderRadius: 35,
      fontSize: '0.8em',
      fontWeight: 700,
      userSelect: 'none',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 250ms',
      margin: '0 15px',
      transform: 'translateY(-5px)',

      '&:hover': {
        opacity: 0.8,
      },
    },
  },
}))

const BuzzFormModal = (props) => {
  const { show, onHide, setContent, buzzThreads } = props
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  const [openSaveDraftsModal, setOpenSaveDraftsModal] = useState(false)
  const [draftData, setDraftData] = useState(null)
  const [drafts, setDrafts] = useState(JSON.parse(localStorage.getItem('drafts'))?.length >= 1 ? JSON.parse(localStorage.getItem('drafts')) : [])

  const onHideConfirmModal = () => {
    setBuzzConfirmModalStatus(false)
    setOpen(false)
  }

  const handleSaveDraftsModalOpen = () => {
    setSaveDraftsModalStatus(true)
    setOpenSaveDraftsModal(true)
    setDraftData({
      content: buzzThreads[1].content,
    })
  }
  const OnSaveDraftsModalHide = () => {
    setSaveDraftsModalStatus(false)
    setOpenSaveDraftsModal(false)
  }

  const handleBuzzModal = () => {
    onHide()

    if(localStorage.getItem('emptyBuzz') === "false"){
      // open confrim modal before deleting buzzes
      setBuzzConfirmModalStatus(true)
      setOpen(true)
    }
  }

  const checkInDrafts = () => {
    let found = false
    drafts.forEach(draft => {
      if(buzzThreads) {
        if(draft.content === buzzThreads[1]?.content) {
          found = true
        }
      }
    })

    return found
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
          <IconButton style={{ marginTop: -10, marginLeft: 5, marginBottom: 5 }} onClick={handleBuzzModal}>
            <CloseIcon />
          </IconButton>
          {buzzThreads && buzzThreads[1].content &&
          <div className={classes.draftsContainer}>
            <span className='save_draft_button' onClick={handleSaveDraftsModalOpen} hidden={checkInDrafts()}>save draft</span>
          </div>}
          <CreateBuzzForm modal={true} hideModalCallback={onHide} buzzThreads={buzzThreads}/>
        </ModalBody>
      </Modal>
      <SaveDraftModal show={openSaveDraftsModal} onHide={OnSaveDraftsModalHide} drafts={drafts} setDrafts={setDrafts} draftData={draftData} />
      <BuzzConfirmModal show={open} onHide={onHideConfirmModal} setContent={setContent}/>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  buzzThreads: state.posts.get('buzzThreads'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setBuzzConfirmModalStatus,
    },dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(BuzzFormModal)