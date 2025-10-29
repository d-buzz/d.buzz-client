/**
 * ChatContainer Component
 *
 * Main container that manages all chat components:
 * - ChatButton (FAB)
 * - ConversationList (dropdown)
 * - Multiple ChatWindows (up to 3 simultaneously)
 *
 * Handles window positioning and management
 *
 * @component
 */

import React from 'react'
import { connect } from 'react-redux'
import ChatButton from '../ChatButton'
import ConversationList from '../ConversationList'
import ChatWindow from '../ChatWindow'

const ChatContainer = ({ activeChats, isAuthenticated }) => {
  // Don't render anything if user is not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Chat Button (FAB) */}
      <ChatButton />

      {/* Conversation List (Dropdown) */}
      <ConversationList />

      {/* Active Chat Windows */}
      {activeChats.map((username, index) => (
        <ChatWindow key={username} username={username} index={index} />
      ))}
    </>
  )
}

const mapStateToProps = (state) => {
  const activeChats = state.chat.get('activeChats')
  const user = state.auth.get('user')

  return {
    activeChats: activeChats ? activeChats.toArray() : [],
    isAuthenticated: !!user && user.get('username'),
  }
}

export default connect(mapStateToProps)(ChatContainer)
