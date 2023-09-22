import React, { useState, useRef } from 'react'
import {createUseStyles} from 'react-jss'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'  // Import cropper styles
import { Modal, Button } from 'react-bootstrap'
import classNames from 'classnames'

const useStyles = createUseStyles(theme => ({
  modal: {
    width: 600,
    '& div.modal-content': {
      margin: '0 auto',
      backgroundColor: theme.background.primary,
      width: 600,
      borderRadius: '20px 20px !important',
      border: 'none',
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
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
    paddingLeft: 0,
    paddingRight: 0,
  },
  modalTitle: {
    color: theme.font.color,
  },
  button: {
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
    outline: 'none !important',
    border: 'none !important',
    boxShadow: 'none !important',
  },
  doneButton: {
    background: '#E61C34',
    color: '#ffffff',

    '&:hover': {
      background: '#B71C1C',
    },

    '&:active': {
      background: '#B71C1C !important',
    },
  },
  cancelButton: {
    background: '#F5F8FA',
    marginRight: 8,
    color: '#000000 !important',
    
    '&:hover': {
      background: '#EDF0F2',
    },
    
    '&:active': {
      background: '#EDF0F2 !important',
    },

    '&:disabled': {
      '&:hover': {
        background: '#F5F8FA',
      },
    },
  },
}))

const ImageCropper = ({ isOpen, onClose, src, onCropComplete }) => {
  const classes = useStyles()
  const [cropData, setCropData] = useState("#")
  const cropperRef = useRef(null)

  const getCropData = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const cropper = cropperRef.current.cropper
      const croppedImage = cropper.getCroppedCanvas().toDataURL()
      setCropData(croppedImage)
      if (onCropComplete) {
        onCropComplete(croppedImage)
      }
      console.log(cropData)
    } else {
      console.error("Cropper instance is not available yet.")
    }
  }


  return (
    <Modal show={isOpen} onHide={onClose} dialogClassName={classes.modal}>
      <Modal.Header>
        <Modal.Title className={classes.modalTitle}>Crop profile image</Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes.modalBody}>
        <Cropper
          ref={cropperRef}
          src={src}
          style={{ height: 400, width: "100%" }}
          aspectRatio={1}
          guides={false}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} className={classNames(classes.button, classes.cancelButton)}>Close</Button>
        <Button variant="primary" onClick={getCropData} className={classNames(classes.button, classes.doneButton)}>Crop Image</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImageCropper
