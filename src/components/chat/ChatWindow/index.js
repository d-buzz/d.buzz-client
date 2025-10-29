/**
 * ChatWindow Component
 *
 * Floating chat window for desktop messaging
 * Contains header, messages area, and input section
 * Supports minimize/maximize/close actions
 *
 * @component
 */

import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { Paper } from '@material-ui/core'
import ChatWindowHeader from './ChatWindowHeader'
import ChatWindowMessages from './ChatWindowMessages'
import ChatWindowInput from './ChatWindowInput'
import {
  closeChat,
  minimizeChat,
  fetchMessagesRequest,
  markMessagesRead,
  sendMessageRequest,
} from 'store/chat/actions'

const useStyles = createUseStyles(theme => ({
  chatWindow: {
    position: 'fixed',
    bottom: 20,
    width: 320,
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
    zIndex: 900,
    backgroundColor: theme.background?.primary || '#ffffff',
    transition: 'all 0.3s ease',
  },
  minimized: {
    height: 48,
  },
  // Position based on index
  '@media (min-width: 769px)': {
    chatWindow: {
      right: (props) => `${100 + props.index * 340}px`,
    },
  },
  // Hide on mobile
  '@media (max-width: 768px)': {
    chatWindow: {
      display: 'none',
    },
  },
}))

const ChatWindow = ({
  username,
  index,
  isMinimized,
  messages,
  conversation,
  closeChat,
  minimizeChat,
  fetchMessagesRequest,
  markMessagesRead,
  sendMessageRequest,
  currentUser,
}) => {
  const classes = useStyles({ index })
  const messagesEndRef = useRef(null)

  // Fetch messages on mount
  useEffect(() => {
    if (!messages || messages.size === 0) {
      fetchMessagesRequest(username)
    }
  }, [username, messages, fetchMessagesRequest])

  // Mark messages as read when window is opened
  useEffect(() => {
    if (!isMinimized) {
      markMessagesRead(username)
    }
  }, [isMinimized, username, markMessagesRead])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isMinimized])

  const handleClose = () => {
    closeChat(username)
  }

  const handleMinimize = () => {
    minimizeChat(username)
  }

  const handleSendMessage = (content) => {
    sendMessageRequest(username, content)
  }

  return (
    <Paper
      className={`${classes.chatWindow} ${isMinimized ? classes.minimized : ''}`}
      elevation={8}
    >
      <ChatWindowHeader
        username={username}
        isOnline={conversation?.isOnline}
        isMinimized={isMinimized}
        onClose={handleClose}
        onMinimize={handleMinimize}
      />

      {!isMinimized && (
        <>
          <ChatWindowMessages
            messages={messages}
            currentUser={currentUser}
            partnerUsername={username}
            messagesEndRef={messagesEndRef}
          />

          <ChatWindowInput
            onSendMessage={handleSendMessage}
            partnerUsername={username}
          />
        </>
      )}
    </Paper>
  )
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps
  const messages = state.chat.getIn(['messages', username])
  const conversation = state.chat.getIn(['conversations', username])
  const minimizedChats = state.chat.get('minimizedChats')
  const currentUser = state.auth.get('user')

  return {
    messages,
    conversation: conversation ? conversation.toJS() : null,
    isMinimized: minimizedChats.includes(username),
    currentUser: currentUser ? currentUser.get('username') : null,
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      closeChat,
      minimizeChat,
      fetchMessagesRequest,
      markMessagesRead,
      sendMessageRequest,
    },
    dispatch
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
