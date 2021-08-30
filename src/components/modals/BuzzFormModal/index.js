import React, {useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { CreateBuzzForm } from 'components'
import { setBuzzConfirmModalStatus } from 'store/interface/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BuzzConfirmModal from '../BuzzConfirmModal'

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
}))

const BuzzFormModal = (props) => {
  const { show, onHide } = props
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  const onHideConfirmModal = () => {
    setBuzzConfirmModalStatus(false)
    setOpen(false)
  }

  const handleBuzzModal = () => {
    onHide()

    if(localStorage.getItem('emptyBuzz') === "false"){
      // open confrim modal before deleting buzzes
      setBuzzConfirmModalStatus(true)
      setOpen(true)
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
          <IconButton style={{ marginTop: -10, marginLeft: 5, marginBottom: 5 }} onClick={handleBuzzModal}>
            <CloseIcon />
          </IconButton>
          <CreateBuzzForm modal={true} hideModalCallback={onHide} />
        </ModalBody>
      </Modal>
      <BuzzConfirmModal show={open} onHide={onHideConfirmModal}/>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setBuzzConfirmModalStatus,
    },dispatch),
})

export default connect(null, mapDispatchToProps)(BuzzFormModal)