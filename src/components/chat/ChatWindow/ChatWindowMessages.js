/**
 * ChatWindowMessages Sub-Component
 *
 * Scrollable message area displaying conversation messages
 * Auto-scrolls to bottom on new messages
 *
 * @component
 */

import React from 'react'
import { createUseStyles } from 'react-jss'
import { Typography, CircularProgress } from '@material-ui/core'
import MessageBubble from './MessageBubble'
import moment from 'moment'

const useStyles = createUseStyles(theme => ({
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.background?.primary || '#ffffff',
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: 3,
      '&:hover': {
        background: '#555',
      },
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.textIcon?.color || '#888888',
    textAlign: 'center',
    padding: '20px',
  },
  emptyStateIcon: {
    fontSize: '3rem',
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: '0.9rem',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: '0.8rem',
    opacity: 0.7,
  },
  dateSeparator: {
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0 8px',
    '&::before, &::after': {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.border?.background || '#e0e0e0'}`,
    },
  },
  dateSeparatorText: {
    padding: '0 12px',
    fontSize: '0.75rem',
    color: theme.textIcon?.color || '#888888',
    fontWeight: 500,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
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
      transform: 'translateY(-10px)',
      opacity: 1,
    },
  },
}))

const ChatWindowMessages = ({
  messages,
  currentUser,
  partnerUsername,
  messagesEndRef,
  isLoading = false,
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

  if (isLoading) {
    return (
      <div className={classes.messagesContainer}>
        <div className={classes.loadingContainer}>
          <CircularProgress size={30} style={{ color: '#e61c34' }} />
        </div>
      </div>
    )
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
            <MessageBubble
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

export default ChatWindowMessages
