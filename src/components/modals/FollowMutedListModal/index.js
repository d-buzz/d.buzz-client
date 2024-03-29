import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { closeFollowMutedDialog, broadcastNotification } from 'store/interface/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { followMutedListRequest, unfollowMutedListRequest } from "store/auth/actions"

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
    backgroundColor: '#212121',
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


const FollowMutedListModal = (props) => {
  const {
    closeFollowMutedDialog,
    followMutedModal,
    loading,
    followedMutedList,
    broadcastNotification,
    followMutedListRequest,
    unfollowMutedListRequest,
  } = props
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(null)
  const [isListFollowed, setIsListFollowed] = useState(false)
  const classes = useStyles()
  const { followMutedSuccessCallback } = followMutedModal

  useEffect(() => {
    if(followMutedModal && followMutedModal.hasOwnProperty('open')) {
      const { open, username } = followMutedModal
      setOpen(open)
      setUsername(username)
      const list = [...followedMutedList].map((item) => { return item.name })
      if(Object.values(list).includes(username)){
        setIsListFollowed(true)
      }else{
        setIsListFollowed(false)
      }
    }
  // eslint-disable-next-line
  }, [followMutedModal, followedMutedList])

  const onHide = () => {
    closeFollowMutedDialog()
  }

  const handleClickFollowMutedList = () => {
    if(!isListFollowed) {
      followMutedListRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success',`Successfully followed muted list of ${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
      })
    } else {
      unfollowMutedListRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success',`Successfully unfollowed muted list of ${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
      })
    }
  }

  const modalCallback = () => {
    if(followMutedSuccessCallback){
      followMutedSuccessCallback()
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
                  {!isListFollowed && (
                    <React.Fragment>
                      <h6>Follow muted list?</h6>
                      <p className={classes.text}>
                        Would you like to follow <b>@{username}</b>'s muted list?
                      </p>
                    </React.Fragment>
                  )}
                  {isListFollowed && (
                    <React.Fragment>
                      <h6>Unfollow muted list?</h6>
                      <p className={classes.text}>
                        Would you like to unfollow <b>@{username}</b>'s muted list?
                      </p>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {loading && (
                <React.Fragment>
                  <h6>Operation in progress</h6>
                  <p className={classes.text}>
                    {isListFollowed ? 'Unfollowing' : 'Following'} <b>@{username}</b> muted list
                  </p>
                </React.Fragment>
              )}
            </center>
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ display: 'inline-block' }}>
                <ContainedButton
                  onClick={handleClickFollowMutedList}
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  label={isListFollowed ? 'Unfollow' : 'Follow'}
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
  followMutedModal: state.interfaces.get('followMutedListDialog'),
  loading: pending(state, 'FOLLOW_MUTED_LIST_REQUEST') || pending(state, 'UNFOLLOW_MUTED_LIST_REQUEST'),
  followedMutedList: state.profile.get('followedMuted'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closeFollowMutedDialog,
    broadcastNotification,
    followMutedListRequest,
    unfollowMutedListRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowMutedListModal)
