/**
 * ChatWindowInput Sub-Component
 *
 * Input area for composing messages
 * Includes emoji picker and send button
 *
 * @component
 */

import React, { useState, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import { TextField, IconButton, InputAdornment, Tooltip } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import { EmojiIcon } from 'components/elements'
import EmojiPicker from 'components/common/EmojiPicker'
import useTypingIndicator from 'hooks/useTypingIndicator'

const useStyles = createUseStyles(theme => ({
  inputContainer: {
    padding: '8px 12px',
    borderTop: theme.border?.primary || '1px solid #e0e0e0',
    backgroundColor: theme.background?.secondary || '#f5f5f5',
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
  },
  textField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
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
      padding: '8px 12px',
      fontSize: '0.9rem',
      color: theme.font?.color || '#000000',
      maxHeight: '60px',
      overflowY: 'auto',
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 0,
    },
  },
  sendButton: {
    padding: 8,
    color: '#e61c34',
    '&:hover': {
      backgroundColor: 'rgba(230, 28, 52, 0.1)',
    },
    '&.Mui-disabled': {
      color: theme.textIcon?.color || '#cccccc',
    },
  },
  emojiButton: {
    padding: 4,
    color: theme.textIcon?.color || '#888888',
    '&:hover': {
      color: '#e61c34',
      backgroundColor: 'transparent',
    },
  },
  emojiPickerContainer: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 8,
    zIndex: 1000,
  },
  characterCount: {
    fontSize: '0.7rem',
    color: theme.textIcon?.color || '#888888',
    padding: '0 4px',
  },
  warningCount: {
    color: '#ff6b6b',
  },
}))

const MAX_MESSAGE_LENGTH = 1000

const ChatWindowInput = ({ onSendMessage, partnerUsername }) => {
  const classes = useStyles()
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef(null)
  const onTyping = useTypingIndicator(partnerUsername)

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
      // Focus back on input
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleKeyPress = (event) => {
    // Send on Enter, new line on Shift+Enter
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
    <div className={classes.inputContainer}>
      {showEmojiPicker && (
        <div className={classes.emojiPickerContainer}>
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      <TextField
        ref={inputRef}
        className={classes.textField}
        variant="outlined"
        placeholder={`Message @${partnerUsername}...`}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        multiline
        maxRows={3}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                className={classes.emojiButton}
                size="small"
                onClick={handleEmojiButtonClick}
                title="Add emoji"
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

      <Tooltip title={canSend ? 'Send message' : 'Type a message'}>
        <span>
          <IconButton
            className={classes.sendButton}
            onClick={handleSend}
            disabled={!canSend}
            size="small"
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  )
}

export default ChatWindowInput
