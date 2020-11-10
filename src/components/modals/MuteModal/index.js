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
  const [username, setUsernamae] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    if(muteModal && muteModal.hasOwnProperty('open')) {
      const { open, username } = muteModal
      setOpen(open)
      setUsernamae(username)
    }
  }, [muteModal])

  const onHide = () => {
    closeMuteDialog()
  }

  const handleClickMuteUser = () => {
    const inMuteList = mutelist.includes(username)
    if(!inMuteList) {
      muteUserRequest(username).then(() => {
        setOpen(false)
        onHide()
        broadcastNotification('success', `Succesfully muted @${username}`)
      }).catch(() => {
        broadcastNotification('success', `Failed to mute @${username}`)
      })
    } else {
      unfollowRequest(username).then((result) => {
        if(result) {
          broadcastNotification('success', `Successfully unmuted @${username}`)
        } else {
          broadcastNotification('error', `Failed unmuting @${username}`)
        }
      })
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
                  {!mutelist.includes(username) && (
                    <React.Fragment>
                      <h6>Add user to mutelist?</h6>
                      <p className={classes.text}>
                        Would you like to add <b>@{username}</b> to your list of
                        muted users?
                      </p>
                    </React.Fragment>
                  )}
                  {mutelist.includes(username) && (
                    <React.Fragment>
                      <h6>Add user to mutelist?</h6>
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
                    Adding <b>@{username}</b> to your list of
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
                  label="Add"
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
