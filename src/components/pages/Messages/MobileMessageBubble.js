/**
 * MobileMessageBubble Component
 *
 * Mobile-optimized message bubble
 * Larger text, better touch targets, optimized for mobile viewing
 *
 * @component
 */

import React from 'react'
import { useDispatch } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { Typography, IconButton } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ScheduleIcon from '@material-ui/icons/Schedule'
import ErrorIcon from '@material-ui/icons/Error'
import moment from 'moment'
import { retryMessage } from 'store/chat/actions'

const useStyles = createUseStyles(theme => ({
  messageContainer: {
    display: 'flex',
    marginBottom: 12,
    alignItems: 'flex-end',
    flexDirection: (props) => (props.isSent ? 'row-reverse' : 'row'),
  },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: 16,
    wordBreak: 'break-word',
    position: 'relative',
  },
  sentBubble: {
    backgroundColor: '#e61c34',
    color: 'white',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: theme.background?.secondary || '#f0f0f0',
    color: theme.font?.color || '#000000',
    borderBottomLeftRadius: 4,
  },
  messageContent: {
    fontSize: '1rem',
    lineHeight: 1.5,
    marginBottom: 4,
    whiteSpace: 'pre-wrap',
  },
  messageFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  timestamp: {
    fontSize: '0.75rem',
    opacity: 0.85,
  },
  statusIcon: {
    fontSize: '1rem',
    opacity: 0.85,
  },
  transferBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.75rem',
    padding: '3px 8px',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
  },
  failedMessage: {
    opacity: 0.6,
  },
  errorIcon: {
    color: '#ff6b6b',
  },
}))

const MobileMessageBubble = ({ message, isSent }) => {
  const classes = useStyles({ isSent })
  const dispatch = useDispatch()

  const {
    content,
    timestamp,
    status = 'confirmed',
    type,
    read = false,
    tempId,
  } = message

  const handleRetry = () => {
    if (status === 'failed' && tempId) {
      dispatch(retryMessage(tempId))
    }
  }

  const getStatusIcon = () => {
    if (!isSent) return null

    switch (status) {
      case 'pending':
        return <ScheduleIcon className={classes.statusIcon} />
      case 'confirmed':
        return read ? (
          <DoneAllIcon className={classes.statusIcon} />
        ) : (
          <DoneIcon className={classes.statusIcon} />
        )
      case 'failed':
        return (
          <IconButton
            size="small"
            onClick={handleRetry}
            style={{ padding: 0 }}
            aria-label="Retry sending message"
          >
            <ErrorIcon className={`${classes.statusIcon} ${classes.errorIcon}`} />
          </IconButton>
        )
      default:
        return null
    }
  }

  const getFormattedTime = () => {
    return moment(timestamp).format('h:mm A')
  }

  return (
    <div className={classes.messageContainer}>
      <div
        className={`${classes.bubble} ${
          isSent ? classes.sentBubble : classes.receivedBubble
        } ${status === 'failed' ? classes.failedMessage : ''}`}
      >
        <Typography className={classes.messageContent}>{content}</Typography>

        <div className={classes.messageFooter}>
          <span className={classes.timestamp}>{getFormattedTime()}</span>
          {getStatusIcon()}
        </div>

        {type === 'transfer' && (
          <div className={classes.transferBadge}>
            💰 0.001 HIVE
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileMessageBubble
