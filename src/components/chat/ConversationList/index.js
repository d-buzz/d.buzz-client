/**
 * ConversationList Component
 *
 * Dropdown popup showing list of conversations
 * Anchored to ChatButton, displays recent conversations with search
 *
 * @component
 */

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import {
  Paper,
  TextField,
  InputAdornment,
  List,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
} from '@material-ui/core'
import { SearchIcon, SettingsIcon, CloseIcon } from 'components/elements'
import ConversationListItem from '../ConversationListItem'
import {
  toggleChatList,
  openChat,
  fetchConversationsRequest,
} from 'store/chat/actions'

const useStyles = createUseStyles(theme => ({
  container: {
    position: 'fixed',
    bottom: 90,
    right: 20,
    width: 350,
    maxHeight: 500,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 999,
    backgroundColor: theme.background?.primary || '#ffffff',
    animation: '$slideUp 0.3s ease-out',
  },
  '@keyframes slideUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  header: {
    padding: '16px',
    borderBottom: theme.border?.primary || '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.background?.secondary || '#f5f5f5',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: theme.font?.color || '#000000',
  },
  headerActions: {
    display: 'flex',
    gap: 8,
  },
  searchContainer: {
    padding: '12px 16px',
    borderBottom: theme.border?.primary || '1px solid #e0e0e0',
  },
  searchField: {
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
      padding: '10px 14px',
      fontSize: '0.9rem',
      color: theme.font?.color || '#000000',
    },
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: 400,
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: theme.background?.primary || '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: 4,
      '&:hover': {
        background: '#555',
      },
    },
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    color: theme.textIcon?.color || '#888888',
  },
  emptyStateIcon: {
    fontSize: '3rem',
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: '0.95rem',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: '0.85rem',
    opacity: 0.7,
  },
  loadingContainer: {
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
    backgroundColor: 'transparent',
  },
  // Hide on mobile
  '@media (max-width: 768px)': {
    container: {
      display: 'none',
    },
    backdrop: {
      display: 'none',
    },
  },
}))

const ConversationList = ({
  isOpen,
  conversations,
  isLoading,
  toggleChatList,
  openChat,
  fetchConversationsRequest,
}) => {
  const classes = useStyles()
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)

  // Fetch conversations on mount
  useEffect(() => {
    if (isOpen && (!conversations || conversations.size === 0)) {
      fetchConversationsRequest()
    }
  }, [isOpen, conversations, fetchConversationsRequest])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // Check if click is not on ChatButton
        const chatButton = document.querySelector('[aria-label="Open messages"]')
        if (chatButton && !chatButton.contains(event.target)) {
          toggleChatList()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, toggleChatList])

  if (!isOpen) {
    return null
  }

  // Convert conversations to array and sort
  const conversationsArray = conversations
    ? conversations.toArray().map(([username, conversation]) => ({
        username,
        ...conversation.toJS(),
      }))
    : []

  // Sort: pinned first, then by last activity
  const sortedConversations = conversationsArray.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.lastActivity - a.lastActivity
  })

  // Filter by search query
  const filteredConversations = searchQuery
    ? sortedConversations.filter((conv) =>
        conv.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedConversations

  const handleConversationClick = (username) => {
    openChat(username)
    toggleChatList()
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleClose = () => {
    toggleChatList()
  }

  return (
    <>
      <div className={classes.backdrop} />
      <Paper className={classes.container} ref={containerRef} elevation={8}>
        {/* Header */}
        <div className={classes.header}>
          <Typography className={classes.title}>Messages</Typography>
          <div className={classes.headerActions}>
            <IconButton size="small" aria-label="Settings" title="Message settings">
              <SettingsIcon />
            </IconButton>
            <IconButton size="small" onClick={handleClose} aria-label="Close" title="Close">
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        {/* Search */}
        <div className={classes.searchContainer}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Conversation List */}
        <div className={classes.listContainer}>
          {isLoading ? (
            <div className={classes.loadingContainer}>
              <CircularProgress size={40} style={{ color: '#e61c34' }} />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className={classes.emptyState}>
              <div className={classes.emptyStateIcon}>💬</div>
              <Typography className={classes.emptyStateText}>
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </Typography>
              <Typography className={classes.emptyStateSubtext}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a conversation by searching for a username'}
              </Typography>
            </div>
          ) : (
            <List>
              {filteredConversations.map((conversation, index) => (
                <React.Fragment key={conversation.username}>
                  <ConversationListItem
                    conversation={conversation}
                    onClick={() => handleConversationClick(conversation.username)}
                  />
                  {index < filteredConversations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </div>
      </Paper>
    </>
  )
}

const mapStateToProps = (state) => ({
  isOpen: state.chat.getIn(['ui', 'isChatListOpen']),
  conversations: state.chat.get('conversations'),
  isLoading: state.chat.getIn(['ui', 'isLoadingMessages']),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      toggleChatList,
      openChat,
      fetchConversationsRequest,
    },
    dispatch
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConversationList)
