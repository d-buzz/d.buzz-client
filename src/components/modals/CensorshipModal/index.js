import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { broadcastNotification, closeCensorshipDialog } from 'store/interface/actions'
import { censorBuzzRequest } from 'store/settings/actions'
import { ContainedButton } from 'components/elements'
import { createUseStyles } from 'react-jss'
import { connect } from 'react-redux'
import { Spinner } from 'components/elements'
import { bindActionCreators } from 'redux'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { pending } from 'redux-saga-thunk'
import classNames from 'classnames'
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
    censorTypes = [],
    censorBuzzRequest,
    broadcastNotification,
  } = props

  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState(null)
  const [permlink, setPermlink] = useState(null)
  const [typeId, setTypeId] = useState(0)
  const [callback, setCallback] = useState(null)
  const classes = useStyles()

  useEffect(() => {
    if(item && item.hasOwnProperty('open')) {
      const { open, author, permlink, callback } = item
      setCallback(callback)
      setOpen(open)
      setAuthor(author)
      setPermlink(permlink)
      setTypeId(0)
    }
  }, [item])

  const handleClickCloseDialog = () => {
    closeCensorshipDialog()
  }

  const handleChangeTypeId = (event) => {
    setTypeId(event.target.value)
  }

  const handleClickCensorBuzz = () => {
    censorBuzzRequest(author, permlink, typeId)
      .then(() => {
        setOpen(false)
        broadcastNotification('success', `Successfully censored @${author}/${permlink}`)
        callback()
        setTypeId(0)
      })
      .catch(() => {
        setOpen(false)
        broadcastNotification('error', `Something went wrong while`)
        setTypeId(0)
      })
  }


  return (
    <React.Fragment>
      <Modal className={classes.modal} show={open || loading} onHide={handleClickCloseDialog}>
        <ModalBody>
          <div className={classes.innerModal}>
            <center>
              {!loading && (
                <React.Fragment>
                  <h6>Would you like to censor this buzz?</h6>
                  <p className={classes.text}>
                    Clicking yes will mark this buzz as censored <br />
                    <Link className={classes.link} to={`/@${author}/c/${permlink}`} rel='noopener noreferrer' target='_blank'>@${author}/c/${permlink}</Link> <br />
                  </p>
                  <p className={classes.text}>
                    Pick a reason below why this buzz should be censored
                  </p>
                </React.Fragment>
              )}
              {loading && (<h6>Marking buzz as censored, please wait while it process</h6>)}
            </center>
            {!loading && (
              <FormControl variant="outlined" className={classes.formControl} classes={{ input: classes.selectRoot }}>
                <InputLabel className={classes.text}>Reason</InputLabel>
                <Select
                  label='Reason'
                  value={typeId}
                  onChange={handleChangeTypeId}
                  className={classNames(classes.text, classes.selectRoot)}
                  inputProps={{
                    classes: {
                      icon: classes.icon,
                    },
                  }}
                >
                  <MenuItem key={0} value={0}>
                    <em>-- select --</em>
                  </MenuItem>
                  {censorTypes.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          {!loading && (
            <React.Fragment>
              <div style={{ display: 'inline-block' }}>
                <ContainedButton
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  onClick={handleClickCensorBuzz}
                  label="Yes"
                />
              </div>
              <div style={{ display: 'inline-block', float: 'right' }}>
                <ContainedButton
                  className={classes.closeButton}
                  fontSize={14}
                  transparent={true}
                  onClick={handleClickCloseDialog}
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
  item: state.interfaces.get('censorshipDialog'),
  censorTypes: state.settings.get('censorTypes'),
  loading: pending(state, 'CENSOR_BUZZ_REQUEST'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    broadcastNotification,
    closeCensorshipDialog,
    censorBuzzRequest,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CensorhipModal)
