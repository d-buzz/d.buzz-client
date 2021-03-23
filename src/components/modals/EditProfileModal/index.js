import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import IconButton from '@material-ui/core/IconButton'
import { CloseIcon, ContainedButton, Avatar, TextField, AddImageIcon } from 'components/elements'
import { uploadFileRequest } from 'store/posts/actions'
import { updateProfileRequest } from "store/profile/actions"
import { 
  Modal,
  ModalBody,
  Row,
  Col,
  Navbar,
} from 'react-bootstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isMobile } from 'react-device-detect'
import { CircularProgress } from '@material-ui/core'
import { pending } from 'redux-saga-thunk'

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
    ...theme.navbar.icon,
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
  } = props
  const { username } = user
  const { metadata } = profile || ''
  const { profile: profileMeta } = metadata || ''
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
  

  useEffect(() => {
    const { 
      name, 
      cover_image, 
      website, 
      about, 
      location,
    } = profileMeta || ''

    setProfileName(name)
    setProfileAbout(about)
    setProfileWebsite(website)
    setProfileLocation(location)
    if(cover_image){
      setProfileCoverImage(`https://images.hive.blog/0x0/${cover_image}`)
    }
  // eslint-disable-next-line
  }, [profileMeta, show])

  const onChange = (e) => {
    const { target } = e
    const { id, value } = target
    if (id === "name") {
      setProfileName(value)
    }else if (id === "about") {
      setProfileAbout(value)
    }else if (id === "location") {
      setProfileLocation(value)
    }else if (id === "website") {
      setProfileWebsite(value)
    }
  }

  const handleChangeProfileImage = (e) => {
    const files = e.target.files[0]
    if(files){
      setUploadAvatarLoading(true)
      uploadFileRequest(files).then((image) => {
        setUploadAvatarLoading(false)
        const lastImage = image[image.length - 1]
        if (lastImage !== undefined) {
          setProfileAvatar(lastImage)
        }
      })
    }
  }

  const handleChangeCoverImage = (e) => {
    const files = e.target.files[0]
    if(files){
      setUploadCoverLoading(true)
      uploadFileRequest(files).then((image) => {
        setUploadCoverLoading(false)
        const lastImage = image[image.length - 1]
        if (lastImage !== undefined) {
          setProfileCoverImage(lastImage)
        }
      })
    }
  }

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
    const { 
      profile_image, 
    } = profileMeta

    const metadata = {
      profile: {
        profile_image: profileAvatar ? profileAvatar : profile_image,
        cover_image: profileCoverImage,
        name: profileName,
        about: profileAbout,
        location: profileLocation,
        website: profileWebsite,
      },
    }
    console.log({old: profileMeta, new: metadata}) 

    // updateProfileRequest(username,metadata).then((response) => {
    //   console.log(response)
    // })
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
            <IconButton style={{ marginLeft: 5 }} onClick={onHide}>
              <CloseIcon />
            </IconButton>
            <span className={classes.title}>Edit profile</span>
          </Navbar.Brand>
          <React.Fragment>
            <div style={{ padding: 5}}>
              <div className={classes.cover}>
                <React.Fragment>
                  <img src={profileCoverImage} alt=""/>
                  <div className={classes.addCoverImageButton}>
                    <input
                      id="cover-upload"
                      type='file'
                      name='image'
                      accept='image/*'
                      multiple={false}
                      ref={coverInputRef}
                      onChange={handleChangeCoverImage}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="cover-upload">
                      {!uploadCoverLoading &&
                      (<IconButton onClick={handleSelectCoverImage}>
                        <AddImageIcon size="20"/>
                      </IconButton>)}
                    </label>
                    {profileCoverImage && !uploadCoverLoading &&
                        (<IconButton onClick={handleRemoveCoverImage}>
                          <CloseIcon />
                        </IconButton>)}
                    {uploadCoverLoading && 
                      (<CircularProgress size={25} color="secondary"/>)}
                  </div>
                </React.Fragment>
              </div>
              
            </div>
            <div className={classes.wrapper}>
              <Row>
                <Col xs="auto">
                  <div className={classes.avatar}>
                    <Avatar border={true} height="120" author={username} size="medium" avatarUrl={profileAvatar}/>
                    <div className={classes.addProfileImageButton}>
                      <input
                        id="avatar-upload"
                        type='file'
                        name='image'
                        accept='image/*'
                        multiple={false}
                        ref={profilePicInputRef}
                        onChange={handleChangeProfileImage}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="avatar-upload">
                        {!uploadAvatarLoading &&
                        (<IconButton onClick={handleSelectProfileImage}>
                          <AddImageIcon size="20"/>
                        </IconButton>)}
                      </label>
                      {uploadAvatarLoading && 
                        (<CircularProgress size={25} color="secondary"/>)}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div style={{ width: '100%', height: 'max-content', marginTop: '20px'}}>
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
                <div className={classes.spacer} />
                <Row>
                  <Col>
                    <TextField 
                      id="about"
                      label="Bio" 
                      value={profileAbout}
                      rowsMax={4}
                      onChange={onChange}
                      multiline 
                      fullWidth/>
                  </Col>
                </Row>
                <div className={classes.spacer} />
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
                <div className={classes.spacer} />
                <Row>
                  <Col>
                    <TextField 
                      id="website"
                      label="Website" 
                      value={profileWebsite}
                      rowsMax={4}
                      onChange={onChange}
                      multiline 
                      fullWidth/>
                  </Col>
                </Row>
                <div className={classes.spacer} />
                <Row>
                  <Col>
                    <div style={{ width: '100%'}}>
                      <ContainedButton
                        fontSize={14}
                        style={{ float: 'right' }}
                        transparent={false}
                        onClick={handleSubmitForm}
                        label="Save"
                        loading={loading}
                        disabled={loading}
                        className={classes.saveButton}
                      />
                    </div>
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
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileModal)