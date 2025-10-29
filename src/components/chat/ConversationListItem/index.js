/**
 * ConversationListItem Component
 *
 * Individual conversation item in the list
 * Shows avatar, username, last message preview, timestamp, unread badge
 *
 * @component
 */

import React from 'react'
import { createUseStyles } from 'react-jss'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
} from '@material-ui/core'
import moment from 'moment'

const useStyles = createUseStyles(theme => ({
  listItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.background?.secondary || 'rgba(0, 0, 0, 0.04)',
    },
  },
  listItemUnread: {
    backgroundColor: theme.unread?.backgroundColor || 'rgba(230, 28, 52, 0.05)',
    '&:hover': {
      backgroundColor: theme.unread?.['&:hover']?.backgroundColor || 'rgba(230, 28, 52, 0.1)',
    },
  },
  avatarContainer: {
    minWidth: 56,
  },
  avatar: {
    width: 48,
    height: 48,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#e61c34',
    color: 'white',
  },
  onlineBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.background?.primary || '#ffffff'}`,
      width: 12,
      height: 12,
      borderRadius: '50%',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  primaryText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: theme.font?.color || '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  usernameUnread: {
    fontWeight: 700,
  },
  timestamp: {
    fontSize: '0.75rem',
    color: theme.textIcon?.color || '#888888',
    flexShrink: 0,
    marginLeft: 8,
  },
  timestampUnread: {
    color: '#e61c34',
    fontWeight: 600,
  },
  lastMessage: {
    fontSize: '0.85rem',
    color: theme.textIcon?.color || '#888888',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  lastMessageUnread: {
    color: theme.font?.color || '#000000',
    fontWeight: 500,
  },
  messagePrefix: {
    fontWeight: 600,
    marginRight: 4,
  },
  unreadBadge: {
    marginLeft: 'auto',
    flexShrink: 0,
    backgroundColor: '#e61c34',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinnedIndicator: {
    fontSize: '0.8rem',
    marginRight: 4,
  },
}))

const ConversationListItem = ({ conversation, onClick }) => {
  const classes = useStyles()

  const {
    username,
    lastMessage,
    lastActivity,
    unreadCount = 0,
    isPinned = false,
  } = conversation

  const hasUnread = unreadCount > 0

  // Format timestamp
  const getFormattedTime = (timestamp) => {
    const now = moment()
    const messageTime = moment(timestamp)

    if (now.diff(messageTime, 'hours') < 24) {
      return messageTime.format('h:mm A')
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('ddd')
    } else {
      return messageTime.format('MMM D')
    }
  }

  // Get avatar initial
  const getAvatarInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  // Format last message
  const getLastMessagePreview = () => {
    if (!lastMessage) {
      return 'No messages yet'
    }

    const { content, from } = lastMessage
    const isYou = from === username // This would need current user context
    const prefix = isYou ? '' : 'You: '

    return (
      <>
        {prefix && <span className={classes.messagePrefix}>{prefix}</span>}
        {content}
      </>
    )
  }

  // Check if online (within last 5 minutes)
  const isOnline = lastActivity && Date.now() - lastActivity < 5 * 60 * 1000

  return (
    <ListItem
      className={`${classes.listItem} ${hasUnread ? classes.listItemUnread : ''}`}
      onClick={onClick}
      button
    >
      <ListItemAvatar className={classes.avatarContainer}>
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          variant="dot"
          className={classes.onlineBadge}
          invisible={!isOnline}
        >
          <Avatar
            className={classes.avatar}
            alt={username}
            src={`https://images.hive.blog/u/${username}/avatar`}
          >
            {getAvatarInitial(username)}
          </Avatar>
        </Badge>
      </ListItemAvatar>

      <ListItemText
        className={classes.textContainer}
        primary={
          <div className={classes.primaryText}>
            <Typography
              className={`${classes.username} ${hasUnread ? classes.usernameUnread : ''}`}
              component="span"
            >
              {isPinned && <span className={classes.pinnedIndicator}>📌</span>}
              @{username}
            </Typography>
            <Typography
              className={`${classes.timestamp} ${hasUnread ? classes.timestampUnread : ''}`}
              component="span"
            >
              {getFormattedTime(lastActivity)}
            </Typography>
          </div>
        }
        secondary={
          <div className={classes.lastMessage}>
            <Typography
              className={`${classes.lastMessage} ${hasUnread ? classes.lastMessageUnread : ''}`}
              component="span"
            >
              {getLastMessagePreview()}
            </Typography>
            {hasUnread && (
              <span className={classes.unreadBadge}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        }
      />
    </ListItem>
  )
}

export default ConversationListItem
