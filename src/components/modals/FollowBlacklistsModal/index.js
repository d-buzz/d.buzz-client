import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { closeFollowBlacklistsDialog, broadcastNotification } from 'store/interface/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { followBlacklistsRequest, unfollowBlacklistsRequest } from "store/auth/actions"

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


const FollowBlacklistsModal = (props) => {
  const {
    closeFollowBlacklistsDialog,
    followBlacklistsDialog,
    loading,
    followedBlacklist,
    broadcastNotification,
    followBlacklistsRequest,
    unfollowBlacklistsRequest,
  } = props
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(null)
  const [isListFollowed, setIsListFollowed] = useState(false)
  const classes = useStyles()
  const { followBlacklistsSuccessCallback } = followBlacklistsDialog

  useEffect(() => {
    if(followBlacklistsDialog && followBlacklistsDialog.hasOwnProperty('open')) {
      const { open, username } = followBlacklistsDialog
      setOpen(open)
      setUsername(username)
      const list = [...followedBlacklist].map((item) => { return item.name })
      if(Object.values(list).includes(username)){
        setIsListFollowed(true)
      }else{
        setIsListFollowed(false)
      }
    }
  // eslint-disable-next-line
  }, [followBlacklistsDialog,followedBlacklist])

  const onHide = () => {
    closeFollowBlacklistsDialog()
  }

  const handleClickFollowUserBlacklist = () => {
    if(!isListFollowed) {
      followBlacklistsRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success',`Successfully followed blacklist of ${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
      })
    } else {
      unfollowBlacklistsRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success',`Successfully unfollowed blacklist of ${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
      })
    }
  }

  const modalCallback = () => {
    if(followBlacklistsSuccessCallback){
      followBlacklistsSuccessCallback()
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
                      <h6>Follow user blacklist?</h6>
                      <p className={classes.text}>
                        Would you like to follow <b>@{username}</b>'s blacklist?
                      </p>
                    </React.Fragment>
                  )}
                  {isListFollowed && (
                    <React.Fragment>
                      <h6>Unfollow user blacklist?</h6>
                      <p className={classes.text}>
                        Would you like to unfollow <b>@{username}</b>'s blacklist?
                      </p>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {loading && (
                <React.Fragment>
                  <h6>Operation in progress</h6>
                  <p className={classes.text}>
                    {isListFollowed ? 'Unfollowing' : 'Following'} <b>@{username}</b> blacklist
                  </p>
                </React.Fragment>
              )}
            </center>
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ display: 'inline-block' }}>
                <ContainedButton
                  onClick={handleClickFollowUserBlacklist}
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
  followBlacklistsDialog: state.interfaces.get('followBlacklistsDialog'),
  loading: pending(state, 'FOLLOW_BLACKLISTS_REQUEST') || pending(state, 'UNFOLLOW_BLACKLISTS_REQUEST'),
  followedBlacklist: state.profile.get('followedBlacklist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closeFollowBlacklistsDialog,
    broadcastNotification,
    followBlacklistsRequest,
    unfollowBlacklistsRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowBlacklistsModal)
