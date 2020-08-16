import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

const NotificationBox = (props) => {
  const { show, message, onClose, severity = 'success' } = props

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      style={{ maxWidth: 300 }}
      open={show}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        variant="outlined"
        onClose={onClose}
        severity={severity}
        style={{ maxWidth: 300, wordBreak: 'break-all' }}
      >
        <AlertTitle>{`${severity.charAt(0).toUpperCase()}${severity.slice(1)}`}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationBox
