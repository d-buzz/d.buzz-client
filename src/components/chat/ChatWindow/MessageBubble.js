/**
 * MessageBubble Component
 *
 * Individual message bubble with different styling for sent/received
 * Shows timestamp on hover, read receipts, and message status
 *
 * @component
 */

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { Typography, Tooltip } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import ScheduleIcon from '@material-ui/icons/Schedule'
import ErrorIcon from '@material-ui/icons/Error'
import moment from 'moment'

const useStyles = createUseStyles(theme => ({
  messageContainer: {
    display: 'flex',
    marginBottom: 8,
    alignItems: 'flex-end',
    flexDirection: (props) => (props.isSent ? 'row-reverse' : 'row'),
  },
  bubble: {
    maxWidth: '70%',
    padding: '8px 12px',
    borderRadius: 12,
    wordBreak: 'break-word',
    position: 'relative',
    transition: 'all 0.2s ease',
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
    fontSize: '0.9rem',
    lineHeight: 1.4,
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
    fontSize: '0.7rem',
    opacity: 0.8,
  },
  statusIcon: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  transferBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.7rem',
    padding: '2px 6px',
    borderRadius: 8,
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

const MessageBubble = ({ message, isSent }) => {
  const classes = useStyles({ isSent })
  const [showTooltip, setShowTooltip] = useState(false)

  const {
    content,
    timestamp,
    status = 'confirmed',
    type,
    read = false,
  } = message

  const getStatusIcon = () => {
    if (!isSent) return null

    switch (status) {
      case 'pending':
        return (
          <Tooltip title="Sending...">
            <ScheduleIcon className={classes.statusIcon} />
          </Tooltip>
        )
      case 'confirmed':
        return read ? (
          <Tooltip title="Read">
            <DoneAllIcon className={classes.statusIcon} />
          </Tooltip>
        ) : (
          <Tooltip title="Delivered">
            <DoneIcon className={classes.statusIcon} />
          </Tooltip>
        )
      case 'failed':
        return (
          <Tooltip title="Failed to send. Tap to retry.">
            <ErrorIcon className={`${classes.statusIcon} ${classes.errorIcon}`} />
          </Tooltip>
        )
      default:
        return null
    }
  }

  const getFormattedTime = () => {
    return moment(timestamp).format('h:mm A')
  }

  const getFullTimestamp = () => {
    return moment(timestamp).format('MMMM D, YYYY [at] h:mm A')
  }

  return (
    <Tooltip
      title={getFullTimestamp()}
      placement={isSent ? 'left' : 'right'}
      open={showTooltip}
    >
      <div
        className={classes.messageContainer}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
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
    </Tooltip>
  )
}

export default MessageBubble
