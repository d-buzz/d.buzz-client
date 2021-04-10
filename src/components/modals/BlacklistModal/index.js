import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { closeBlacklistDialog, broadcastNotification } from 'store/interface/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { blacklistUserRequest, unblacklistUserRequest } from "store/auth/actions"

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
  closeButton: {
    marginTop: 15,
    width: 100,
    height: 35,
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


const BlacklistModal = (props) => {
  const {
    closeBlacklistDialog,
    blacklistModal,
    loading,
    blacklistedList,
    broadcastNotification,
    blacklistUserRequest,
    unblacklistUserRequest,
  } = props
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(null)
  const [isListFollowed, setIsListFollowed] = useState(false)
  const classes = useStyles()
  const { blacklistSuccessCallback } = blacklistModal

  useEffect(() => {
    if(blacklistModal && blacklistModal.hasOwnProperty('open')) {
      const { open, username } = blacklistModal
      setOpen(open)
      setUsername(username)
      const list = [...blacklistedList].map((item) => { return item.name })
      if(Object.values(list).includes(username)){
        setIsListFollowed(true)
      }else{
        setIsListFollowed(false)
      }
    }
  // eslint-disable-next-line
  }, [blacklistModal, blacklistedList])

  const onHide = () => {
    closeBlacklistDialog()
  }

  const handleClickBlacklistUser = () => {
    if(!isListFollowed) {
      blacklistUserRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success',`Successfully blacklist ${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
      })
    } else {
      unblacklistUserRequest(username).then(({ success, errorMessage }) => {
        if(success){
          setOpen(false)
          onHide()
          broadcastNotification('success',`Successfully unblacklist ${username}`)
          modalCallback()
        }else{
          broadcastNotification('error', errorMessage)
        }
      })
    }
  }

  const modalCallback = () => {
    if(blacklistSuccessCallback){
      blacklistSuccessCallback()
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
                      <h6>Blacklist user?</h6>
                      <p className={classes.text}>
                        Would you like to add <b>@{username}</b> to your blacklist?
                      </p>
                    </React.Fragment>
                  )}
                  {isListFollowed && (
                    <React.Fragment>
                      <h6>Unblacklist user?</h6>
                      <p className={classes.text}>
                        Would you like to remove <b>@{username}</b> to your blacklist?
                      </p>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {loading && (
                <React.Fragment>
                  <h6>Operation in progress</h6>
                  <p className={classes.text}>
                    {isListFollowed ? 'Removing' : 'Adding'} <b>@{username}</b> to your blacklist
                  </p>
                </React.Fragment>
              )}
            </center>
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ display: 'inline-block' }}>
                <ContainedButton
                  onClick={handleClickBlacklistUser}
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  label={isListFollowed ? 'Remove' : 'Add'}
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
  blacklistModal: state.interfaces.get('blacklistDialog'),
  loading: pending(state, 'BLACKLIST_USER_REQUEST') || pending(state, 'UNBLACKLIST_USER_REQUEST'),
  blacklistedList: state.profile.get('blacklistedList'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closeBlacklistDialog,
    broadcastNotification,
    blacklistUserRequest,
    unblacklistUserRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(BlacklistModal)
