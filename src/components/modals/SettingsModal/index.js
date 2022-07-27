import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import config from 'config'
import { checkVersionRequest } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserCustomData, updateUserCustomData } from 'services/database/api'
import { CircularProgress } from '@material-ui/core'

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 550,
      minWidth: 100,
      margin: '0 auto',
      '& h6': {
        ...theme.font,
      },
    },
    '& input.form-control': {
      borderRadius: '50px 50px',
      fontSize: 14,
    },
    '& label': {
      fontSize: 14,
    },
    '@media (max-width: 900px)': {
      width: '97% !important',
      '& div.modal-content': {
        margin: '0 auto',
        width: '97% !important',
      },
    },
  },
  button: {
    width: '100%',
    height: 60,
    marginBottom: 15,
    borderRadius: '5px 5px',
    cursor: 'pointer',
    lineHeight: 0.8,
    border: `3px solid ${theme.background.primary}`,
    '& :first-child': {
      paddingTop: 5,
    },
    '& label': {
      cursor: 'pointer',
    },
    '&:hover': {
      border: '3px solid #e61c34',
    },
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    '& .items': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',

      '& .item': {
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
        background: theme.context.view.backgroundColor,
        borderRadius: 8,
        margin: '5px 0',

        '& .toggle_container': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        },

        '& .title': {
          fontSize: '1.2em',
          fontWeight: '600',
          color: theme.font.color,
        },

        '& .toggle': {
          display: 'grid',
          placeItems: 'center',
          padding: '5px 15px',
          fontSize: '1.2em',
          fontWeight: '600',
          background: '#E61C34',
          color: '#ffffff',
          borderRadius: 25,
          userSelect: 'none',
          cursor: 'pointer',
          minWidth: 100,

          '&:hover': {
            background: '#B71C1C',
          },
        },

        '& .description': {
          width: '60%',
          color: theme.font.color,
          fontSize: '0.8em',
        },
      },
    },
  },
  versionContainer: {
    borderTop: '1px solid lightgray',
    padding: 15,
    marginTop: 15,
    display: 'flex',
    flexDirection: 'column',

    '& .current_version': {
      fontSize: '1.2em',
      color: '#E61C34',
      fontWeight: 500,
    },
    '& .check_updates_button, .updates_avaialble': {
      marginTop: 8,
      marginBottom: 15,
      width: '100%',
      padding: '8px 0',
      color: '#ffffff',
      fontSize: '1.35em',
      fontWeight: 'bold',
      borderRadius: 5,
      background: '#E61C34',
      userSelect: 'none',
      cursor: 'pointer',

      '&:hover': {
        background: '#B71C1C',
      },
    },

    '& .up_to_date_button': {
      marginTop: 8,
      marginBottom: 15,
      width: '100%',
      padding: '8px 0',
      color: '#ffffff',
      fontSize: '1.35em',
      fontWeight: 'bold',
      borderRadius: 5,
      background: '#E61C34',
      userSelect: 'none',
    },

    '& .check_again_text': {
      fontWeight: 500,
      fontSize: '0.95em',
      color: theme.font.color,
    },
  },
  loading: {
    display: 'grid',
    placeItems: 'center',
    height: '100%',
    width: '100%',
    padding: '5px 0',
  },
}))

const SettingsModal = (props) => {
  const {
    show,
    onHide,
    checkVersionRequest,
    user,
  } = props
  const classes = useStyles()

  const { VERSION } = config

  const [videoEmbedsStatus, setVideoEmbedsStatus] = useState(JSON.parse(localStorage.getItem('customUserData'))?.settings.videoEmbedsStatus)
  const [linkPreviewsStatus, setLinkPreviewsStatus] = useState(JSON.parse(localStorage.getItem('customUserData'))?.settings.linkPreviewsStatus)
  const [showImagesStatus, setShowImagesStatus] = useState(JSON.parse(localStorage.getItem('customUserData'))?.settings.showImagesStatus)
  const [isLatest, setIsLatest] = useState(null)
  const [updatesAvailable, setUpdatesAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  // eslint-disable-next-line
  const [customUserData, setCustomUserData] = useState(JSON.parse(localStorage.getItem('customUserData')))

  useEffect(() => {
    setVideoEmbedsStatus(JSON.parse(localStorage.getItem('customUserData'))?.settings?.videoEmbedsStatus)
    setLinkPreviewsStatus(JSON.parse(localStorage.getItem('customUserData'))?.settings?.linkPreviewsStatus)
    setShowImagesStatus(JSON.parse(localStorage.getItem('customUserData'))?.settings?.showImagesStatus)  
  }, [show])

  useEffect(() => {
    const data = {
      ...customUserData,
      settings: {...customUserData?.settings, videoEmbedsStatus, linkPreviewsStatus, showImagesStatus},
    }
    // set the local storage variables
    if(customUserData?.settings) {
      localStorage.setItem('customUserData', JSON.stringify({...data}))
    }
    // eslint-disable-next-line
  }, [videoEmbedsStatus,linkPreviewsStatus,showImagesStatus])

  const handleDisableEnableToggles = (bool) => {
    if(!bool) {
      for (let t=0; t<=document.querySelectorAll('.toggle').length - 1; t++) {
        document.querySelectorAll('.toggle')[t].style.pointerEvents = 'none'
      }
    } else {
      for (let t=0; t<=document.querySelectorAll('.toggle').length - 1; t++) {
        document.querySelectorAll('.toggle')[t].style.pointerEvents = 'all'
      }
    }
  }

  const handleUpdateSettings = () => {
    setLoading(true)
    const { username } = user
    getUserCustomData(username).then(res => {
      const userData = {...res[0], settings: {
        ...res[0].settings,
        videoEmbedsStatus: JSON.parse(localStorage.getItem('customUserData'))?.settings?.videoEmbedsStatus,
        linkPreviewsStatus: JSON.parse(localStorage.getItem('customUserData'))?.settings?.linkPreviewsStatus,
        showImagesStatus: JSON.parse(localStorage.getItem('customUserData'))?.settings?.showImagesStatus,
      }}
      const responseData = { username: username, userData: [userData] }
      if(res) {
        updateUserCustomData(responseData).then(() => {
          // alert('datbase updated')
          setSelectedItem(null)
          setLoading(false)
          handleDisableEnableToggles(true)
        })
      }
    })
  }

  const handleVideoEmbedsToggle = () => {
    handleDisableEnableToggles(false)
    setSelectedItem('videoEmbedsToggle')
    if(videoEmbedsStatus === 'enabled'){
      setVideoEmbedsStatus('disabled')
    } else {
      setVideoEmbedsStatus('enabled')
    }
    handleUpdateSettings()
  }
  
  const handleLinkPreviewToggle = () => {
    handleDisableEnableToggles(false)
    setSelectedItem('linkPreviewToggle')
    if(linkPreviewsStatus === 'enabled'){
      setLinkPreviewsStatus('disabled')
    } else {
      setLinkPreviewsStatus('enabled')
    }
    handleUpdateSettings()
  }
  
  const handleShowImagesToggle = () => {
    handleDisableEnableToggles(false)
    setSelectedItem('showImagesToggle')
    if(showImagesStatus === 'enabled'){
      setShowImagesStatus('disabled')
    } else {
      setShowImagesStatus('enabled')
    }
    handleUpdateSettings()
  }

  const reload = () => {
    dismiss()
    
    // reset updates modal
    localStorage.removeItem('updatesModal')

    caches.keys().then((names) => {
      // Delete all the cache files
      names.forEach(name => {
        caches.delete(name)
      })
      window.history.forward(1)
      window.location.reload(true)
    })
  }

  const checkForUpdates = () => {
    checkVersionRequest().then((isLatest) => {
      setIsLatest(isLatest)
      if(isLatest !== true) {
        setUpdatesAvailable(true)
      } else {
        setUpdatesAvailable(false)
      }
    })
  }

  const dismiss = () => {
    setIsLatest(true)
  }

  return (
    <React.Fragment>
      <Modal
        backdrop='static'
        keyboard={false}
        show={show}
        onHide={onHide}
        dialogClassName={classes.modal}
        animation={true}
      >
        <ModalBody>
          <center>
            <h6>Settings</h6>
          </center>
          <div className={classes.settings}>
            <div className='items'>
              <div className='item'>
                <div className="toggle_container">
                  <span className='title'>Show Video Embeds</span>
                  <span className='toggle' onClick={handleVideoEmbedsToggle}>{!(loading && selectedItem === 'videoEmbedsToggle') ? videoEmbedsStatus === 'enabled' ? 'Disable' : 'Enable' : <div className={classes.loading}><CircularProgress color='#ffffff' style={{height: 20, width: 20}} /></div>}</span>
                </div>
                <div className="description">All the video embeds are <b>{videoEmbedsStatus}</b></div>
              </div>
              <div className='item'>
                <div className="toggle_container">
                  <span className='title'>Show Link Previews</span>
                  <span className='toggle' onClick={handleLinkPreviewToggle}>{!(loading && selectedItem === 'linkPreviewToggle') ? linkPreviewsStatus === 'enabled' ? 'Disable' : 'Enable' : <div className={classes.loading}><CircularProgress color='#ffffff' style={{height: 20, width: 20}} /></div>}</span>
                </div>
                <div className="description">All the link previews are <b>{linkPreviewsStatus}</b></div>
              </div>
              <div className='item'>
                <div className="toggle_container">
                  <span className='title'>Show Images</span>
                  <span className='toggle' onClick={handleShowImagesToggle}>{!(loading && selectedItem === 'showImagesToggle') ? showImagesStatus === 'enabled' ? 'Disable' : 'Enable' : <div className={classes.loading}><CircularProgress color='#ffffff' style={{height: 20, width: 20}} /></div>}</span>
                </div>
                <div className="description">All the images are <b>{showImagesStatus}</b></div>
              </div>
            </div>
          </div>
          <center>
            <div className={classes.versionContainer}>
              <span className='current_version'>You're on v{VERSION}</span>
              <span className='check_updates_button' onClick={checkForUpdates} hidden={isLatest || updatesAvailable}>CHECK FOR UPDATES</span>
              <span className='up_to_date_button' hidden={!isLatest}>ALREADY UPDATE-TO DATE</span>
              {/* eslint-disable-next-line */}
              <span className='check_again_text' hidden={!isLatest}>No updates available. Check again later <span role="img">👋</span></span>
              <span className='updates_avaialble' onClick={reload} hidden={isLatest || !updatesAvailable}>UPDATES AVAILABLE</span>
            </div>
          </center>
          <center>
            <ContainedButton
              onClick={onHide}
              className={classes.closeButton}
              fontSize={14}
              label='Done'
            />
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    checkVersionRequest,
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)