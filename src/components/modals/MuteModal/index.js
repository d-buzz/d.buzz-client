import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { muteUserRequest } from 'store/auth/actions'
import { closeMuteDialog, broadcastNotification } from 'store/interface/actions'
import {
  unfollowRequest,
} from 'store/posts/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { errorMessageComposer } from "services/helper"

const useStyles = createUseStyles(theme => ({
  modal: {
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      borderRadius: '15px 15px !important',
      border: 'none',
      maxWidth: 400,
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
  darkModeButton: {
    backgroundColor: 'rgb(21, 32, 43)',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
  },
  ligthModeButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    '& label': {
      fontSize: 14,
      color: 'black',
      display: 'block',
    },
  },
  grayModeButton: {
    backgroundColor: '#202225',
    '& label': {
      fontSize: 14,
      color: 'white',
      display: 'block',
    },
  },
  notes: {
    fontSize: 14,
    ...theme.font,
  },
  closeButton: {
    marginTop: 15,
    width: 100,
    height: 35,
  },
  active: {
    border: '3px solid #e61c34',
  },
  innerModal: {
    width: '98%',
    margin: '0 auto',
    height: 'max-content',
  },
  text: {
    ...theme.font,
  },
}))


const MuteModal = (props) => {
  const {
    closeMuteDialog,
    muteModal,
    muteUserRequest,
    loading,
    broadcastNotification,
    mutelist,
    unfollowRequest,
  } = props
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const classes = useStyles()
  const { muteSuccessCallback } = muteModal

  useEffect(() => {
    if(muteModal && muteModal.hasOwnProperty('open')) {
      const { open, username } = muteModal
      setOpen(open)
      setUsername(username)
      if(mutelist.includes(username)) {
        setIsMuted(true)
      }else{
        setIsMuted(false)
      }
    }
  // eslint-disable-next-line
  }, [muteModal, mutelist])

  const onHide = () => {
    closeMuteDialog()
  }

  const handleClickMuteUser = () => {
    if(!isMuted) {
      muteUserRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success', `Succesfully muted @${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
        
      }).catch(() => {
        broadcastNotification('error', `Failed to mute @${username}`)
      })
    } else {
      unfollowRequest(username).then((result) => {
        if(result === -32000){
          const errorMessage = errorMessageComposer('unmute',result)
          broadcastNotification('error', errorMessage)
        }else{
          if(result) {
            setOpen(false)
            onHide()
            broadcastNotification('success', `Successfully unmuted @${username}`)
            modalCallback()
          } else {
            broadcastNotification('error', `Failed unmuting @${username}`)
          }
        }
      })
    }
  }

  const modalCallback = () => {
    if(muteSuccessCallback) {
      muteSuccessCallback()
    }
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={open || loading} onHide={onHide}>
        <ModalBody>
          <div className={classes.innerModal}>
            <center>
              {!loading && (
                <React.Fragment>
                  {!isMuted && (
                    <React.Fragment>
                      <h6>Add user to mutelist?</h6>
                      <p className={classes.text}>
                        Would you like to add <b>@{username}</b> to your list of
                        muted users?
                      </p>
                    </React.Fragment>
                  )}
                  {isMuted && (
                    <React.Fragment>
                      <h6>Remove user to mutelist?</h6>
                      <p className={classes.text}>
                        Would you like to remove <b>@{username}</b> from your list of
                        muted users?
                      </p>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {loading && (
                <React.Fragment>
                  <h6>Operation in progress</h6>
                  <p className={classes.text}>
                    {isMuted ? 'Removing' : 'Adding'} <b>@{username}</b> to your list of
                    muted users
                  </p>
                </React.Fragment>
              )}
            </center>
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ display: 'inline-block' }}>
                <ContainedButton
                  onClick={handleClickMuteUser}
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  label={isMuted ? 'Remove' : 'Add'}
                />
              </div>
              <div style={{ display: 'inline-block', float: 'right' }}>
                <ContainedButton
                  onClick={onHide}
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  label="Cancel"
                />
              </div>
            </React.Fragment>
          )}
          <center>
            {loading && (
              <Spinner size={40} loading={true} />
            )}
          </center>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  theme: state.settings.get('theme'),
  muteModal: state.interfaces.get('muteDialogUser'),
  loading: pending(state, 'MUTE_USER_REQUEST') || pending(state, 'UNFOLLOW_REQUEST'),
  mutelist: state.auth.get('mutelist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closeMuteDialog,
    muteUserRequest,
    broadcastNotification,
    unfollowRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MuteModal)
