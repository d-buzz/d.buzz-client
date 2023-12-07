import React, {useState, useEffect, useRef} from 'react'
import {createUseStyles} from 'react-jss'
import {CloseIcon, ContainedButton, Avatar, TextField, AddImageIcon} from 'components/elements'
import {uploadFileRequest} from 'store/posts/actions'
import {updateProfileRequest} from "store/profile/actions"
import {broadcastNotification} from "store/interface/actions"
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Navbar,
} from 'react-bootstrap'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {isMobile} from 'react-device-detect'
import CircularProgress from '@material-ui/core/CircularProgress'
import {pending} from 'redux-saga-thunk'
import {setBasicProfile} from 'services/ceramic'
import Spinner from 'components/elements/progress/Spinner'
import heic2any from 'heic2any'
import IconButton from '@material-ui/core/IconButton'
import ImageCropper from "../../common/ImageCropper"

const useStyles = createUseStyles(theme => ({
  modal: {
    width: 600,
    '& div.modal-content': {
      margin: '0 auto',
      backgroundColor: theme.background.primary,
      width: 600,
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
    paddingLeft: 0,
    paddingRight: 0,
  },
  cover: {
    height: 200,
    width: '100%',
    backgroundColor: '#ffebee',
    overflow: 'hidden',
    maxHeight: 200,
    position: 'relative',
    '@media (max-width: 900px)': {
      height: 160,
    },
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      justifyContent: 'center',
      opacity: "0.50",
      display: "block",
    },
  },
  navTitle: {
    fontFamily: 'Roboto, sans-serif',
    display: 'inline-block',
    verticalAlign: 'top',
    marginTop: -10,
  },
  avatar: {
    marginTop: -70,
  },
  title: {
    display: 'inline-block',
    marginLeft: 5,
    fontFamily: 'Segoe-Bold',
    fontSize: 18,
    color: theme.font.color,
  },
  saveButton: {
    float: 'right',
    fontFamily: 'Segoe-Bold',
  },
  wrapper: {
    width: '95%',
    margin: '0 auto',
    height: 'max-content',
  },
  inline: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  spacer: {
    width: '100%',
    height: 20,
  },
  addCoverImageButton: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    marginTop: -120,
    '@media (max-width: 900px)': {
      marginTop: -105,
    },
  },
  addProfileImageButton: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    marginTop: -80,
    marginLeft: -15,
  },
  loadingLabel: {
    width: '100%',
    color: theme.font.color,
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#e53935 !important',
  },
  textarea: {
    '& #about': {
      marginTop: "10px",
    },
  },
  aboutTextLimit: {
    color: theme.font.color,
    position: 'absolute',
    top: 3,
    right: 10,
  },
}))

const EditProfileModal = (props) => {
  const classes = useStyles()
  const {
    show,
    onHide,
    profile,
    user,
    loading,
    uploadFileRequest,
    updateProfileRequest,
    broadcastNotification,
    setUpdatedCover,
    setUpdatedProfile,
  } = props
  const {username} = user
  const {metadata, posting_json_metadata} = profile || ''
  const {profile: profileMeta} = metadata || ''
  const {profile: postingProfileMeta} = posting_json_metadata || ''
  const [profileName, setProfileName] = useState('')
  const [profileCoverImage, setProfileCoverImage] = useState('')
  const [profileAbout, setProfileAbout] = useState('')
  const [profileWebsite, setProfileWebsite] = useState('')
  const [profileLocation, setProfileLocation] = useState('')
  const [profileAvatar, setProfileAvatar] = useState('')
  const coverInputRef = useRef(null)
  const profilePicInputRef = useRef(null)

  const [uploadAvatarLoading, setUploadAvatarLoading] = useState(false)
  const [uploadCoverLoading, setUploadCoverLoading] = useState(false)
  const [ceramicUser, setCeramicUser] = useState(null)
  const [ceramicProfile, setCeramicProfile] = useState({})

  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [ceramicProfileUpdateLoading, setCeramicProfileUpdateLoading] = useState(false)

  const [updatingProfile, setUpdatingProfile] = useState(false)

  const [isCoverUpdated, setIsCoverUpdated] = useState(false)
  const [isProfileUpdated, setIsProfileUpdated] = useState(false)


  const [isCropperOpen, setIsCropperOpen] = useState(false)


  useEffect(() => {
    if (profile.ceramic) {
      setCeramicUser(true)
      setCeramicProfile(profile.basic_profile)
    } else {
      setCeramicUser(false)
    }
  }, [profile])

  useEffect(() => {
    const {
      cover_image,
      profile_image,
      website,
      about,
      location,
    } = profileMeta || ''

    const {name} = postingProfileMeta || '' // get fullname from get_accounts api
    setProfileName(name || ceramicProfile.name)
    setProfileAbout(about || ceramicProfile.description)
    setProfileWebsite(website || ceramicProfile.url)
    setProfileLocation(location || ceramicProfile.location)
    if (cover_image || ceramicProfile.images?.background) setProfileCoverImage(cover_image || `https://ipfs.io/ipfs/${ceramicProfile.images.background.replace('ipfs://', '')}`)
    if (profile_image || ceramicProfile.images?.avatar) setProfileAvatar(profile_image || `https://ipfs.io/ipfs/${ceramicProfile.images.avatar.replace('ipfs://', '')}`)
    // eslint-disable-next-line
  }, [profileMeta, postingProfileMeta, show, username, ceramicProfile])

  const onChange = (e) => {
    const {target} = e
    const {id, value} = target
    if (id === "name") {
      setProfileName(value)
    } else if (id === "about" && value.length <= 160) {
      setProfileAbout(value)
    } else if (id === "location") {
      setProfileLocation(value)
    } else if (id === "website") {
      setProfileWebsite(value)
    }
  }

  const handleImageCompression = async (image) => {
    let compressedFile = null

    const MAX_SIZE = 500 * 1024

    const options = {
      maxSizeMB: MAX_SIZE / (1024 * 1024),
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    }
    try {
      await import('browser-image-compression').then(async ({default: imageCompression}) => {
        compressedFile = await imageCompression(image, options)
      })
    } catch (error) {
      console.log(error)
    }

    return compressedFile !== null && compressedFile
  }
  // Utility Functions

  const base64ToBlob = (base64Data, contentType = '') => {
    const byteCharacters = atob(base64Data.split(',')[1])
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512)
      const byteNumbers = new Array(slice.length)

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, {type: contentType})
  }

  const handleError = (error) => {
    console.error("Error uploading the image:", error)
    broadcastNotification('error', 'Something went wrong upon uploading image. Please try again later.')
    setUploadAvatarLoading(false)
    setImageUploadProgress(0)
  }

  const handleInputType = (input, username, type = 'profile') => {
    let originalFiles = []

    if (input instanceof Blob) {
      const croppedImageFile = new File([input], `${username}-${type}-image.png`, {type: "image/png"})
      originalFiles = [croppedImageFile]
    } else if (typeof input === 'string' && input.startsWith('data:image/')) {
      const blob = base64ToBlob(input, 'image/png')
      const croppedImageFile = new File([blob], `${username}-${type}-image.png`, {type: "image/png"})
      originalFiles = [croppedImageFile]
    } else if (input instanceof Event && input.target && input.target.files) {
      originalFiles = Array.from(input.target.files)
    } else {
      console.warn("Invalid input")
      return null
    }

    return originalFiles
  }


  const handleChangeProfileImage = async (input, username) => {
    const originalFiles = handleInputType(input, username)
    if (!originalFiles) return

    const allImages = [...originalFiles.filter(image => image.type !== 'image/heic')]
    const heicImages = originalFiles.filter(image => image.type === 'image/heic')

    await Promise.all(
      heicImages.map(async (image) => {
        const pngBlob = await heic2any({
          blob: image,
          toType: 'image/png',
          quality: 1,
        })
        allImages.push(
          new File([pngBlob], image.name.replace('.heic', '.png'), {type: 'image/png', size: pngBlob.size}),
        )
      }),
    )

    setProfileAvatar(URL.createObjectURL(allImages[0]))

    if (allImages[0]) {
      setUploadAvatarLoading(true)
      try {
        const compressedImage = await handleImageCompression(allImages[0])
        const image = await uploadFileRequest(compressedImage, setImageUploadProgress, false)
        setIsProfileUpdated(true)
        setUploadAvatarLoading(false)
        const lastImage = image[image.length - 1]
        if (lastImage !== undefined) {
          setProfileAvatar(lastImage)
          setImageUploadProgress(0)
          setUploadAvatarLoading(false)
        } else {
          handleError(new Error("Image upload error"))
        }
      } catch (error) {
        handleError(error)
      }
    }
  }

  const handleChangeCoverImage = async (input, username) => {
    const originalFiles = handleInputType(input, username, 'cover')
    if (!originalFiles) return

    const allImages = originalFiles.filter(image => image.type !== 'image/heic')
    const heicImages = originalFiles.filter(image => image.type === 'image/heic')

    await Promise.all(
      heicImages.map(async (image) => {
        const pngBlob = await heic2any({
          blob: image,
          toType: 'image/png',
          quality: 1,
        })
        allImages.push(
          new File([pngBlob], image.name.replace('.heic', '.png'), {type: 'image/png', size: pngBlob.size}),
        )
      }),
    )

    setProfileCoverImage(URL.createObjectURL(allImages[0]))

    if (allImages[0]) {
      setUploadCoverLoading(true)
      try {
        const compressedImage = await handleImageCompression(allImages[0])
        const image = await uploadFileRequest(compressedImage, setImageUploadProgress, false)
        setIsCoverUpdated(true)
        setUploadCoverLoading(false)
        const lastImage = image[image.length - 1]
        if (lastImage !== undefined) {
          setProfileCoverImage(lastImage)
          setImageUploadProgress(0)
          setUploadCoverLoading(false)
        } else {
          handleError(new Error("Image upload error"))
        }
      } catch (error) {
        handleError(error)
      }
    }
  }


  const handleImageChange = (e, imageType) => {
    setCurrentImageType(imageType)
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target.result)
        setIsCropperOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }


  const handleCropComplete = (croppedImage, username) => {
    switch (currentImageType) {
    case 'avatar':
      handleChangeProfileImage(croppedImage, username)  // Set the cropped image as the new profile image
      break
    case 'cover':
      handleChangeCoverImage(croppedImage, username)
      break
    default:
      console.warn(`Unexpected image type: ${currentImageType}`)
    }
    setCurrentImageType(null) // Reset the image type after handling the cropped image
    setIsCropperOpen(false) // Close the cropper
  }


  const [selectedImage, setSelectedImage] = useState(null) // Image URL or Base64 string
  const [currentImageType, setCurrentImageType] = useState(null) // 'avatar' or 'cover'

  // This can be called when you want to open the cropper with a specific image
  // const handleChangeCoverImage = (e) => {
  //   const images = Array.from(e.target.files)
  //   const allImages = [...images.filter(image => image.type !== 'image/heic')]
  //   const heicImages = images.filter(image => image.type === 'image/heic')
  //
  //   Promise.all(
  //     heicImages.map(async (image) => {
  //
  //       const pngBlob = await heic2any({
  //         blob: image,
  //         toType: 'image/png',
  //         quality: 1,
  //       })
  //
  //       allImages.push(
  //         new File([pngBlob], image.name.replace('.heic', ''), {type: 'image/png', size: pngBlob.size}),
  //       )
  //     }),
  //   )
  //     .then(() => {
  //       setProfileCoverImage(URL.createObjectURL(allImages[0]))
  //       if (allImages[0]) {
  //         setUploadCoverLoading(true)
  //         handleImageCompression(allImages[0]).then((compressedImage) => {
  //           uploadFileRequest(compressedImage, setImageUploadProgress, false).then((image) => {
  //             setIsCoverUpdated(true)
  //             setUploadCoverLoading(false)
  //             const lastImage = image[image.length - 1]
  //             if (lastImage !== undefined) {
  //               setProfileCoverImage(lastImage)
  //               setImageUploadProgress(0)
  //               setUploadCoverLoading(false)
  //             } else {
  //               setUploadCoverLoading(false)
  //               broadcastNotification('error', 'Something went wrong upon uploading image. Please try again later.')
  //               setImageUploadProgress(0)
  //             }
  //           })
  //         })
  //       }
  //     })
  // }


  const handleRemoveCoverImage = () => {
    setProfileCoverImage('')
  }

  const handleSelectProfileImage = () => {
    const target = document.getElementById('avatar-upload')
    if (isMobile) {
      target.addEventListener('click', function () {
        const touch = new Touch({
          identifier: 'avatar-upload',
          target: target,
        })

        const touchEvent = new TouchEvent("touchstart", {
          touches: [touch],
          view: window,
          cancelable: true,
          bubbles: true,
        })
        target.dispatchEvent(touchEvent)
      })
    }
    target.click()
  }

  const handleSelectCoverImage = () => {
    const target = document.getElementById('cover-upload')
    if (isMobile) {
      target.addEventListener('click', function () {
        const touch = new Touch({
          identifier: 'cover-upload',
          target: target,
        })

        const touchEvent = new TouchEvent("touchstart", {
          touches: [touch],
          view: window,
          cancelable: true,
          bubbles: true,
        })
        target.dispatchEvent(touchEvent)
      })
    }
    target.click()
  }

  const handleSubmitForm = () => {
    setUpdatingProfile(true)
    const hiveMetaData = {
      profile: {
        profile_image: profileAvatar ? profileAvatar : profileMeta?.profile_image,
        cover_image: profileCoverImage,
        name: profileName,
        about: profileAbout,
        location: profileLocation,
        website: profileWebsite,
        version: 2,  // signal upgrade to posting_json_metadata
      },
    }
    const ceramicMetaData = {
      profile_image: profileAvatar ? profileAvatar : '',
      cover_image: profileCoverImage ? profileCoverImage : '',
      name: profileName,
      about: profileAbout,
      location: profileLocation,
      url: profileWebsite,
    }

    if (!ceramicUser) {
      updateProfileRequest(username, hiveMetaData).then(({success, errorMessage}) => {
        if (success) {
          if (isCoverUpdated || isProfileUpdated) {
            if (isCoverUpdated) {
              setUpdatedCover(hiveMetaData.profile.cover_image)
            } else {
              setUpdatedProfile(hiveMetaData.profile.profile_image)
            }
          }

          broadcastNotification('success', 'Profile updated successfully')
          setUpdatingProfile(false)
          onHide()
        } else {
          setUpdatingProfile(false)
          broadcastNotification('error', errorMessage)
        }
      })
    } else {
      setCeramicProfileUpdateLoading(true)
      setBasicProfile(ceramicMetaData)
        .then((res) => {
          setCeramicProfileUpdateLoading(false)
          broadcastNotification('success', 'Profile updated successfully')
          setUpdatingProfile(false)
          onHide()
        })
        .catch((err) => {
          setUpdatingProfile(false)
          setCeramicProfileUpdateLoading(false)
          broadcastNotification('error', err.message)
          console.log(err)
          onHide()
        })
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
          <Navbar.Brand className={classes.navTitle}>
            <IconButton style={{marginLeft: 5}} onClick={onHide}>
              <CloseIcon/>
            </IconButton>
            <span className={classes.title}>Edit profile</span>
          </Navbar.Brand>
          <React.Fragment>
            <div style={{padding: 5}}>
              <div className={classes.cover}>
                <React.Fragment>
                  <img src={profileCoverImage} alt="" loading="lazy"/>
                  <div className={classes.addCoverImageButton}>
                    <input
                      id="cover-upload"
                      type="file"
                      name="image"
                      accept="image/*,image/heic"
                      multiple={false}
                      ref={coverInputRef}
                      onChange={(e) => handleImageChange(e, 'cover')}
                      style={{display: 'none'}}
                    />
                    {/* react-cropper for profile image */}
                    <ImageCropper
                      isOpen={isCropperOpen}
                      onClose={() => setIsCropperOpen(false)}
                      src={selectedImage}
                      username={username}
                      onCropComplete={handleCropComplete}
                    />
                    <label htmlFor="cover-upload">
                      {!uploadCoverLoading &&
                        (<IconButton className={classes.uploadButton} onClick={handleSelectCoverImage}>
                          <AddImageIcon size="20"/>
                        </IconButton>)}
                    </label>
                    {profileCoverImage && !uploadCoverLoading &&
                      (<IconButton onClick={handleRemoveCoverImage}>
                        <CloseIcon/>
                      </IconButton>)}
                    {uploadCoverLoading &&
                      (<CircularProgress variant="static" value={imageUploadProgress} size={25} color="secondary"/>)}
                  </div>
                </React.Fragment>
              </div>

            </div>
            <div className={classes.wrapper}>
              <Row>
                <Col xs="auto">
                  <div className={classes.avatar}>
                    <Avatar style={{opacity: 0.5}} border={true} height="120" author={username} size="medium"
                      avatarUrl={profileAvatar}/>
                    <div className={classes.addProfileImageButton}>
                      <input
                        id="avatar-upload"
                        type="file"
                        name="image"
                        accept="image/*,image/heic"
                        multiple={false}
                        ref={profilePicInputRef}
                        onChange={(e) => handleImageChange(e, 'avatar')}
                        style={{display: 'none'}}
                      />
                      <label htmlFor="avatar-upload">
                        {!uploadAvatarLoading &&
                          (<IconButton className={classes.uploadButton} onClick={handleSelectProfileImage}>
                            <AddImageIcon size="20"/>
                          </IconButton>)}
                      </label>
                      {uploadAvatarLoading &&
                        (<CircularProgress variant="static" value={imageUploadProgress} size={25} color="secondary"/>)}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div style={{width: '100%', height: 'max-content', marginTop: '20px'}}>
              <div className={classes.wrapper}>
                <Row>
                  <Col>
                    <TextField
                      id="name"
                      label="Name"
                      value={profileName}
                      rowsMax={4}
                      onChange={onChange}
                      multiline
                      fullWidth/>
                  </Col>
                </Row>
                <div className={classes.spacer}/>
                <Row>
                  <Col>
                    <div style={{position: 'relative'}}>
                      <span className={classes.aboutTextLimit}>{(profileAbout ?? '').length}/160</span>
                      <TextField
                        id="about"
                        label="Bio"
                        value={profileAbout}
                        className={classes.textarea}
                        rowsMax={4}
                        onChange={onChange}
                        multiline
                        fullWidth/>
                    </div>
                  </Col>
                </Row>
                <div className={classes.spacer}/>
                <Row>
                  <Col>
                    <TextField
                      id="location"
                      label="Location"
                      value={profileLocation}
                      rowsMax={4}
                      onChange={onChange}
                      multiline
                      fullWidth/>
                  </Col>
                </Row>
                <div className={classes.spacer}/>
                <Row>
                  <Col>
                    <TextField
                      id="website"
                      label="Website"
                      value={profileWebsite || ceramicProfile.website}
                      rowsMax={4}
                      onChange={onChange}
                      multiline
                      fullWidth/>
                  </Col>
                </Row>
                <div className={classes.spacer}/>
                <Row>
                  <Col>
                    {!updatingProfile &&
                      <div style={{width: '100%'}}>
                        <ContainedButton
                          fontSize={14}
                          style={{float: 'right'}}
                          transparent={false}
                          onClick={handleSubmitForm}
                          label="Save"
                          disabled={loading || ceramicProfileUpdateLoading || uploadCoverLoading || uploadAvatarLoading}
                          className={classes.saveButton}
                        />
                      </div>}
                    {updatingProfile &&
                      <div style={{width: '100%', display: 'grid', placeItems: 'center'}}>
                        <span className={classes.loadingLabel}>UPDATING PROFILE</span>
                        <Spinner loading={updatingProfile} size={30} top={15} style={{padding: 15}}/>
                      </div>}
                  </Col>
                </Row>
              </div>
            </div>
          </React.Fragment>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  profile: state.profile.get('profile'),
  user: state.auth.get('user'),
  loading: pending(state, 'UPDATE_PROFILE_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    uploadFileRequest,
    updateProfileRequest,
    broadcastNotification,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileModal)
