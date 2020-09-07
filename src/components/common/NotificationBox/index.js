import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
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
  const { show, message, onClose, severity = 'success' } = props

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      style={{ maxWidth: 300 }}
      open={show}
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

export default NotificationBox
