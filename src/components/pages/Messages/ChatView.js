/**
 * ChatView Component
 *
 * Full-screen mobile chat interface
 * Shows messages and input for a single conversation
 *
 * @component
 */

import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { withRouter } from 'react-router-dom'
import {
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Avatar,
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChatViewMessages from './ChatViewMessages'
import ChatViewInput from './ChatViewInput'
import {
  fetchMessagesRequest,
  sendMessageRequest,
  markMessagesRead,
} from 'store/chat/actions'

const useStyles = createUseStyles(theme => ({
  container: {
    padding: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.background?.primary || '#ffffff',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 8px 8px 4px',
    backgroundColor: '#e61c34',
    color: 'white',
    minHeight: 56,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  backButton: {
    color: 'white',
    marginRight: 4,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
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
    fontSize: '1.05rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  status: {
    fontSize: '0.8rem',
    opacity: 0.9,
  },
  moreButton: {
    color: 'white',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: theme.background?.primary || '#ffffff',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  // Show only on mobile
  '@media (min-width: 769px)': {
    container: {
      display: 'none',
    },
  },
}))

const ChatView = ({
  match,
  history,
  messages,
  conversation,
  currentUser,
  isAuthenticated,
  fetchMessagesRequest,
  sendMessageRequest,
  markMessagesRead,
}) => {
  const classes = useStyles()
  const username = match.params.username
  const messagesEndRef = useRef(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Fetch messages on mount
  useEffect(() => {
    if (isAuthenticated && username) {
      setIsLoading(true)
      fetchMessagesRequest(username)
      setTimeout(() => setIsLoading(false), 1000)
    }
  }, [username, isAuthenticated, fetchMessagesRequest])

  // Mark messages as read
  useEffect(() => {
    if (username && messages && messages.size > 0) {
      markMessagesRead(username)
    }
  }, [username, messages, markMessagesRead])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/home')
    }
  }, [isAuthenticated, history])

  if (!isAuthenticated) {
    return null
  }

  const handleBack = () => {
    history.push('/messages')
  }

  const handleMore = () => {
    // TODO: Show options menu (mute, block, clear history)
    console.log('More options clicked')
  }

  const handleSendMessage = (content) => {
    sendMessageRequest(username, content)
  }

  const getAvatarInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  // Check if online
  const isOnline = conversation && conversation.lastActivity && Date.now() - conversation.lastActivity < 5 * 60 * 1000

  return (
    <Container className={classes.container} maxWidth="md" disableGutters>
      {/* Header */}
      <div className={classes.header}>
        <IconButton
          className={classes.backButton}
          onClick={handleBack}
          aria-label="Back"
          edge="start"
        >
          <ArrowBackIcon />
        </IconButton>

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
          <Typography className={classes.status}>
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        </div>

        <IconButton
          className={classes.moreButton}
          onClick={handleMore}
          aria-label="More options"
          edge="end"
        >
          <MoreVertIcon />
        </IconButton>
      </div>

      {/* Messages */}
      <div className={classes.messagesContainer}>
        {isLoading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={40} style={{ color: '#e61c34' }} />
          </div>
        ) : (
          <ChatViewMessages
            messages={messages}
            currentUser={currentUser}
            partnerUsername={username}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>

      {/* Input */}
      <ChatViewInput
        onSendMessage={handleSendMessage}
        partnerUsername={username}
      />
    </Container>
  )
}

const mapStateToProps = (state, ownProps) => {
  const username = ownProps.match.params.username
  const messages = state.chat.getIn(['messages', username])
  const conversation = state.chat.getIn(['conversations', username])
  const currentUser = state.auth.get('user')

  return {
    messages,
    conversation: conversation ? conversation.toJS() : null,
    currentUser: currentUser ? currentUser.get('username') : null,
    isAuthenticated: !!currentUser && currentUser.get('username'),
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      fetchMessagesRequest,
      sendMessageRequest,
      markMessagesRead,
    },
    dispatch
  ),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatView))
