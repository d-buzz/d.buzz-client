/**
 * Redux Sagas for D.Buzz Messaging System
 *
 * Handles all async operations for messaging:
 * - Sending messages
 * - Fetching messages and conversations
 * - Polling for new messages
 * - Broadcasting operations to blockchain
 *
 * @module store/chat/sagas
 */

import { takeEvery, takeLatest, put, call, select, delay, fork, cancel, take } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'
import {
  // Action types
  SEND_MESSAGE_REQUEST,
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_MESSAGES_REQUEST,
  MARK_MESSAGES_READ_REQUEST,
  SEND_TYPING_INDICATOR,
  START_MESSAGE_POLLING,
  STOP_MESSAGE_POLLING,
  POLL_ACTIVE_CONVERSATIONS,
  POLL_NEW_CONVERSATIONS,
  OPEN_CHAT,
  // Action creators
  sendMessageSuccess,
  sendMessageFailure,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  markMessagesReadSuccess,
  addOptimisticMessage,
  confirmMessage,
  messageFailed,
  receiveMessage,
  receiveMessagesBatch,
  newConversationDetected,
  updateConversationMessages,
  updateLastPollTime,
  updateLastFetchedBlock,
  updateMemoKeyCache,
  setLoading,
  setError,
  clearError,
  markMessagesRead,
} from './actions'

// Services
import {
  encryptMessage,
  decryptMessage,
  encryptMessageWithKeychain,
  decryptMessageWithKeychain,
  isKeychainAvailable,
  fetchPublicMemoKey,
  batchDecryptMessages,
} from 'services/chat/encryption'

import {
  generateTransferMessageOperation,
  generateCustomJsonMessageOperation,
  generateReadReceiptOperation,
  generateTypingIndicatorOperation,
  determineOperationType,
} from 'services/chat/operations'

import {
  fetchConversationMessages,
  fetchAllMessages,
  fetchIncomingTransfers,
  fetchNewMessages,
  getConversationSummaries,
  getLatestBlockNum,
} from 'services/chat/blockchain'

import {
  broadcastOperation,
  broadcastKeychainOperation,
  extractLoginData,
} from 'services/api'

/**
 * Selectors
 */
const getCurrentUser = (state) => state.auth.get('user')
const getConversations = (state) => state.chat.get('conversations')
const getMessages = (state, username) => state.chat.getIn(['messages', username])
const getLastFetchedBlock = (state, username) => state.chat.getIn(['lastFetchedBlocks', username])
const getActiveChats = (state) => state.chat.get('activeChats')
const getMemoKeyCache = (state, username) => state.chat.getIn(['memoKeys', username])
const getSettings = (state) => state.chat.get('settings')

/**
 * Send Message Saga
 * Handles the complete flow of sending a message
 */
export function* sendMessageSaga(action) {
  const { recipient, content, options = {} } = action.payload
  const meta = action.meta

  try {
    yield put(setLoading(true, 'sending'))
    yield put(clearError())

    // Get current user
    const currentUser = yield select(getCurrentUser)
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const username = currentUser.get('username')
    const useKeychain = currentUser.get('useKeychain')

    // Generate temporary ID for optimistic update
    const tempId = uuidv4()
    const timestamp = Date.now()

    // Add optimistic message to UI
    yield put(addOptimisticMessage({
      recipient,
      tempId,
      content,
      timestamp,
    }))

    // Fetch recipient's public memo key
    let recipientPublicKey = yield select(getMemoKeyCache, recipient)
    if (!recipientPublicKey || (Date.now() - recipientPublicKey.get('timestamp') > 24 * 60 * 60 * 1000)) {
      recipientPublicKey = yield call(fetchPublicMemoKey, recipient)
      yield put(updateMemoKeyCache(recipient, recipientPublicKey))
    } else {
      recipientPublicKey = recipientPublicKey.get('key')
    }

    // Encrypt message
    let encryptedContent
    if (useKeychain && isKeychainAvailable()) {
      encryptedContent = yield call(encryptMessageWithKeychain, content, username, recipient, recipientPublicKey)
    } else {
      // Get private memo key from user credentials
      let loginData = currentUser.get('login_data')
      loginData = extractLoginData(loginData)
      const privateMemoKey = loginData[1] // This is simplified - actual implementation may vary

      encryptedContent = yield call(encryptMessage, content, privateMemoKey, recipientPublicKey)
    }

    // Determine operation type (transfer vs custom_json)
    const conversations = yield select(getConversations)
    const conversation = conversations.get(recipient)
    const isFirstMessage = !conversation
    const lastActivityTimestamp = conversation ? conversation.get('lastActivity') : null

    const operationType = determineOperationType(
      isFirstMessage,
      lastActivityTimestamp,
      options.forcePriority
    )

    // Generate operation
    let operation
    if (operationType === 'transfer') {
      const settings = yield select(getSettings)
      const transferAmount = settings.get('transferAmount') || '0.001 HIVE'
      operation = generateTransferMessageOperation(username, recipient, encryptedContent, transferAmount)
    } else {
      operation = generateCustomJsonMessageOperation(username, recipient, encryptedContent, options.replyTo)
    }

    // Broadcast operation
    let result
    if (useKeychain && isKeychainAvailable()) {
      result = yield call(broadcastKeychainOperation, username, operation, 'Posting')
    } else {
      let loginData = currentUser.get('login_data')
      loginData = extractLoginData(loginData)
      const privateKey = loginData[1]
      result = yield call(broadcastOperation, operation, [privateKey])
    }

    // Confirm message
    const confirmedMessage = {
      messageId: result.id || tempId,
      from: username,
      to: recipient,
      content,
      encryptedContent,
      timestamp,
      txId: result.id,
      type: operationType,
    }

    yield put(confirmMessage(tempId, confirmedMessage))
    yield put(sendMessageSuccess({ message: confirmedMessage }, meta))

    // Update conversation if first message
    if (isFirstMessage) {
      yield put(newConversationDetected({
        partner: recipient,
        lastMessage: confirmedMessage,
        lastActivity: timestamp,
        unreadCount: 0,
        status: 'active',
      }))
    }

    yield put(setLoading(false, 'sending'))
  } catch (error) {
    console.error('Send message failed:', error)
    yield put(messageFailed(action.payload.tempId || uuidv4(), error.message))
    yield put(sendMessageFailure(error.message, meta))
    yield put(setError(error.message, 'sending'))
    yield put(setLoading(false, 'sending'))
  }
}

/**
 * Fetch Conversations Saga
 * Loads all conversations for the current user
 */
export function* fetchConversationsSaga(action) {
  const meta = action.meta

  try {
    yield put(setLoading(true, 'conversations'))
    yield put(clearError())

    // Get current user
    const currentUser = yield select(getCurrentUser)
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const username = currentUser.get('username')

    // Fetch all messages for the user
    const messages = yield call(fetchAllMessages, username, null, 200)

    // Group messages into conversations
    const conversationSummaries = getConversationSummaries(username, messages)

    // Convert to conversation objects
    const conversations = {}
    for (const summary of conversationSummaries) {
      conversations[summary.partner] = {
        partner: summary.partner,
        lastMessage: summary.lastMessage,
        lastActivity: summary.lastTimestamp,
        unreadCount: 0, // Will be calculated based on read status
        lastFetchedBlock: summary.lastBlockNum,
        status: 'active',
        notifications: 'all',
        isPinned: false,
      }

      // Update last fetched block
      yield put(updateLastFetchedBlock(summary.partner, summary.lastBlockNum))
    }

    yield put(fetchConversationsSuccess(conversations, meta))
    yield put(setLoading(false, 'conversations'))
  } catch (error) {
    console.error('Fetch conversations failed:', error)
    yield put(fetchConversationsFailure(error.message, meta))
    yield put(setError(error.message, 'conversations'))
    yield put(setLoading(false, 'conversations'))
  }
}

/**
 * Fetch Messages Saga
 * Loads message history for a specific conversation
 */
export function* fetchMessagesSaga(action) {
  const { username: partner } = action.payload
  const meta = action.meta

  try {
    yield put(setLoading(true, 'messages'))
    yield put(clearError())

    // Get current user
    const currentUser = yield select(getCurrentUser)
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    const username = currentUser.get('username')
    const useKeychain = currentUser.get('useKeychain')

    // Fetch messages between current user and partner
    const rawMessages = yield call(fetchConversationMessages, username, partner, null, 100)

    // Decrypt messages
    let decryptedMessages
    if (useKeychain && isKeychainAvailable()) {
      // Decrypt each message with Keychain
      decryptedMessages = []
      for (const msg of rawMessages) {
        const isIncoming = msg.from === partner
        const otherUser = isIncoming ? msg.from : msg.to

        const decrypted = yield call(
          decryptMessageWithKeychain,
          msg.encryptedContent,
          username,
          otherUser
        )

        decryptedMessages.push({
          ...msg,
          content: decrypted,
        })
      }
    } else {
      // Decrypt with private key
      let loginData = currentUser.get('login_data')
      loginData = extractLoginData(loginData)
      const privateMemoKey = loginData[1]

      // Fetch partner's public key
      const partnerPublicKey = yield call(fetchPublicMemoKey, partner)

      // Batch decrypt
      const senderPublicKeys = new Map([[partner, partnerPublicKey]])
      decryptedMessages = yield call(batchDecryptMessages, rawMessages, privateMemoKey, senderPublicKeys)
    }

    yield put(fetchMessagesSuccess({ username: partner, messages: decryptedMessages }, meta))

    // Update last fetched block
    const latestBlock = getLatestBlockNum(rawMessages)
    if (latestBlock) {
      yield put(updateLastFetchedBlock(partner, latestBlock))
    }

    yield put(setLoading(false, 'messages'))
  } catch (error) {
    console.error('Fetch messages failed:', error)
    yield put(fetchMessagesFailure(error.message, meta))
    yield put(setError(error.message, 'messages'))
    yield put(setLoading(false, 'messages'))
  }
}

/**
 * Mark Messages Read Saga
 * Marks messages as read and optionally broadcasts read receipt
 */
export function* markMessagesReadSaga(action) {
  const { username, messageIds } = action.payload
  const meta = action.meta

  try {
    // Mark as read in local state
    yield put(markMessagesRead(username))

    // Check if auto read receipts are enabled
    const settings = yield select(getSettings)
    const autoReadReceipts = settings.get('autoReadReceipts')

    if (autoReadReceipts && messageIds && messageIds.length > 0) {
      // Get current user
      const currentUser = yield select(getCurrentUser)
      const currentUsername = currentUser.get('username')
      const useKeychain = currentUser.get('useKeychain')

      // Generate read receipt operation
      const operation = generateReadReceiptOperation(currentUsername, messageIds)

      // Broadcast (optional, may skip to save RC)
      if (useKeychain && isKeychainAvailable()) {
        yield call(broadcastKeychainOperation, currentUsername, operation, 'Posting')
      } else {
        let loginData = currentUser.get('login_data')
        loginData = extractLoginData(loginData)
        const privateKey = loginData[1]
        yield call(broadcastOperation, operation, [privateKey])
      }
    }

    yield put(markMessagesReadSuccess({ username }, meta))
  } catch (error) {
    console.error('Mark messages read failed:', error)
    // Don't fail the action if read receipt broadcast fails
    yield put(markMessagesReadSuccess({ username }, meta))
  }
}

/**
 * Send Typing Indicator Saga
 * Broadcasts typing indicator (throttled)
 */
export function* sendTypingIndicatorSaga(action) {
  const { recipient } = action.payload

  try {
    const currentUser = yield select(getCurrentUser)
    const username = currentUser.get('username')
    const useKeychain = currentUser.get('useKeychain')

    const operation = generateTypingIndicatorOperation(username, recipient)

    // Broadcast (fire and forget, don't wait)
    if (useKeychain && isKeychainAvailable()) {
      yield fork(broadcastKeychainOperation, username, operation, 'Posting')
    } else {
      let loginData = currentUser.get('login_data')
      loginData = extractLoginData(loginData)
      const privateKey = loginData[1]
      yield fork(broadcastOperation, operation, [privateKey])
    }
  } catch (error) {
    // Silently fail for typing indicators
    console.warn('Typing indicator failed:', error)
  }
}

/**
 * Poll Active Conversations Saga
 * Polls for new messages in open chat windows
 */
export function* pollActiveConversationsSaga() {
  while (true) {
    try {
      const activeChats = yield select(getActiveChats)
      const currentUser = yield select(getCurrentUser)

      if (!currentUser || !activeChats || activeChats.size === 0) {
        yield delay(10000)
        continue
      }

      const username = currentUser.get('username')

      // Poll each active conversation
      for (const partner of activeChats.toJS()) {
        try {
          const lastBlockNum = yield select(getLastFetchedBlock, partner)
          const newMessages = yield call(fetchNewMessages, partner, lastBlockNum, 50)

          if (newMessages.length > 0) {
            // Decrypt and add messages
            yield put(receiveMessagesBatch(newMessages))

            // Update last fetched block
            const latestBlock = getLatestBlockNum(newMessages)
            if (latestBlock) {
              yield put(updateLastFetchedBlock(partner, latestBlock))
            }
          }

          yield put(updateLastPollTime(partner, Date.now()))
        } catch (error) {
          console.error(`Polling failed for ${partner}:`, error)
        }
      }

      yield delay(10000) // Poll every 10 seconds
    } catch (error) {
      console.error('Active conversation polling error:', error)
      yield delay(10000)
    }
  }
}

/**
 * Poll New Conversations Saga
 * Polls for new incoming transfer messages
 */
export function* pollNewConversationsSaga() {
  while (true) {
    try {
      const currentUser = yield select(getCurrentUser)

      if (!currentUser) {
        yield delay(30000)
        continue
      }

      const username = currentUser.get('username')
      const lastGlobalBlock = yield select(getLastFetchedBlock, '__global__')

      // Fetch incoming transfers
      const incomingTransfers = yield call(fetchIncomingTransfers, username, lastGlobalBlock, 50)

      if (incomingTransfers.length > 0) {
        // Group by sender
        const bySender = {}
        for (const transfer of incomingTransfers) {
          const sender = transfer.from
          if (!bySender[sender]) {
            bySender[sender] = []
          }
          bySender[sender].push(transfer)
        }

        // Create new conversations for senders we haven't seen
        const conversations = yield select(getConversations)
        for (const sender of Object.keys(bySender)) {
          if (!conversations.has(sender)) {
            const messages = bySender[sender]
            const lastMessage = messages[messages.length - 1]

            yield put(newConversationDetected({
              partner: sender,
              lastMessage,
              lastActivity: lastMessage.timestamp,
              unreadCount: messages.length,
              status: 'active',
            }))
          }

          // Add messages
          yield put(receiveMessagesBatch(bySender[sender]))
        }

        // Update global last fetched block
        const latestBlock = getLatestBlockNum(incomingTransfers)
        if (latestBlock) {
          yield put(updateLastFetchedBlock('__global__', latestBlock))
        }
      }

      yield delay(30000) // Poll every 30 seconds
    } catch (error) {
      console.error('New conversation polling error:', error)
      yield delay(30000)
    }
  }
}

/**
 * Polling Manager Saga
 * Manages start/stop of polling tasks
 */
export function* pollingManagerSaga() {
  while (true) {
    const { payload } = yield take(START_MESSAGE_POLLING)

    // Start both polling sagas
    const activeConversationsTask = yield fork(pollActiveConversationsSaga)
    const newConversationsTask = yield fork(pollNewConversationsSaga)

    // Wait for stop signal
    yield take(STOP_MESSAGE_POLLING)

    // Cancel polling tasks
    yield cancel(activeConversationsTask)
    yield cancel(newConversationsTask)
  }
}

/**
 * Open Chat Saga
 * Handles opening a chat window (fetches messages if needed)
 */
export function* openChatSaga(action) {
  const { username } = action.payload

  try {
    // Check if we have messages for this user
    const messages = yield select(getMessages, username)

    // If no messages, fetch them
    if (!messages || messages.size === 0) {
      yield put({ type: FETCH_MESSAGES_REQUEST, payload: { username }, meta: { thunk: true } })
    }

    // Mark messages as read
    yield put(markMessagesRead(username))
  } catch (error) {
    console.error('Open chat failed:', error)
  }
}

/**
 * Root Saga
 * Combines all chat sagas
 */
export function* watchSendMessage() {
  yield takeEvery(SEND_MESSAGE_REQUEST, sendMessageSaga)
}

export function* watchFetchConversations() {
  yield takeLatest(FETCH_CONVERSATIONS_REQUEST, fetchConversationsSaga)
}

export function* watchFetchMessages() {
  yield takeLatest(FETCH_MESSAGES_REQUEST, fetchMessagesSaga)
}

export function* watchMarkMessagesRead() {
  yield takeEvery(MARK_MESSAGES_READ_REQUEST, markMessagesReadSaga)
}

export function* watchSendTypingIndicator() {
  yield takeLatest(SEND_TYPING_INDICATOR, sendTypingIndicatorSaga)
}

export function* watchOpenChat() {
  yield takeEvery(OPEN_CHAT, openChatSaga)
}

export function* watchPolling() {
  yield fork(pollingManagerSaga)
}
