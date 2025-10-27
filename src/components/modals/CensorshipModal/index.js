import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { broadcastNotification, closeCensorshipDialog } from 'store/interface/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
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
  formControl: {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      color: theme.font.color,
    },
    '& .MuiInputLabel-root': {
      color: theme.font.color,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.font.color,
    },
    '&:hover .MuiOutlinedInput-input': {
      color: theme.font.color,
    },
    '&:hover .MuiInputLabel-root': {
      color: theme.font.color,
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.font.color,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
      color: theme.font.color,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.font.color,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.font.color,
    },
  },
  selectRoot: {
    '&:before': {
      borderColor: theme.font.color,
    },
    '&:after': {
      borderColor: theme.font.color,
    },
  },
  input: {
    color: 'white !important',
  },
  icon: {
    fill: theme.font.color,
  },
  link: {
    color: '#d32f2f',
  },
}))


const CensorhipModal = (props) => {
  const {
    loading,
    item,
    closeCensorshipDialog,
    // censorTypes = [], // Unused - may be needed for future features
    broadcastNotification,
  } = props

  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState(null)
  const [permlink, setPermlink] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    if(item && item.hasOwnProperty('open')) {
      const { open, author, permlink } = item
      setOpen(open)
      setAuthor(author)
      setPermlink(permlink)
    }
  }, [item])

  const handleClickCloseDialog = () => {
    closeCensorshipDialog()
  }

  // Unused functions - censorship feature deprecated
  // const handleChangeTypeId = (event) => {
  //   setTypeId(event.target.value)
  // }

  // const handleClickCensorBuzz = () => {
  //   setOpen(false)
  //   broadcastNotification('error', 'Censorship feature is no longer available')
  //   setTypeId(0)
  // }


  return (
    <React.Fragment>
      <Modal className={classes.modal} show={open || loading} onHide={handleClickCloseDialog}>
        <ModalBody>
          <div className={classes.innerModal}>
            <center>
              {!loading && (
                <React.Fragment>
                  <h6>Censorship Feature Unavailable</h6>
                  <p className={classes.text}>
                    The censorship API is no longer available. This feature has been deprecated. <br />
                    <Link className={classes.link} to={`/@${author}/${permlink}`} rel='noopener noreferrer' target='_blank'>@{author}/{permlink}</Link> <br />
                  </p>
                  <p className={classes.text}>
                    Please use your personal mute/block features instead.
                  </p>
                </React.Fragment>
              )}
              {loading && (<h6>Processing...</h6>)}
            </center>
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ textAlign: 'center' }}>
                <ContainedButton
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  onClick={handleClickCloseDialog}
                  label="Close"
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
  item: state.interfaces.get('censorshipDialog')?.toJS ? state.interfaces.get('censorshipDialog').toJS() : state.interfaces.get('censorshipDialog'),
  censorTypes: [],
  loading: false,
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    broadcastNotification,
    closeCensorshipDialog,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CensorhipModal)
