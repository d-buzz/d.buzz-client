/**
 * Redux Actions for D.Buzz Messaging System
 *
 * @module store/chat/actions
 */

// ========================================
// Message Actions
// ========================================

export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST'
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS'
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE'

export const sendMessageRequest = (recipient, content, options = {}) => ({
  type: SEND_MESSAGE_REQUEST,
  payload: { recipient, content, options },
  meta: { thunk: true },
})

export const sendMessageSuccess = (response, meta) => ({
  type: SEND_MESSAGE_SUCCESS,
  payload: response,
  meta,
})

export const sendMessageFailure = (error, meta) => ({
  type: SEND_MESSAGE_FAILURE,
  payload: error,
  meta,
})

// ========================================
// Optimistic Message Actions
// ========================================

export const ADD_OPTIMISTIC_MESSAGE = 'ADD_OPTIMISTIC_MESSAGE'
export const CONFIRM_MESSAGE = 'CONFIRM_MESSAGE'
export const MESSAGE_FAILED = 'MESSAGE_FAILED'

export const addOptimisticMessage = (message) => ({
  type: ADD_OPTIMISTIC_MESSAGE,
  payload: message,
})

export const confirmMessage = (tempId, confirmedMessage) => ({
  type: CONFIRM_MESSAGE,
  payload: { tempId, confirmedMessage },
})

export const messageFailed = (tempId, error) => ({
  type: MESSAGE_FAILED,
  payload: { tempId, error },
})

export const RETRY_MESSAGE = 'RETRY_MESSAGE'

export const retryMessage = (tempId) => ({
  type: RETRY_MESSAGE,
  payload: { tempId },
})

// ========================================
// Receive Message Actions
// ========================================

export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
export const RECEIVE_MESSAGES_BATCH = 'RECEIVE_MESSAGES_BATCH'

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
})

export const receiveMessagesBatch = (messages) => ({
  type: RECEIVE_MESSAGES_BATCH,
  payload: messages,
})

// ========================================
// Fetch Conversations Actions
// ========================================

export const FETCH_CONVERSATIONS_REQUEST = 'FETCH_CONVERSATIONS_REQUEST'
export const FETCH_CONVERSATIONS_SUCCESS = 'FETCH_CONVERSATIONS_SUCCESS'
export const FETCH_CONVERSATIONS_FAILURE = 'FETCH_CONVERSATIONS_FAILURE'

export const fetchConversationsRequest = () => ({
  type: FETCH_CONVERSATIONS_REQUEST,
  meta: { thunk: true },
})

export const fetchConversationsSuccess = (response, meta) => ({
  type: FETCH_CONVERSATIONS_SUCCESS,
  payload: response,
  meta,
})

export const fetchConversationsFailure = (error, meta) => ({
  type: FETCH_CONVERSATIONS_FAILURE,
  payload: error,
  meta,
})

// ========================================
// Fetch Messages Actions
// ========================================

export const FETCH_MESSAGES_REQUEST = 'FETCH_MESSAGES_REQUEST'
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS'
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE'

export const fetchMessagesRequest = (username) => ({
  type: FETCH_MESSAGES_REQUEST,
  payload: { username },
  meta: { thunk: true },
})

export const fetchMessagesSuccess = (response, meta) => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: response,
  meta,
})

export const fetchMessagesFailure = (error, meta) => ({
  type: FETCH_MESSAGES_FAILURE,
  payload: error,
  meta,
})

// ========================================
// Update Conversation Actions
// ========================================

export const UPDATE_CONVERSATION_MESSAGES = 'UPDATE_CONVERSATION_MESSAGES'
export const NEW_CONVERSATION_DETECTED = 'NEW_CONVERSATION_DETECTED'

export const updateConversationMessages = (username, messages) => ({
  type: UPDATE_CONVERSATION_MESSAGES,
  payload: { username, messages },
})

export const newConversationDetected = (conversation) => ({
  type: NEW_CONVERSATION_DETECTED,
  payload: conversation,
})

// ========================================
// Mark Messages Read Actions
// ========================================

export const MARK_MESSAGES_READ_REQUEST = 'MARK_MESSAGES_READ_REQUEST'
export const MARK_MESSAGES_READ_SUCCESS = 'MARK_MESSAGES_READ_SUCCESS'
export const MARK_MESSAGES_READ = 'MARK_MESSAGES_READ'

export const markMessagesReadRequest = (username, messageIds) => ({
  type: MARK_MESSAGES_READ_REQUEST,
  payload: { username, messageIds },
  meta: { thunk: true },
})

export const markMessagesReadSuccess = (response, meta) => ({
  type: MARK_MESSAGES_READ_SUCCESS,
  payload: response,
  meta,
})

export const markMessagesRead = (username) => ({
  type: MARK_MESSAGES_READ,
  payload: { username },
})

export const RECEIVE_READ_RECEIPT = 'RECEIVE_READ_RECEIPT'

export const receiveReadReceipt = (username, messageIds) => ({
  type: RECEIVE_READ_RECEIPT,
  payload: { username, messageIds },
})

// ========================================
// Conversation Management Actions
// ========================================

export const ARCHIVE_CONVERSATION = 'ARCHIVE_CONVERSATION'
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION'
export const MUTE_CONVERSATION = 'MUTE_CONVERSATION'
export const UNMUTE_CONVERSATION = 'UNMUTE_CONVERSATION'
export const PIN_CONVERSATION = 'PIN_CONVERSATION'
export const UNPIN_CONVERSATION = 'UNPIN_CONVERSATION'

export const archiveConversation = (username) => ({
  type: ARCHIVE_CONVERSATION,
  payload: { username },
})

export const deleteConversation = (username) => ({
  type: DELETE_CONVERSATION,
  payload: { username },
})

export const muteConversation = (username) => ({
  type: MUTE_CONVERSATION,
  payload: { username },
})

export const unmuteConversation = (username) => ({
  type: UNMUTE_CONVERSATION,
  payload: { username },
})

export const pinConversation = (username) => ({
  type: PIN_CONVERSATION,
  payload: { username },
})

export const unpinConversation = (username) => ({
  type: UNPIN_CONVERSATION,
  payload: { username },
})

// ========================================
// UI Actions
// ========================================

export const OPEN_CHAT = 'OPEN_CHAT'
export const CLOSE_CHAT = 'CLOSE_CHAT'
export const MINIMIZE_CHAT = 'MINIMIZE_CHAT'
export const MAXIMIZE_CHAT = 'MAXIMIZE_CHAT'
export const TOGGLE_CHAT_LIST = 'TOGGLE_CHAT_LIST'
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT'

export const openChat = (username) => ({
  type: OPEN_CHAT,
  payload: { username },
})

export const closeChat = (username) => ({
  type: CLOSE_CHAT,
  payload: { username },
})

export const minimizeChat = (username) => ({
  type: MINIMIZE_CHAT,
  payload: { username },
})

export const maximizeChat = (username) => ({
  type: MAXIMIZE_CHAT,
  payload: { username },
})

export const toggleChatList = () => ({
  type: TOGGLE_CHAT_LIST,
})

export const setCurrentChat = (username) => ({
  type: SET_CURRENT_CHAT,
  payload: { username },
})

// ========================================
// Typing Indicator Actions
// ========================================

export const UPDATE_TYPING_STATUS = 'UPDATE_TYPING_STATUS'
export const SEND_TYPING_INDICATOR = 'SEND_TYPING_INDICATOR'

export const updateTypingStatus = (username, isTyping) => ({
  type: UPDATE_TYPING_STATUS,
  payload: { username, isTyping },
})

export const sendTypingIndicator = (recipient) => ({
  type: SEND_TYPING_INDICATOR,
  payload: { recipient },
})

// ========================================
// Polling Actions
// ========================================

export const START_MESSAGE_POLLING = 'START_MESSAGE_POLLING'
export const STOP_MESSAGE_POLLING = 'STOP_MESSAGE_POLLING'
export const POLL_ACTIVE_CONVERSATIONS = 'POLL_ACTIVE_CONVERSATIONS'
export const POLL_NEW_CONVERSATIONS = 'POLL_NEW_CONVERSATIONS'
export const UPDATE_LAST_POLL_TIME = 'UPDATE_LAST_POLL_TIME'

export const startMessagePolling = () => ({
  type: START_MESSAGE_POLLING,
})

export const stopMessagePolling = () => ({
  type: STOP_MESSAGE_POLLING,
})

export const pollActiveConversations = () => ({
  type: POLL_ACTIVE_CONVERSATIONS,
})

export const pollNewConversations = () => ({
  type: POLL_NEW_CONVERSATIONS,
})

export const updateLastPollTime = (username, timestamp) => ({
  type: UPDATE_LAST_POLL_TIME,
  payload: { username, timestamp },
})

// ========================================
// Settings Actions
// ========================================

export const UPDATE_MESSAGE_SETTINGS = 'UPDATE_MESSAGE_SETTINGS'
export const TOGGLE_NOTIFICATIONS = 'TOGGLE_NOTIFICATIONS'
export const SET_TRANSFER_AMOUNT = 'SET_TRANSFER_AMOUNT'
export const TOGGLE_SOUND = 'TOGGLE_SOUND'
export const TOGGLE_AUTO_READ_RECEIPTS = 'TOGGLE_AUTO_READ_RECEIPTS'

export const updateMessageSettings = (settings) => ({
  type: UPDATE_MESSAGE_SETTINGS,
  payload: settings,
})

export const toggleNotifications = () => ({
  type: TOGGLE_NOTIFICATIONS,
})

export const setTransferAmount = (amount) => ({
  type: SET_TRANSFER_AMOUNT,
  payload: { amount },
})

export const toggleSound = () => ({
  type: TOGGLE_SOUND,
})

export const toggleAutoReadReceipts = () => ({
  type: TOGGLE_AUTO_READ_RECEIPTS,
})

// ========================================
// Error and Loading Actions
// ========================================

export const SET_LOADING = 'SET_LOADING'
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export const setLoading = (isLoading, operation = null) => ({
  type: SET_LOADING,
  payload: { isLoading, operation },
})

export const setError = (error, operation = null) => ({
  type: SET_ERROR,
  payload: { error, operation },
})

export const clearError = () => ({
  type: CLEAR_ERROR,
})

// ========================================
// Cache Actions
// ========================================

export const UPDATE_MEMO_KEY_CACHE = 'UPDATE_MEMO_KEY_CACHE'
export const CLEAR_MEMO_KEY_CACHE = 'CLEAR_MEMO_KEY_CACHE'
export const UPDATE_LAST_FETCHED_BLOCK = 'UPDATE_LAST_FETCHED_BLOCK'

export const updateMemoKeyCache = (username, memoKey) => ({
  type: UPDATE_MEMO_KEY_CACHE,
  payload: { username, memoKey },
})

export const clearMemoKeyCache = (username = null) => ({
  type: CLEAR_MEMO_KEY_CACHE,
  payload: { username },
})

export const updateLastFetchedBlock = (username, blockNum) => ({
  type: UPDATE_LAST_FETCHED_BLOCK,
  payload: { username, blockNum },
})
