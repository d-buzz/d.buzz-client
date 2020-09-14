import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    maxWidth: 300,
    wordBreak: 'break-word',
    ...theme.notification,
  },
  alertWrapper: {
    ...theme.messageColor,
  },
}))

const NotificationBox = (props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const { notificationBoxData } = props

  const snackBarStyle = { maxWidth: 300 }

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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
      >
        <AlertTitle>{`${severity.charAt(0).toUpperCase()}${severity.slice(1)}`}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  )
}

const mapStateToProps = (state) => ({
  notificationBoxData: state.interfaces.get('notificationBoxData'),
})

export default connect(mapStateToProps)(NotificationBox)
