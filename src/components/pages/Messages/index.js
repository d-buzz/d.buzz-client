/**
 * MessagesPage Component
 *
 * Full-screen mobile page for viewing conversations
 * Shows list of conversations with search, pull-to-refresh, swipe actions
 *
 * @component
 */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { withRouter } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  List,
  Divider,
  Fab,
  IconButton,
  CircularProgress,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { SearchIcon, SettingsIcon } from 'components/elements'
import MobileConversationItem from './MobileConversationItem'
import {
  fetchConversationsRequest,
  setCurrentChat,
  startMessagePolling,
} from 'store/chat/actions'

const useStyles = createUseStyles(theme => ({
  container: {
    padding: 0,
    minHeight: '100vh',
    backgroundColor: theme.background?.primary || '#ffffff',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: theme.background?.primary || '#ffffff',
    borderBottom: theme.border?.primary || '1px solid #e0e0e0',
    padding: '12px 16px',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: theme.font?.color || '#000000',
  },
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 25,
      backgroundColor: theme.background?.secondary || '#f5f5f5',
      '& fieldset': {
        border: 'none',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 14px',
      fontSize: '0.95rem',
      color: theme.font?.color || '#000000',
    },
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '40px 20px',
    textAlign: 'center',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: 8,
    color: theme.font?.color || '#000000',
  },
  emptyStateSubtext: {
    fontSize: '0.95rem',
    color: theme.textIcon?.color || '#888888',
    marginBottom: 24,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
  },
  fab: {
    position: 'fixed',
    bottom: 80,
    right: 20,
    backgroundColor: '#e61c34',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c91829',
    },
  },
  // Show only on mobile
  '@media (min-width: 769px)': {
    container: {
      display: 'none',
    },
  },
}))

const MessagesPage = ({
  conversations,
  isLoading,
  isAuthenticated,
  fetchConversationsRequest,
  setCurrentChat,
  startMessagePolling,
  pollingActive,
  history,
}) => {
  const classes = useStyles()
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversationsRequest()
      if (!pollingActive) {
        startMessagePolling()
      }
    }
  }, [isAuthenticated, fetchConversationsRequest, startMessagePolling, pollingActive])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/home')
    }
  }, [isAuthenticated, history])

  if (!isAuthenticated) {
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
    setCurrentChat(username)
    history.push(`/messages/${username}`)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleNewMessage = () => {
    // TODO: Open new message dialog with username search
    console.log('New message clicked')
  }

  const handleSettings = () => {
    // TODO: Open message settings
    console.log('Settings clicked')
  }

  return (
    <Container className={classes.container} maxWidth="md">
      {/* Header */}
      <div className={classes.header}>
        <div className={classes.headerTop}>
          <Typography className={classes.title}>Messages</Typography>
          <IconButton onClick={handleSettings} aria-label="Settings">
            <SettingsIcon />
          </IconButton>
        </div>

        {/* Search */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search messages..."
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
            <CircularProgress size={50} style={{ color: '#e61c34' }} />
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
                : 'Start a conversation by tapping the + button below'}
            </Typography>
          </div>
        ) : (
          <List>
            {filteredConversations.map((conversation, index) => (
              <React.Fragment key={conversation.username}>
                <MobileConversationItem
                  conversation={conversation}
                  onClick={() => handleConversationClick(conversation.username)}
                />
                {index < filteredConversations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </div>

      {/* New Message FAB */}
      <Fab
        className={classes.fab}
        onClick={handleNewMessage}
        aria-label="New message"
      >
        <AddIcon />
      </Fab>
    </Container>
  )
}

const mapStateToProps = (state) => {
  const conversations = state.chat.get('conversations')
  const user = state.auth.get('user')
  const isLoading = state.chat.getIn(['ui', 'isLoadingMessages'])
  const pollingActive = state.chat.getIn(['polling', 'isActive'])

  return {
    conversations,
    isLoading,
    isAuthenticated: !!user && user.get('username'),
    pollingActive,
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      fetchConversationsRequest,
      setCurrentChat,
      startMessagePolling,
    },
    dispatch
  ),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessagesPage))
