/**
 * MobileConversationItem Component
 *
 * Mobile-optimized conversation list item
 * Larger touch targets, swipe actions, full-width layout
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
    padding: '16px',
    minHeight: 80,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:active': {
      backgroundColor: theme.background?.secondary || 'rgba(0, 0, 0, 0.04)',
    },
  },
  listItemUnread: {
    backgroundColor: theme.unread?.backgroundColor || 'rgba(230, 28, 52, 0.05)',
  },
  avatarContainer: {
    minWidth: 64,
  },
  avatar: {
    width: 56,
    height: 56,
    fontSize: '1.4rem',
    fontWeight: 'bold',
    backgroundColor: '#e61c34',
    color: 'white',
  },
  onlineBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.background?.primary || '#ffffff'}`,
      width: 14,
      height: 14,
      borderRadius: '50%',
    },
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  primaryText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  username: {
    fontWeight: 600,
    fontSize: '1.05rem',
    color: theme.font?.color || '#000000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  usernameUnread: {
    fontWeight: 700,
  },
  timestamp: {
    fontSize: '0.8rem',
    color: theme.textIcon?.color || '#888888',
    flexShrink: 0,
    marginLeft: 12,
  },
  timestampUnread: {
    color: '#e61c34',
    fontWeight: 600,
  },
  lastMessage: {
    fontSize: '0.9rem',
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
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '3px 10px',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinnedIndicator: {
    fontSize: '0.9rem',
    marginRight: 6,
  },
}))

const MobileConversationItem = ({ conversation, onClick }) => {
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
    const isYou = from !== username // If sender is not the partner, it's "You"
    const prefix = isYou ? 'You: ' : ''

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

export default MobileConversationItem
