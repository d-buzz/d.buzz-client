import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { CreateBuzzForm } from 'components'

const useStyles = createUseStyles({
  modal: {
    width: 630,
    backgroundColor: 'none',
    '& div.modal-content': {
      width: 630,
      borderRadius: '20px 20px !important',
      border: 'none',
    }
  },
  modalBody: {
    paddingLeft: 0,
    paddingRight: 0
  },
})

const BuzzFormModal = (props) => {
  const { show, onHide } = props
  const classes = useStyles()

  return (
    <React.Fragment>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={onHide}
        dialogClassName={classes.modal}
      >
        <ModalBody className={classes.modalBody}>
          <IconButton style={{ marginTop: -10, marginLeft: 5, marginBottom: 5, }} onClick={onHide}>
            <CloseIcon />
          </IconButton>
          <CreateBuzzForm modal={true} hideModalCallback={onHide} />
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default BuzzFormModal
