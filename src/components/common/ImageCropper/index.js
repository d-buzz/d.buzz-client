import React, { useState, useRef } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'  // Import cropper styles
import { Modal, Button } from 'react-bootstrap'

const ImageCropper = ({ isOpen, onClose, src, onCropComplete }) => {
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
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crop your image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Cropper
          ref={cropperRef}
          src={src}
          style={{ height: 400, width: "100%" }}
          aspectRatio={1}
          guides={false}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={getCropData}>Crop Image</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImageCropper
