/**
 * ChatViewMessages Component
 *
 * Mobile-optimized scrollable message area
 * Displays messages with date separators and typing indicator
 *
 * @component
 */

import React from 'react'
import { createUseStyles } from 'react-jss'
import { Typography } from '@material-ui/core'
import MobileMessageBubble from './MobileMessageBubble'
import moment from 'moment'

const useStyles = createUseStyles(theme => ({
  messagesContainer: {
    padding: '16px',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '50vh',
    color: theme.textIcon?.color || '#888888',
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: '1rem',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: '0.9rem',
    opacity: 0.7,
  },
  dateSeparator: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0 12px',
    '&::before, &::after': {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.border?.background || '#e0e0e0'}`,
    },
  },
  dateSeparatorText: {
    padding: '0 16px',
    fontSize: '0.8rem',
    color: theme.textIcon?.color || '#888888',
    fontWeight: 500,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    gap: 6,
  },
  typingDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#888',
    animation: '$typing 1.4s infinite',
    '&:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'translateY(0)',
      opacity: 0.7,
    },
    '30%': {
      transform: 'translateY(-12px)',
      opacity: 1,
    },
  },
}))

const ChatViewMessages = ({
  messages,
  currentUser,
  partnerUsername,
  messagesEndRef,
  isTyping = false,
}) => {
  const classes = useStyles()

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {}

    messages.forEach((message) => {
      const msg = message.toJS ? message.toJS() : message
      const date = moment(msg.timestamp).format('YYYY-MM-DD')

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(msg)
    })

    return groups
  }

  // Format date for separator
  const formatDate = (dateStr) => {
    const date = moment(dateStr)
    const today = moment().startOf('day')
    const yesterday = moment().subtract(1, 'days').startOf('day')

    if (date.isSame(today, 'day')) {
      return 'Today'
    } else if (date.isSame(yesterday, 'day')) {
      return 'Yesterday'
    } else {
      return date.format('MMMM D, YYYY')
    }
  }

  if (!messages || messages.size === 0) {
    return (
      <div className={classes.messagesContainer}>
        <div className={classes.emptyState}>
          <div className={classes.emptyStateIcon}>💬</div>
          <Typography className={classes.emptyStateText}>
            No messages yet
          </Typography>
          <Typography className={classes.emptyStateSubtext}>
            Start a conversation with @{partnerUsername}
          </Typography>
        </div>
      </div>
    )
  }

  const messagesByDate = groupMessagesByDate(messages.toArray())

  return (
    <div className={classes.messagesContainer}>
      {Object.keys(messagesByDate).sort().map((date) => (
        <React.Fragment key={date}>
          <div className={classes.dateSeparator}>
            <Typography className={classes.dateSeparatorText}>
              {formatDate(date)}
            </Typography>
          </div>

          {messagesByDate[date].map((message) => (
            <MobileMessageBubble
              key={message.messageId || message.txId}
              message={message}
              isSent={message.from === currentUser}
            />
          ))}
        </React.Fragment>
      ))}

      {isTyping && (
        <div className={classes.typingIndicator}>
          <div className={classes.typingDot} />
          <div className={classes.typingDot} />
          <div className={classes.typingDot} />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatViewMessages
