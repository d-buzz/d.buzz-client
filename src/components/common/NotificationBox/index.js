import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
// import AlertTitle from '@material-ui/lab/AlertTitle'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { isMobile } from 'react-device-detect'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    wordBreak: 'break-word',
    ...theme.notification,
  },
  alertWrapper: {
    ...theme.messageColor,
    color: '#ffffff !important',
    fontWeight: 'bold !important',

    '.MuiAlert-icon': {
      color: `#ffffff !important`,
      fontSize: '30px !important',
    },
  },
}))

const NotificationBox = (props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const { notificationBoxData } = props
  const alertStyles = { background: severity === 'success' ? '#28a745' : '#dc3545'}

  let snackBarStyle = { maxWidth: 300 }
  let anchorOrigin = { vertical: 'bottom', horizontal: 'right' }

  if(isMobile) {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    snackBarStyle = {}
  }

  useEffect(() => {
    if(notificationBoxData.hasOwnProperty('open') && typeof notificationBoxData === 'object') {
      const { open } = notificationBoxData
      if(open) {
        const { message, severity } = notificationBoxData
        setMessage(message)
        setSeverity(severity)
      } else {
        setMessage('')
        setSeverity('')
      }
      setOpen(open)
    }
  }, [notificationBoxData])

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      style={snackBarStyle}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      className={classes.wrapper}
    >
      <Alert
        variant="outlined"
        onClose={onClose}
        severity={severity}
        classes={{root: classes.alertWrapper}}
        style={alertStyles}
      >
        {/* <AlertTitle>{`${severity.charAt(0).toUpperCase()}${severity.slice(1)}`}</AlertTitle> */}
        {message}
      </Alert>
    </Snackbar>
  )
}

const mapStateToProps = (state) => ({
  notificationBoxData: state.interfaces.get('notificationBoxData'),
})

export default connect(mapStateToProps)(NotificationBox)
