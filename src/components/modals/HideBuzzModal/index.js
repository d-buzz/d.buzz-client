import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { hideBuzzRequest } from 'store/auth/actions'
import { closeHideBuzzDialog, broadcastNotification } from 'store/interface/actions'
import { unfollowRequest } from 'store/posts/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
import { pending } from 'redux-saga-thunk'
import { Link } from 'react-router-dom'

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


const HideBuzzModal = (props) => {
  const {
    closeHideBuzzDialog,
    hideBuzzDialog,
    hideBuzzRequest,
    loading,
    broadcastNotification,
    mutelist,
  } = props

  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState(null)
  const [permlink, setPermlink] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    if(hideBuzzDialog && hideBuzzDialog.hasOwnProperty('open')) {
      const { open, author, permlink } = hideBuzzDialog
      setOpen(open)
      setAuthor(author)
      setPermlink(permlink)
    }
  }, [hideBuzzDialog])

  const onHide = () => {
    closeHideBuzzDialog()
  }

  const handleClickHideBuzz = () => {
    hideBuzzRequest(author, permlink).then(() => {
      setOpen(false)
      onHide()
      broadcastNotification('success', `Succesfully hide @${author}/${permlink}`)
      const { hideBuzzSuccesCallback } = hideBuzzDialog

      if(hideBuzzSuccesCallback) {
        hideBuzzSuccesCallback()
      }
    }).catch(() => {
      broadcastNotification('success', `Failed to hide @${author}/${permlink}`)
    })
  }

  return (
    <React.Fragment>
      <Modal className={classes.modal} show={open || loading} onHide={onHide}>
        <ModalBody>
          <div className={classes.innerModal}>
            <center>
              {!loading && (
                <React.Fragment>
                  {!mutelist.includes(author) && (
                    <React.Fragment>
                      <h6>Would you like to hide this buzz?</h6>
                      <p className={classes.text}>
                        Clicking yes will hide the buzz <br />
                        <Link to={`/@${author}/${permlink}`} rel='noopener noreferrer' target='_blank'>@${author}/${permlink}</Link> <br />
                        from your feeds on this browser
                      </p>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {loading && (
                <React.Fragment>
                  <h6>Operation in progress</h6>
                  <p className={classes.text}>
                    Adding <Link to={`/@${author}/${permlink}`} rel='noopener noreferrer' target='_blank'>@${author}/${permlink}</Link> to your hidden buzz list
                  </p>
                </React.Fragment>
              )}
            </center>
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ display: 'inline-block' }}>
                <ContainedButton
                  onClick={handleClickHideBuzz}
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
  hideBuzzDialog: state.interfaces.get('hideBuzzDialog'),
  loading: pending(state, 'HIDE_BUZZ_REQUEST'),
  mutelist: state.auth.get('mutelist'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closeHideBuzzDialog,
    hideBuzzRequest,
    broadcastNotification,
    unfollowRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(HideBuzzModal)
