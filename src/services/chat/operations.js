/**
 * Message Operations Service for D.Buzz Messaging System
 *
 * Generates blockchain operations for sending messages via:
 * - Transfer operations (for new conversations with 0.001 HIVE)
 * - Custom JSON operations (for ongoing conversations with RC only)
 *
 * @module services/chat/operations
 */

import { v4 as uuidv4 } from 'uuid'
import appConfig from 'config'

// Application identifier for D.Buzz messaging
const APP_ID = 'dbuzz/1.0.0'
const CUSTOM_JSON_ID = 'dbuzz_dm'
const TRANSFER_AMOUNT = '0.001 HIVE'
const MESSAGE_PREFIX = 'DBUZZ:'

/**
 * Generate a transfer operation for sending a message
 * Used for initiating new conversations or re-awakening inactive ones
 *
 * @param {string} from - Sender username
 * @param {string} to - Recipient username
 * @param {string} encryptedMessage - Encrypted message content (with # prefix)
 * @param {string} [amount] - Transfer amount (default: 0.001 HIVE)
 * @returns {Array} Blockchain transfer operation
 */
export const generateTransferMessageOperation = (from, to, encryptedMessage, amount = TRANSFER_AMOUNT) => {
  if (!from || !to) {
    throw new Error('Sender and recipient usernames are required')
  }

  if (!encryptedMessage) {
    throw new Error('Encrypted message is required')
  }

  // Ensure encrypted message has # prefix
  const memo = encryptedMessage.startsWith('#')
    ? `${MESSAGE_PREFIX} ${encryptedMessage}`
    : `${MESSAGE_PREFIX} #${encryptedMessage}`

  const operation = [
    'transfer',
    {
      from,
      to,
      amount,
      memo,
    },
  ]

  return [operation]
}

/**
 * Generate a custom_json operation for sending a message
 * Used for ongoing conversations (cost-efficient, RC only)
 *
 * @param {string} from - Sender username
 * @param {string} to - Recipient username
 * @param {string} encryptedMessage - Encrypted message content (with # prefix)
 * @param {string} [replyTo] - Optional message ID this is replying to
 * @returns {Array} Blockchain custom_json operation
 */
export const generateCustomJsonMessageOperation = (from, to, encryptedMessage, replyTo = null) => {
  if (!from || !to) {
    throw new Error('Sender and recipient usernames are required')
  }

  if (!encryptedMessage) {
    throw new Error('Encrypted message is required')
  }

  // Generate unique message ID
  const messageId = uuidv4()
  const timestamp = Date.now()

  // Prepare JSON payload
  const jsonPayload = {
    app: APP_ID,
    v: 1, // Version
    type: 'message',
    from,
    to,
    encrypted_content: encryptedMessage,
    timestamp,
    message_id: messageId,
  }

  // Add reply_to if provided
  if (replyTo) {
    jsonPayload.reply_to = replyTo
  }

  const operation = [
    'custom_json',
    {
      required_auths: [],
      required_posting_auths: [from],
      id: CUSTOM_JSON_ID,
      json: JSON.stringify(jsonPayload),
    },
  ]

  return [operation]
}

/**
 * Generate a read receipt custom_json operation
 * Batch multiple message IDs to save RC
 *
 * @param {string} username - User marking messages as read
 * @param {Array<string>} messageIds - Array of message IDs to mark as read
 * @returns {Array} Blockchain custom_json operation
 */
export const generateReadReceiptOperation = (username, messageIds) => {
  if (!username) {
    throw new Error('Username is required')
  }

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    throw new Error('At least one message ID is required')
  }

  const timestamp = Date.now()

  const jsonPayload = {
    app: APP_ID,
    v: 1,
    type: 'read_receipt',
    read_by: username,
    message_ids: messageIds,
    timestamp,
  }

  const operation = [
    'custom_json',
    {
      required_auths: [],
      required_posting_auths: [username],
      id: `${CUSTOM_JSON_ID}_read`,
      json: JSON.stringify(jsonPayload),
    },
  ]

  return [operation]
}

/**
 * Generate a typing indicator custom_json operation
 * Should be throttled to save RC (max once per 3-5 seconds)
 *
 * @param {string} from - User who is typing
 * @param {string} to - Recipient username
 * @returns {Array} Blockchain custom_json operation
 */
export const generateTypingIndicatorOperation = (from, to) => {
  if (!from || !to) {
    throw new Error('Sender and recipient usernames are required')
  }

  const timestamp = Date.now()

  const jsonPayload = {
    app: APP_ID,
    v: 1,
    type: 'typing',
    from,
    to,
    timestamp,
  }

  const operation = [
    'custom_json',
    {
      required_auths: [],
      required_posting_auths: [from],
      id: `${CUSTOM_JSON_ID}_typing`,
      json: JSON.stringify(jsonPayload),
    },
  ]

  return [operation]
}

/**
 * Generate an online status custom_json operation
 * Broadcasts user's online/active status
 *
 * @param {string} username - User's username
 * @param {string} status - Status: 'online' or 'offline'
 * @returns {Array} Blockchain custom_json operation
 */
export const generateOnlineStatusOperation = (username, status = 'online') => {
  if (!username) {
    throw new Error('Username is required')
  }

  if (!['online', 'offline'].includes(status)) {
    throw new Error('Status must be "online" or "offline"')
  }

  const timestamp = Date.now()

  const jsonPayload = {
    app: APP_ID,
    v: 1,
    type: 'status',
    username,
    status,
    timestamp,
  }

  const operation = [
    'custom_json',
    {
      required_auths: [],
      required_posting_auths: [username],
      id: `${CUSTOM_JSON_ID}_status`,
      json: JSON.stringify(jsonPayload),
    },
  ]

  return [operation]
}

/**
 * Determine whether to use transfer or custom_json for a message
 *
 * Decision logic:
 * - First message to user: Transfer
 * - Reply to existing conversation: Custom JSON
 * - Conversation inactive > 24h: Transfer (re-ping)
 * - Active conversation: Custom JSON
 *
 * @param {boolean} isFirstMessage - Is this the first message to this user?
 * @param {number} [lastActivityTimestamp] - Timestamp of last message in conversation
 * @param {boolean} [forcePriority] - Force using transfer for priority delivery
 * @returns {string} 'transfer' or 'custom_json'
 */
export const determineOperationType = (
  isFirstMessage,
  lastActivityTimestamp = null,
  forcePriority = false
) => {
  // Always use transfer for first message
  if (isFirstMessage) {
    return 'transfer'
  }

  // User explicitly requests priority delivery
  if (forcePriority) {
    return 'transfer'
  }

  // Check if conversation has been inactive for more than 24 hours
  if (lastActivityTimestamp) {
    const hoursSinceLastActivity = (Date.now() - lastActivityTimestamp) / (1000 * 60 * 60)
    if (hoursSinceLastActivity > 24) {
      return 'transfer'
    }
  }

  // Default to custom_json for ongoing conversations
  return 'custom_json'
}

/**
 * Parse a transfer operation to extract message data
 *
 * @param {Object} operation - The transfer operation from blockchain
 * @returns {Object|null} Parsed message data or null if not a D.Buzz message
 */
export const parseTransferOperation = (operation) => {
  try {
    if (!operation || operation[0] !== 'transfer') {
      return null
    }

    const { from, to, amount, memo } = operation[1]

    // Check if this is a D.Buzz message transfer
    if (!memo || !memo.includes(MESSAGE_PREFIX)) {
      return null
    }

    // Extract encrypted content (remove DBUZZ: prefix)
    const encryptedContent = memo.replace(MESSAGE_PREFIX, '').trim()

    return {
      type: 'transfer',
      from,
      to,
      amount,
      encryptedContent,
      timestamp: null, // Will be set from blockchain timestamp
      messageId: null, // Transfer messages use txId as messageId
    }
  } catch (error) {
    console.error('Failed to parse transfer operation:', error)
    return null
  }
}

/**
 * Parse a custom_json operation to extract message data
 *
 * @param {Object} operation - The custom_json operation from blockchain
 * @returns {Object|null} Parsed message data or null if not a D.Buzz message
 */
export const parseCustomJsonOperation = (operation) => {
  try {
    if (!operation || operation[0] !== 'custom_json') {
      return null
    }

    const { id, json, required_posting_auths } = operation[1]

    // Check if this is a D.Buzz message
    if (id !== CUSTOM_JSON_ID) {
      return null
    }

    const payload = JSON.parse(json)

    // Validate payload structure
    if (payload.type !== 'message' || !payload.from || !payload.to || !payload.encrypted_content) {
      return null
    }

    return {
      type: 'custom_json',
      from: payload.from,
      to: payload.to,
      encryptedContent: payload.encrypted_content,
      timestamp: payload.timestamp,
      messageId: payload.message_id,
      replyTo: payload.reply_to || null,
    }
  } catch (error) {
    console.error('Failed to parse custom_json operation:', error)
    return null
  }
}

/**
 * Parse a read receipt operation
 *
 * @param {Object} operation - The custom_json operation from blockchain
 * @returns {Object|null} Parsed read receipt data or null
 */
export const parseReadReceiptOperation = (operation) => {
  try {
    if (!operation || operation[0] !== 'custom_json') {
      return null
    }

    const { id, json } = operation[1]

    if (id !== `${CUSTOM_JSON_ID}_read`) {
      return null
    }

    const payload = JSON.parse(json)

    if (payload.type !== 'read_receipt') {
      return null
    }

    return {
      type: 'read_receipt',
      readBy: payload.read_by,
      messageIds: payload.message_ids,
      timestamp: payload.timestamp,
    }
  } catch (error) {
    console.error('Failed to parse read receipt operation:', error)
    return null
  }
}

/**
 * Parse a typing indicator operation
 *
 * @param {Object} operation - The custom_json operation from blockchain
 * @returns {Object|null} Parsed typing indicator data or null
 */
export const parseTypingIndicatorOperation = (operation) => {
  try {
    if (!operation || operation[0] !== 'custom_json') {
      return null
    }

    const { id, json } = operation[1]

    if (id !== `${CUSTOM_JSON_ID}_typing`) {
      return null
    }

    const payload = JSON.parse(json)

    if (payload.type !== 'typing') {
      return null
    }

    return {
      type: 'typing',
      from: payload.from,
      to: payload.to,
      timestamp: payload.timestamp,
    }
  } catch (error) {
    console.error('Failed to parse typing indicator operation:', error)
    return null
  }
}

/**
 * Validate operation structure before broadcasting
 *
 * @param {Array} operation - The operation to validate
 * @returns {boolean} True if valid
 * @throws {Error} If invalid
 */
export const validateOperation = (operation) => {
  if (!Array.isArray(operation) || operation.length === 0) {
    throw new Error('Operation must be a non-empty array')
  }

  const [opType, opData] = operation[0]

  if (opType === 'transfer') {
    if (!opData.from || !opData.to || !opData.amount || !opData.memo) {
      throw new Error('Invalid transfer operation: missing required fields')
    }
  } else if (opType === 'custom_json') {
    if (!opData.id || !opData.json || !Array.isArray(opData.required_posting_auths)) {
      throw new Error('Invalid custom_json operation: missing required fields')
    }
  } else {
    throw new Error(`Unsupported operation type: ${opType}`)
  }

  return true
}

export default {
  generateTransferMessageOperation,
  generateCustomJsonMessageOperation,
  generateReadReceiptOperation,
  generateTypingIndicatorOperation,
  generateOnlineStatusOperation,
  determineOperationType,
  parseTransferOperation,
  parseCustomJsonOperation,
  parseReadReceiptOperation,
  parseTypingIndicatorOperation,
  validateOperation,
  MESSAGE_PREFIX,
  CUSTOM_JSON_ID,
  APP_ID,
}
