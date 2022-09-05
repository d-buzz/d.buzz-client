import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import CloseIcon from '@material-ui/icons/Close'
import { proxyImage } from 'services/helper'
const IconButton = React.lazy(() => import('@material-ui/core/IconButton'))

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      margin: '0 auto',
      backgroundColor: 'transparent',
      width: 630,
      height: '100%',
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
  imageModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    
    '& img': {
      maxHeight: '80%',
      maxWidth: '100%',
      borderRadius: 15,
    },
    '& video': {
      maxHeight: '80%',
      maxWidth: '100%',
      borderRadius: 15,
    },
  },
  closeImageButton: {
    marginTop: '-20px !important',
    color: '#ffffff !important',
    backgroundColor: '#E61C34 !important',
    fontSize: '2em !important',
  },
}))

const ViewImageModal = (props) => {
  const classes = useStyles()
  const { show, onHide, imageUrl } = props

  return (
    <React.Fragment>
      <Modal
        backdrop="static"
        keyboard={false}
        show={show ? true : false}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={true}
      >
        <ModalBody>
          <div className={classes.imageModal}>
            {imageUrl ? !imageUrl.includes('?dbuzz_video=') ? <img src={proxyImage(imageUrl)} alt='modal_image' loading='lazy'/> : <video src={imageUrl.split('?dbuzz_video=')[1]} controls/> : null}
            <IconButton className={classes.closeImageButton} onClick={() => onHide('')}>
              <CloseIcon />
            </IconButton>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default ViewImageModal