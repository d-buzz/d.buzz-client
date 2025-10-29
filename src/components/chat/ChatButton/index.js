/**
 * ChatButton Component
 *
 * Floating Action Button (FAB) for accessing D.Buzz messaging
 * Displays unread message count badge
 *
 * @component
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { Fab, Badge } from '@material-ui/core'
import { MessageIcon } from 'components/elements'
import { toggleChatList, startMessagePolling } from 'store/chat/actions'

const useStyles = createUseStyles(theme => ({
  chatButton: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#e61c34',
    color: 'white',
    width: 56,
    height: 56,
    boxShadow: '0px 4px 12px rgba(230, 28, 52, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#c91829',
      transform: 'scale(1.05)',
      boxShadow: '0px 6px 16px rgba(230, 28, 52, 0.6)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#ffffff',
      color: '#e61c34',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      border: '2px solid #e61c34',
      animation: '$pulse 2s infinite',
    },
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      width: 24,
      height: 24,
      '& path': {
        fill: 'white',
        stroke: 'white',
      },
    },
  },
  // Hide on mobile (will use navigation instead)
  '@media (max-width: 768px)': {
    chatButton: {
      display: 'none',
    },
  },
}))

const ChatButton = ({
  unreadCount,
  isAuthenticated,
  toggleChatList,
  startMessagePolling,
  pollingActive,
}) => {
  const classes = useStyles()

  // Don't show if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Start polling when component mounts
  React.useEffect(() => {
    if (isAuthenticated && !pollingActive) {
      startMessagePolling()
    }
  }, [isAuthenticated, pollingActive, startMessagePolling])

  const handleClick = () => {
    toggleChatList()
  }

  return (
    <Badge
      badgeContent={unreadCount}
      color="secondary"
      className={classes.badge}
      invisible={unreadCount === 0}
      max={99}
    >
      <Fab
        className={classes.chatButton}
        onClick={handleClick}
        aria-label="Open messages"
        title={unreadCount > 0 ? `${unreadCount} unread messages` : 'Messages'}
      >
        <div className={classes.iconWrapper}>
          <MessageIcon />
        </div>
      </Fab>
    </Badge>
  )
}

const mapStateToProps = (state) => {
  const conversations = state.chat.get('conversations')
  const user = state.auth.get('user')
  const pollingActive = state.chat.getIn(['polling', 'isActive'])

  // Calculate total unread count
  let unreadCount = 0
  if (conversations) {
    conversations.forEach((conversation) => {
      unreadCount += conversation.get('unreadCount') || 0
    })
  }

  return {
    unreadCount,
    isAuthenticated: !!user && user.get('username'),
    pollingActive,
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      toggleChatList,
      startMessagePolling,
    },
    dispatch
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatButton)
