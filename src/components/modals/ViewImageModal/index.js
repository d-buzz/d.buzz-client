import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { createUseStyles } from 'react-jss'
import CloseIcon from '@material-ui/icons/Close'
import { proxyImage } from 'services/helper'
import NextImageIcon from 'components/elements/Icons/NextImageIcon'
import PrevImageIcon from 'components/elements/Icons/PrevImageIcon'
const IconButton = React.lazy(() => import('@material-ui/core/IconButton'))

const useStyles = createUseStyles(theme => ({
  modal: {
    margin: '0 !important',
    width: '100% !important',
    maxWidth: '100% !important',
    '& div.modal-content': {
      backgroundColor: 'transparent',
      backdropFilter: 'blur(5px)',
      height: '100%',
      width: '100%',
      borderRadius: '20px 20px !important',
      border: 'none',
    },
  },
  imageModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  prevImageButton: {
    marginRight: '15px !important',
    marginTop: '-20px !important',
    color: '#ffffff !important',
    backgroundColor: '#E61C34 !important',
    fontSize: '2em !important',
  },
  closeImageButton: {
    marginTop: '-20px !important',
    color: '#ffffff !important',
    backgroundColor: '#E61C34 !important',
    fontSize: '2em !important',
  },
  nextImageButton: {
    marginLeft: '15px !important',
    marginTop: '-20px !important',
    color: '#ffffff !important',
    backgroundColor: '#E61C34 !important',
    fontSize: '2em !important',
  },
}))

const ViewImageModal = (props) => {
  const classes = useStyles()
  const { show, onHide, value } = props

  const [activeImage, setActiveImage] = useState(null)
  const [images, setImages] = useState(null)

  useEffect(() => {
    if(value) {
      setActiveImage(value.selectedImage)
      setImages(value.images)
    }
  }, [value])


  const handleNextImage = () => {
    const activeIndex = images.indexOf(activeImage)
    const nextImage = images[activeIndex+1]

    setActiveImage(nextImage)
  }
  
  const handlePrevImage = () => {
    const activeIndex = images.indexOf(activeImage)
    const prevImage = images[activeIndex-1]
  
    setActiveImage(prevImage)
  }

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
            {activeImage ? !activeImage.includes('?dbuzz_video=') ? <img src={proxyImage(activeImage)} alt='modal_image' loading='lazy'/> : <video src={value.selectedImage.split('?dbuzz_video=')[1]} controls/> : null}
            {activeImage &&
              <div style={{ display: 'flex' }}>
                {value.images.length>1 && !(activeImage===value.images[0]) &&
                  <IconButton className={classes.prevImageButton} onClick={() => handlePrevImage()}>
                    <PrevImageIcon />
                  </IconButton>}
                <IconButton className={classes.closeImageButton} onClick={() => onHide('')}>
                  <CloseIcon />
                </IconButton>
                {value.images.length>1 && !(activeImage===value.images[value.images.length-1]) &&
                  <IconButton className={classes.nextImageButton} onClick={() => handleNextImage()}>
                    <NextImageIcon />
                  </IconButton>}
              </div>}
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default ViewImageModal