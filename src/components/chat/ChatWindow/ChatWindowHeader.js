/**
 * ChatWindowHeader Sub-Component
 *
 * Header section of the chat window
 * Shows user avatar, username, online status, and action buttons
 *
 * @component
 */

import React from 'react'
import { createUseStyles } from 'react-jss'
import { Avatar, IconButton, Typography } from '@material-ui/core'
import { CloseIcon } from 'components/elements'
import MinimizeIcon from '@material-ui/icons/Remove'

const useStyles = createUseStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#e61c34',
    color: 'white',
    cursor: 'pointer',
    userSelect: 'none',
  },
  avatarContainer: {
    marginRight: 10,
    position: 'relative',
  },
  avatar: {
    width: 32,
    height: 32,
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#44b700',
    border: '2px solid #e61c34',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  username: {
    fontWeight: 600,
    fontSize: '0.9rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  status: {
    fontSize: '0.75rem',
    opacity: 0.9,
  },
  actions: {
    display: 'flex',
    gap: 4,
  },
  iconButton: {
    padding: 4,
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& svg': {
      fontSize: '1.2rem',
    },
  },
}))

const ChatWindowHeader = ({
  username,
  isOnline = false,
  isMinimized = false,
  onClose,
  onMinimize,
}) => {
  const classes = useStyles()

  const getAvatarInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  return (
    <div className={classes.header} onClick={isMinimized ? onMinimize : undefined}>
      <div className={classes.avatarContainer}>
        <Avatar
          className={classes.avatar}
          alt={username}
          src={`https://images.hive.blog/u/${username}/avatar`}
        >
          {getAvatarInitial(username)}
        </Avatar>
        {isOnline && <div className={classes.onlineIndicator} />}
      </div>

      <div className={classes.userInfo}>
        <Typography className={classes.username}>@{username}</Typography>
        {!isMinimized && (
          <Typography className={classes.status}>
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        )}
      </div>

      <div className={classes.actions}>
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onMinimize()
          }}
          title={isMinimized ? 'Maximize' : 'Minimize'}
        >
          <MinimizeIcon />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          title="Close"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default ChatWindowHeader
