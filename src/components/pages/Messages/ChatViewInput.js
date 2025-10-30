/**
 * ChatViewInput Component
 *
 * Mobile-optimized message input area
 * Fixed to bottom, keyboard-aware, with emoji picker
 *
 * @component
 */

import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { TextField, IconButton, InputAdornment } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import { EmojiIcon } from 'components/elements'
import EmojiPicker from 'components/common/EmojiPicker'
import useTypingIndicator from 'hooks/useTypingIndicator'

const useStyles = createUseStyles(theme => ({
  inputContainer: {
    padding: '12px 16px',
    borderTop: theme.border?.primary || '1px solid #e0e0e0',
    backgroundColor: theme.background?.secondary || '#f5f5f5',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', // iOS safe area
  },
  textField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: 24,
      backgroundColor: theme.background?.primary || '#ffffff',
      '& fieldset': {
        borderColor: theme.border?.background || '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: '#e61c34',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#e61c34',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 14px',
      fontSize: '1rem',
      color: theme.font?.color || '#000000',
      maxHeight: '100px',
      overflowY: 'auto',
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 0,
    },
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#e61c34',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c91829',
    },
    '&.Mui-disabled': {
      backgroundColor: theme.textIcon?.color || '#cccccc',
      color: 'white',
      opacity: 0.5,
    },
  },
  emojiButton: {
    padding: 6,
    color: theme.textIcon?.color || '#888888',
    '&:hover': {
      color: '#e61c34',
      backgroundColor: 'transparent',
    },
  },
  emojiPickerContainer: {
    position: 'fixed',
    bottom: 70,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 16px',
  },
  characterCount: {
    fontSize: '0.75rem',
    color: theme.textIcon?.color || '#888888',
    padding: '0 4px',
  },
  warningCount: {
    color: '#ff6b6b',
  },
}))

const MAX_MESSAGE_LENGTH = 1000

const ChatViewInput = ({ onSendMessage, partnerUsername }) => {
  const classes = useStyles()
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef(null)
  const onTyping = useTypingIndicator(partnerUsername)

  // Focus input on mount (for better mobile UX)
  useEffect(() => {
    if (inputRef.current) {
      // Delay to ensure keyboard doesn't interfere with initial render
      setTimeout(() => {
        inputRef.current.focus()
      }, 300)
    }
  }, [])

  const handleChange = (event) => {
    const value = event.target.value
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value)
      // Trigger typing indicator
      if (value.trim().length > 0) {
        onTyping()
      }
    }
  }

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage) {
      onSendMessage(trimmedMessage)
      setMessage('')
      // Keep focus on input for continued typing
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleKeyPress = (event) => {
    // On mobile, Enter key behavior is different
    // We'll let users tap the send button instead
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleEmojiSelect = (emoji) => {
    const newMessage = message + emoji
    if (newMessage.length <= MAX_MESSAGE_LENGTH) {
      setMessage(newMessage)
    }
    setShowEmojiPicker(false)
    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const characterCount = message.length
  const isNearLimit = characterCount > MAX_MESSAGE_LENGTH * 0.9
  const canSend = message.trim().length > 0 && characterCount <= MAX_MESSAGE_LENGTH

  return (
    <>
      {showEmojiPicker && (
        <div className={classes.emojiPickerContainer}>
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      <div className={classes.inputContainer}>
        <TextField
          ref={inputRef}
          className={classes.textField}
          variant="outlined"
          placeholder={`Message @${partnerUsername}...`}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  className={classes.emojiButton}
                  size="small"
                  onClick={handleEmojiButtonClick}
                  aria-label="Add emoji"
                >
                  <EmojiIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: isNearLimit && (
              <InputAdornment position="end">
                <span
                  className={`${classes.characterCount} ${
                    characterCount === MAX_MESSAGE_LENGTH ? classes.warningCount : ''
                  }`}
                >
                  {characterCount}/{MAX_MESSAGE_LENGTH}
                </span>
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          className={classes.sendButton}
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendIcon />
        </IconButton>
      </div>
    </>
  )
}

export default ChatViewInput
