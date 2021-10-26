import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import config from 'config'
import { checkVersionRequest } from 'store/settings/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
          padding: '5px 15px',
          fontSize: '1.2em',
          fontWeight: '600',
          background: '#E61C34',
          color: '#ffffff',
          borderRadius: 25,
          userSelect: 'none',
          cursor: 'pointer',

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
    },
  },
}))

const SettingsModal = (props) => {
  const {
    show,
    onHide,
    checkVersionRequest,
  } = props
  const classes = useStyles()

  const { VERSION } = config

  const [embedsStatus, setEmbedsStatus] = useState(localStorage.getItem('showEmbeds') ? localStorage.getItem('showEmbeds') : 'enabled')
  const [isLatest, setIsLatest] = useState(null)
  const [updatesAvailable, setUpdatesAvailable] = useState(false)

  useEffect(() => {
    localStorage.setItem('showEmbeds', embedsStatus)
  }, [embedsStatus])

  const handleEmbedsToggle = () => {
    if(embedsStatus === 'enabled'){
      setEmbedsStatus('disabled')
    } else {
      setEmbedsStatus('enabled')
    }
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
      <Modal className={classes.modal} show={show} onHide={onHide}>
        <ModalBody>
          <div style={{ width: '98%', margin: '0 auto', height: 'max-content' }}>
            <center>
              <h6>Settings</h6>
            </center>
            <div className={classes.settings}>
              <div className='items'>
                <div className='item'>
                  <div className="toggle_container">
                    <span className='title'>Show Video Embeds</span>
                    <span className='toggle' onClick={handleEmbedsToggle}>{embedsStatus === 'enabled' ? 'Disable' : 'Enable'}</span>
                  </div>
                  <div className="description">All the video embeds are <b>{embedsStatus}</b></div>
                </div>
              </div>
            </div>
            <center>
              <div className={classes.versionContainer}>
                <span className='current_version'>You're on {VERSION}</span>
                <span className='check_updates_button' onClick={checkForUpdates} hidden={isLatest || updatesAvailable}>CHECK FOR UPDATES</span>
                <span className='up_to_date_button' hidden={!isLatest}>AlREADY UPDATE TO DATE</span>
                {/* eslint-disable-next-line */}
                <span className='check_again_text' hidden={!isLatest}>No updates avaialable. Check again later <span role="img">👋</span></span>
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
          </div>
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

export default connect(null, mapDispatchToProps)(SettingsModal)