/**
 * Blockchain Interface Service for D.Buzz Messaging System
 *
 * Handles all interactions with the Hive blockchain for messaging:
 * - Fetching account history
 * - Filtering operations for messages
 * - Parsing blockchain operations
 * - Managing block-based pagination
 *
 * @module services/chat/blockchain
 */

import { api } from '@hiveio/hive-js'
import { ChainTypes, makeBitMaskFilter } from '@hiveio/hive-js/lib/auth/serializer'
import { apiCallWithFailover } from 'services/api'
import {
  parseTransferOperation,
  parseCustomJsonOperation,
  parseReadReceiptOperation,
  parseTypingIndicatorOperation,
  CUSTOM_JSON_ID,
  MESSAGE_PREFIX,
} from './operations'

/**
 * Fetch account history with operation filtering
 *
 * @param {string} account - Account username
 * @param {number} start - Start index (-1 for most recent)
 * @param {number} limit - Number of operations to fetch (max 1000)
 * @param {Array<number>} operationTypes - Array of operation type IDs to filter
 * @returns {Promise<Array>} Account history operations
 */
export const fetchAccountHistory = async (account, start = -1, limit = 100, operationTypes = []) => {
  try {
    const op = ChainTypes.operations

    // Create bit mask filter for operation types
    let filter = [0xFFFFFFFF, 0xFFFFFFFF] // All operations if no filter specified

    if (operationTypes && operationTypes.length > 0) {
      filter = makeBitMaskFilter(operationTypes)
    }

    const history = await apiCallWithFailover(() =>
      api.getAccountHistoryAsync(account, start, limit, filter[0], filter[1])
    )

    return history || []
  } catch (error) {
    console.error(`Failed to fetch account history for ${account}:`, error)
    throw error
  }
}

/**
 * Fetch transfer operations for message discovery
 * Used for detecting new conversations via incoming transfers
 *
 * @param {string} account - Account username
 * @param {number} startBlock - Block number to start from (for incremental fetching)
 * @param {number} limit - Number of operations to fetch
 * @returns {Promise<Array>} Parsed transfer messages
 */
export const fetchTransferMessages = async (account, startBlock = null, limit = 100) => {
  try {
    const op = ChainTypes.operations
    const operationTypes = [op.transfer]

    const history = await fetchAccountHistory(account, -1, limit, operationTypes)

    const messages = []

    for (const [index, operation, timestamp, blockNum, trxId] of history) {
      // Skip operations before startBlock if specified
      if (startBlock && blockNum <= startBlock) {
        continue
      }

      const parsed = parseTransferOperation(operation)

      if (parsed) {
        messages.push({
          ...parsed,
          blockNum,
          txId: trxId,
          timestamp: new Date(timestamp).getTime(),
          index,
        })
      }
    }

    return messages
  } catch (error) {
    console.error(`Failed to fetch transfer messages for ${account}:`, error)
    return []
  }
}

/**
 * Fetch custom_json operations for ongoing conversations
 * Used for polling active conversations
 *
 * @param {string} account - Account username
 * @param {number} startBlock - Block number to start from (for incremental fetching)
 * @param {number} limit - Number of operations to fetch
 * @returns {Promise<Array>} Parsed custom_json messages
 */
export const fetchCustomJsonMessages = async (account, startBlock = null, limit = 100) => {
  try {
    const op = ChainTypes.operations
    const operationTypes = [op.custom_json]

    const history = await fetchAccountHistory(account, -1, limit, operationTypes)

    const messages = []

    for (const [index, operation, timestamp, blockNum, trxId] of history) {
      // Skip operations before startBlock if specified
      if (startBlock && blockNum <= startBlock) {
        continue
      }

      // Only process D.Buzz message operations
      if (operation[1].id === CUSTOM_JSON_ID) {
        const parsed = parseCustomJsonOperation(operation)

        if (parsed) {
          messages.push({
            ...parsed,
            blockNum,
            txId: trxId,
            timestamp: parsed.timestamp || new Date(timestamp).getTime(),
            index,
          })
        }
      }
    }

    return messages
  } catch (error) {
    console.error(`Failed to fetch custom_json messages for ${account}:`, error)
    return []
  }
}

/**
 * Fetch all message types (transfers and custom_json) for an account
 * Combines both operation types into a single sorted array
 *
 * @param {string} account - Account username
 * @param {number} startBlock - Block number to start from
 * @param {number} limit - Number of operations to fetch per type
 * @returns {Promise<Array>} Combined and sorted messages
 */
export const fetchAllMessages = async (account, startBlock = null, limit = 100) => {
  try {
    const [transfers, customJsons] = await Promise.all([
      fetchTransferMessages(account, startBlock, limit),
      fetchCustomJsonMessages(account, startBlock, limit),
    ])

    // Combine and sort by timestamp (oldest first)
    const allMessages = [...transfers, ...customJsons].sort((a, b) => a.timestamp - b.timestamp)

    return allMessages
  } catch (error) {
    console.error(`Failed to fetch all messages for ${account}:`, error)
    return []
  }
}

/**
 * Fetch messages between two specific users
 * Filters messages to only include those between the two accounts
 *
 * @param {string} user1 - First user's username
 * @param {string} user2 - Second user's username
 * @param {number} startBlock - Block number to start from
 * @param {number} limit - Number of operations to fetch
 * @returns {Promise<Array>} Messages between the two users
 */
export const fetchConversationMessages = async (user1, user2, startBlock = null, limit = 100) => {
  try {
    // Fetch messages from both users' account histories
    const [user1Messages, user2Messages] = await Promise.all([
      fetchAllMessages(user1, startBlock, limit),
      fetchAllMessages(user2, startBlock, limit),
    ])

    // Combine messages
    const allMessages = [...user1Messages, ...user2Messages]

    // Filter to only messages between these two users
    const conversationMessages = allMessages.filter((msg) => {
      return (
        (msg.from === user1 && msg.to === user2) ||
        (msg.from === user2 && msg.to === user1)
      )
    })

    // Remove duplicates (same message might appear in both histories)
    const uniqueMessages = removeDuplicateMessages(conversationMessages)

    // Sort by timestamp (oldest first)
    uniqueMessages.sort((a, b) => a.timestamp - b.timestamp)

    return uniqueMessages
  } catch (error) {
    console.error(`Failed to fetch conversation between ${user1} and ${user2}:`, error)
    return []
  }
}

/**
 * Remove duplicate messages from an array
 * Uses messageId or txId for deduplication
 *
 * @param {Array} messages - Array of message objects
 * @returns {Array} De-duplicated messages
 */
export const removeDuplicateMessages = (messages) => {
  const seen = new Set()
  const unique = []

  for (const message of messages) {
    const id = message.messageId || message.txId

    if (!seen.has(id)) {
      seen.add(id)
      unique.push(message)
    }
  }

  return unique
}

/**
 * Fetch new messages since a specific block number
 * Used for incremental polling
 *
 * @param {string} account - Account username
 * @param {number} lastBlockNum - Last block number processed
 * @param {number} limit - Maximum number of operations to fetch
 * @returns {Promise<Array>} New messages since lastBlockNum
 */
export const fetchNewMessages = async (account, lastBlockNum, limit = 100) => {
  try {
    const messages = await fetchAllMessages(account, lastBlockNum, limit)
    return messages
  } catch (error) {
    console.error(`Failed to fetch new messages for ${account}:`, error)
    return []
  }
}

/**
 * Fetch incoming transfers for conversation discovery
 * Filters for transfers TO the specified account with D.Buzz prefix
 *
 * @param {string} account - Account username
 * @param {number} startBlock - Block number to start from
 * @param {number} limit - Number of operations to fetch
 * @returns {Promise<Array>} Incoming message transfers
 */
export const fetchIncomingTransfers = async (account, startBlock = null, limit = 100) => {
  try {
    const transfers = await fetchTransferMessages(account, startBlock, limit)

    // Filter for incoming transfers only (TO this account)
    const incoming = transfers.filter((transfer) => transfer.to === account)

    return incoming
  } catch (error) {
    console.error(`Failed to fetch incoming transfers for ${account}:`, error)
    return []
  }
}

/**
 * Fetch read receipts for messages
 *
 * @param {string} account - Account username
 * @param {number} startBlock - Block number to start from
 * @param {number} limit - Number of operations to fetch
 * @returns {Promise<Array>} Read receipt operations
 */
export const fetchReadReceipts = async (account, startBlock = null, limit = 100) => {
  try {
    const op = ChainTypes.operations
    const history = await fetchAccountHistory(account, -1, limit, [op.custom_json])

    const receipts = []

    for (const [index, operation, timestamp, blockNum, trxId] of history) {
      if (startBlock && blockNum <= startBlock) {
        continue
      }

      const parsed = parseReadReceiptOperation(operation)

      if (parsed) {
        receipts.push({
          ...parsed,
          blockNum,
          timestamp: parsed.timestamp || new Date(timestamp).getTime(),
        })
      }
    }

    return receipts
  } catch (error) {
    console.error(`Failed to fetch read receipts for ${account}:`, error)
    return []
  }
}

/**
 * Fetch typing indicators
 *
 * @param {string} account - Account username
 * @param {number} startBlock - Block number to start from
 * @param {number} limit - Number of operations to fetch
 * @returns {Promise<Array>} Typing indicator operations
 */
export const fetchTypingIndicators = async (account, startBlock = null, limit = 50) => {
  try {
    const op = ChainTypes.operations
    const history = await fetchAccountHistory(account, -1, limit, [op.custom_json])

    const indicators = []

    for (const [index, operation, timestamp, blockNum, trxId] of history) {
      if (startBlock && blockNum <= startBlock) {
        continue
      }

      const parsed = parseTypingIndicatorOperation(operation)

      if (parsed) {
        indicators.push({
          ...parsed,
          blockNum,
          timestamp: parsed.timestamp || new Date(timestamp).getTime(),
        })
      }
    }

    return indicators
  } catch (error) {
    console.error(`Failed to fetch typing indicators for ${account}:`, error)
    return []
  }
}

/**
 * Get the latest block number from an array of messages
 * Used for tracking incremental fetch position
 *
 * @param {Array} messages - Array of message objects
 * @returns {number|null} Latest block number or null if no messages
 */
export const getLatestBlockNum = (messages) => {
  if (!messages || messages.length === 0) {
    return null
  }

  return Math.max(...messages.map((msg) => msg.blockNum))
}

/**
 * Estimate Resource Credits cost for an operation
 * This is approximate and may not reflect actual cost
 *
 * @param {string} operationType - 'transfer' or 'custom_json'
 * @param {string} username - Username for RC calculation
 * @returns {Promise<number>} Estimated RC cost
 */
export const estimateRCCost = async (operationType, username) => {
  try {
    // These are rough estimates based on typical operation sizes
    // Actual costs vary based on operation size and network state
    const estimates = {
      transfer: 300000, // ~0.3M RC
      custom_json: 100000, // ~0.1M RC (smaller)
      read_receipt: 80000, // ~0.08M RC (batch multiple messages)
      typing: 50000, // ~0.05M RC (very small)
    }

    return estimates[operationType] || 100000
  } catch (error) {
    console.error('Failed to estimate RC cost:', error)
    return 100000 // Default estimate
  }
}

/**
 * Check if user has sufficient RC for an operation
 *
 * @param {string} username - Username to check
 * @param {string} operationType - Type of operation
 * @returns {Promise<boolean>} True if user has sufficient RC
 */
export const checkSufficientRC = async (username, operationType) => {
  try {
    const accounts = await apiCallWithFailover(() =>
      api.getAccountsAsync([username])
    )

    if (!accounts || accounts.length === 0) {
      return false
    }

    const account = accounts[0]

    // Get RC mana
    // This is simplified - actual RC calculation is more complex
    const currentMana = parseInt(account.voting_manabar?.current_mana || 0)
    const estimatedCost = await estimateRCCost(operationType, username)

    return currentMana > estimatedCost
  } catch (error) {
    console.error(`Failed to check RC for ${username}:`, error)
    return true // Assume sufficient RC on error to allow attempting the operation
  }
}

/**
 * Get conversation summary from messages
 * Groups messages by conversation partner
 *
 * @param {string} currentUser - Current user's username
 * @param {Array} messages - Array of all messages
 * @returns {Array} Conversation summaries
 */
export const getConversationSummaries = (currentUser, messages) => {
  const conversations = new Map()

  for (const message of messages) {
    // Determine conversation partner
    const partner = message.from === currentUser ? message.to : message.from

    if (!conversations.has(partner)) {
      conversations.set(partner, {
        partner,
        lastMessage: message,
        lastTimestamp: message.timestamp,
        lastBlockNum: message.blockNum,
        messageCount: 1,
      })
    } else {
      const conv = conversations.get(partner)
      conv.messageCount++

      // Update if this is a more recent message
      if (message.timestamp > conv.lastTimestamp) {
        conv.lastMessage = message
        conv.lastTimestamp = message.timestamp
        conv.lastBlockNum = message.blockNum
      }
    }
  }

  // Convert to array and sort by most recent activity
  return Array.from(conversations.values()).sort((a, b) => b.lastTimestamp - a.lastTimestamp)
}

export default {
  fetchAccountHistory,
  fetchTransferMessages,
  fetchCustomJsonMessages,
  fetchAllMessages,
  fetchConversationMessages,
  fetchNewMessages,
  fetchIncomingTransfers,
  fetchReadReceipts,
  fetchTypingIndicators,
  removeDuplicateMessages,
  getLatestBlockNum,
  estimateRCCost,
  checkSufficientRC,
  getConversationSummaries,
}
