/**
 * Redux Reducers for D.Buzz Messaging System
 *
 * Using Immutable.js for efficient state updates
 *
 * @module store/chat/reducers
 */

import { fromJS, Map, List } from 'immutable'
import {
  // Message actions
  ADD_OPTIMISTIC_MESSAGE,
  CONFIRM_MESSAGE,
  MESSAGE_FAILED,
  RECEIVE_MESSAGE,
  RECEIVE_MESSAGES_BATCH,
  // Conversation actions
  FETCH_CONVERSATIONS_SUCCESS,
  FETCH_MESSAGES_SUCCESS,
  UPDATE_CONVERSATION_MESSAGES,
  NEW_CONVERSATION_DETECTED,
  MARK_MESSAGES_READ,
  ARCHIVE_CONVERSATION,
  DELETE_CONVERSATION,
  MUTE_CONVERSATION,
  UNMUTE_CONVERSATION,
  PIN_CONVERSATION,
  UNPIN_CONVERSATION,
  // UI actions
  OPEN_CHAT,
  CLOSE_CHAT,
  MINIMIZE_CHAT,
  MAXIMIZE_CHAT,
  TOGGLE_CHAT_LIST,
  SET_CURRENT_CHAT,
  // Typing actions
  UPDATE_TYPING_STATUS,
  // Polling actions
  START_MESSAGE_POLLING,
  STOP_MESSAGE_POLLING,
  UPDATE_LAST_POLL_TIME,
  // Settings actions
  UPDATE_MESSAGE_SETTINGS,
  TOGGLE_NOTIFICATIONS,
  SET_TRANSFER_AMOUNT,
  TOGGLE_SOUND,
  TOGGLE_AUTO_READ_RECEIPTS,
  // Error and loading actions
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  // Cache actions
  UPDATE_MEMO_KEY_CACHE,
  CLEAR_MEMO_KEY_CACHE,
  UPDATE_LAST_FETCHED_BLOCK,
} from './actions'

/**
 * Default state structure
 */
const defaultState = fromJS({
  // Conversations: Map of username -> conversation object
  conversations: {},
  // Messages: Map of username -> List of message objects
  messages: {},
  // Active chat windows (desktop)
  activeChats: [],
  // Current chat (mobile)
  currentChat: null,
  // Minimized chat windows
  minimizedChats: [],
  // UI state
  ui: {
    isChatListOpen: false,
    isLoadingMessages: false,
    sendingMessage: false,
    error: null,
    selectedMessageIds: [],
  },
  // Memo key cache: Map of username -> {key, timestamp}
  memoKeys: {},
  // Polling state
  polling: {
    isActive: false,
    lastGlobalPoll: null,
    lastConversationPoll: {},
    pollingInterval: 10000, // 10 seconds for active conversations
  },
  // User settings
  settings: {
    transferAmount: '0.001 HIVE',
    notificationsEnabled: true,
    soundEnabled: true,
    pollingEnabled: true,
    autoReadReceipts: true,
  },
  // Last fetched block numbers per conversation
  lastFetchedBlocks: {},
})

/**
 * Main chat reducer
 */
export const chat = (state = defaultState, { type, payload }) => {
  switch (type) {
    // ========================================
    // Message Actions
    // ========================================
    case ADD_OPTIMISTIC_MESSAGE: {
      const { recipient, tempId, content, timestamp } = payload
      const message = {
        messageId: tempId,
        from: state.getIn(['auth', 'user', 'username']), // Will be set by saga
        to: recipient,
        content,
        timestamp,
        status: 'pending',
        type: 'custom_json',
      }

      // Add message to messages list
      const messages = state.getIn(['messages', recipient]) || List()
      const updatedMessages = messages.push(fromJS(message))

      return state.setIn(['messages', recipient], updatedMessages)
    }

    case CONFIRM_MESSAGE: {
      const { tempId, confirmedMessage } = payload
      const { to } = confirmedMessage

      // Find and update the message
      const messages = state.getIn(['messages', to]) || List()
      const messageIndex = messages.findIndex((msg) => msg.get('messageId') === tempId)

      if (messageIndex !== -1) {
        const updatedMessages = messages.update(messageIndex, (msg) =>
          msg.merge(fromJS({ ...confirmedMessage, status: 'confirmed' }))
        )
        return state.setIn(['messages', to], updatedMessages)
      }

      return state
    }

    case MESSAGE_FAILED: {
      const { tempId } = payload

      // Find the message and mark as failed
      const messagesMap = state.get('messages')
      let updatedState = state

      messagesMap.forEach((messagesList, username) => {
        const messageIndex = messagesList.findIndex((msg) => msg.get('messageId') === tempId)
        if (messageIndex !== -1) {
          const updatedMessages = messagesList.update(messageIndex, (msg) =>
            msg.set('status', 'failed')
          )
          updatedState = updatedState.setIn(['messages', username], updatedMessages)
        }
      })

      return updatedState
    }

    case RECEIVE_MESSAGE: {
      const message = payload
      const partner = message.from // Assuming current user is the recipient

      // Add message to messages list
      const messages = state.getIn(['messages', partner]) || List()

      // Check if message already exists (prevent duplicates)
      const existingIndex = messages.findIndex(
        (msg) => msg.get('messageId') === message.messageId || msg.get('txId') === message.txId
      )

      if (existingIndex !== -1) {
        return state // Message already exists
      }

      const updatedMessages = messages.push(fromJS({ ...message, status: 'confirmed' }))

      // Update conversation
      const conversation = state.getIn(['conversations', partner]) || Map()
      const updatedConversation = conversation.merge(
        fromJS({
          partner,
          lastMessage: message,
          lastActivity: message.timestamp,
          unreadCount: (conversation.get('unreadCount') || 0) + 1,
        })
      )

      return state
        .setIn(['messages', partner], updatedMessages)
        .setIn(['conversations', partner], updatedConversation)
    }

    case RECEIVE_MESSAGES_BATCH: {
      const messages = payload
      let updatedState = state

      messages.forEach((message) => {
        const partner = message.from === state.getIn(['auth', 'user', 'username']) ? message.to : message.from

        const existingMessages = updatedState.getIn(['messages', partner]) || List()
        const existingIndex = existingMessages.findIndex(
          (msg) => msg.get('messageId') === message.messageId || msg.get('txId') === message.txId
        )

        if (existingIndex === -1) {
          const updatedMessages = existingMessages.push(fromJS({ ...message, status: 'confirmed' }))
          updatedState = updatedState.setIn(['messages', partner], updatedMessages)
        }
      })

      return updatedState
    }

    // ========================================
    // Conversation Actions
    // ========================================
    case FETCH_CONVERSATIONS_SUCCESS: {
      const conversations = payload
      return state.set('conversations', fromJS(conversations))
    }

    case FETCH_MESSAGES_SUCCESS: {
      const { username, messages } = payload
      return state.setIn(['messages', username], fromJS(messages))
    }

    case UPDATE_CONVERSATION_MESSAGES: {
      const { username, messages } = payload
      const existingMessages = state.getIn(['messages', username]) || List()
      const updatedMessages = existingMessages.concat(fromJS(messages))
      return state.setIn(['messages', username], updatedMessages)
    }

    case NEW_CONVERSATION_DETECTED: {
      const conversation = payload
      return state.setIn(['conversations', conversation.partner], fromJS(conversation))
    }

    case MARK_MESSAGES_READ: {
      const { username } = payload
      const conversation = state.getIn(['conversations', username])

      if (conversation) {
        return state.setIn(['conversations', username, 'unreadCount'], 0)
      }

      return state
    }

    case ARCHIVE_CONVERSATION: {
      const { username } = payload
      return state.setIn(['conversations', username, 'status'], 'archived')
    }

    case DELETE_CONVERSATION: {
      const { username } = payload
      return state
        .deleteIn(['conversations', username])
        .deleteIn(['messages', username])
    }

    case MUTE_CONVERSATION: {
      const { username } = payload
      return state.setIn(['conversations', username, 'notifications'], 'none')
    }

    case UNMUTE_CONVERSATION: {
      const { username } = payload
      return state.setIn(['conversations', username, 'notifications'], 'all')
    }

    case PIN_CONVERSATION: {
      const { username } = payload
      return state.setIn(['conversations', username, 'isPinned'], true)
    }

    case UNPIN_CONVERSATION: {
      const { username } = payload
      return state.setIn(['conversations', username, 'isPinned'], false)
    }

    // ========================================
    // UI Actions
    // ========================================
    case OPEN_CHAT: {
      const { username } = payload
      const activeChats = state.get('activeChats')

      // Check if already open
      if (activeChats.includes(username)) {
        return state
      }

      // Limit to 3 simultaneous windows on desktop
      let updatedActiveChats = activeChats
      if (activeChats.size >= 3) {
        updatedActiveChats = activeChats.shift() // Remove the oldest
      }

      updatedActiveChats = updatedActiveChats.push(username)

      // Remove from minimized if present
      const minimizedChats = state.get('minimizedChats').filter((chat) => chat !== username)

      return state
        .set('activeChats', updatedActiveChats)
        .set('minimizedChats', minimizedChats)
    }

    case CLOSE_CHAT: {
      const { username } = payload
      const activeChats = state.get('activeChats').filter((chat) => chat !== username)
      const minimizedChats = state.get('minimizedChats').filter((chat) => chat !== username)

      return state
        .set('activeChats', activeChats)
        .set('minimizedChats', minimizedChats)
    }

    case MINIMIZE_CHAT: {
      const { username } = payload
      const activeChats = state.get('activeChats').filter((chat) => chat !== username)
      const minimizedChats = state.get('minimizedChats')

      if (!minimizedChats.includes(username)) {
        return state
          .set('activeChats', activeChats)
          .set('minimizedChats', minimizedChats.push(username))
      }

      return state
    }

    case MAXIMIZE_CHAT: {
      const { username } = payload
      const minimizedChats = state.get('minimizedChats').filter((chat) => chat !== username)
      const activeChats = state.get('activeChats')

      if (!activeChats.includes(username)) {
        return state
          .set('activeChats', activeChats.push(username))
          .set('minimizedChats', minimizedChats)
      }

      return state
    }

    case TOGGLE_CHAT_LIST: {
      const isOpen = state.getIn(['ui', 'isChatListOpen'])
      return state.setIn(['ui', 'isChatListOpen'], !isOpen)
    }

    case SET_CURRENT_CHAT: {
      const { username } = payload
      return state.set('currentChat', username)
    }

    // ========================================
    // Typing Actions
    // ========================================
    case UPDATE_TYPING_STATUS: {
      const { username, isTyping } = payload
      return state.setIn(['conversations', username, 'isTyping'], isTyping)
    }

    // ========================================
    // Polling Actions
    // ========================================
    case START_MESSAGE_POLLING: {
      return state.setIn(['polling', 'isActive'], true)
    }

    case STOP_MESSAGE_POLLING: {
      return state.setIn(['polling', 'isActive'], false)
    }

    case UPDATE_LAST_POLL_TIME: {
      const { username, timestamp } = payload
      return state.setIn(['polling', 'lastConversationPoll', username], timestamp)
    }

    // ========================================
    // Settings Actions
    // ========================================
    case UPDATE_MESSAGE_SETTINGS: {
      return state.mergeIn(['settings'], fromJS(payload))
    }

    case TOGGLE_NOTIFICATIONS: {
      const enabled = state.getIn(['settings', 'notificationsEnabled'])
      return state.setIn(['settings', 'notificationsEnabled'], !enabled)
    }

    case SET_TRANSFER_AMOUNT: {
      const { amount } = payload
      return state.setIn(['settings', 'transferAmount'], amount)
    }

    case TOGGLE_SOUND: {
      const enabled = state.getIn(['settings', 'soundEnabled'])
      return state.setIn(['settings', 'soundEnabled'], !enabled)
    }

    case TOGGLE_AUTO_READ_RECEIPTS: {
      const enabled = state.getIn(['settings', 'autoReadReceipts'])
      return state.setIn(['settings', 'autoReadReceipts'], !enabled)
    }

    // ========================================
    // Error and Loading Actions
    // ========================================
    case SET_LOADING: {
      const { isLoading, operation } = payload
      if (operation === 'messages') {
        return state.setIn(['ui', 'isLoadingMessages'], isLoading)
      } else if (operation === 'sending') {
        return state.setIn(['ui', 'sendingMessage'], isLoading)
      }
      return state
    }

    case SET_ERROR: {
      const { error } = payload
      return state.setIn(['ui', 'error'], error)
    }

    case CLEAR_ERROR: {
      return state.setIn(['ui', 'error'], null)
    }

    // ========================================
    // Cache Actions
    // ========================================
    case UPDATE_MEMO_KEY_CACHE: {
      const { username, memoKey } = payload
      return state.setIn(['memoKeys', username], fromJS({
        key: memoKey,
        timestamp: Date.now(),
      }))
    }

    case CLEAR_MEMO_KEY_CACHE: {
      const { username } = payload
      if (username) {
        return state.deleteIn(['memoKeys', username])
      }
      return state.set('memoKeys', Map())
    }

    case UPDATE_LAST_FETCHED_BLOCK: {
      const { username, blockNum } = payload
      return state.setIn(['lastFetchedBlocks', username], blockNum)
    }

    default:
      return state
  }
}
