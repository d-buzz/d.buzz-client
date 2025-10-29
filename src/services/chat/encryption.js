/**
 * Encryption Service for D.Buzz Messaging System
 *
 * Handles all message encryption and decryption operations using Hive's
 * secp256k1 elliptic curve cryptography for end-to-end encrypted messaging.
 *
 * @module services/chat/encryption
 */

import { memo, PrivateKey } from '@hiveio/hive-js/lib/auth/ecc'
import { api } from '@hiveio/hive-js'
import { apiCallWithFailover } from 'services/api'

/**
 * Cache for public memo keys to reduce API calls
 * Structure: { username: { key: publicMemoKey, timestamp: fetchTime } }
 */
const memoKeyCache = new Map()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Fetch public memo key from blockchain with caching
 *
 * @param {string} username - The Hive username
 * @returns {Promise<string>} The public memo key
 * @throws {Error} If account not found or key fetch fails
 */
export const fetchPublicMemoKey = async (username) => {
  try {
    // Check cache first
    const cached = memoKeyCache.get(username)
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return cached.key
    }

    // Fetch from blockchain
    const accounts = await apiCallWithFailover(() =>
      api.getAccountsAsync([username])
    )

    if (!accounts || accounts.length === 0) {
      throw new Error(`Account ${username} not found`)
    }

    const publicMemoKey = accounts[0].memo_key

    if (!publicMemoKey) {
      throw new Error(`No memo key found for account ${username}`)
    }

    // Cache the key
    memoKeyCache.set(username, {
      key: publicMemoKey,
      timestamp: Date.now(),
    })

    return publicMemoKey
  } catch (error) {
    console.error(`Failed to fetch memo key for ${username}:`, error)
    throw error
  }
}

/**
 * Clear memo key cache for a specific user or entire cache
 *
 * @param {string} [username] - Optional username to clear specific cache entry
 */
export const clearMemoKeyCache = (username = null) => {
  if (username) {
    memoKeyCache.delete(username)
  } else {
    memoKeyCache.clear()
  }
}

/**
 * Encrypt message content using sender's private key and recipient's public key
 *
 * Uses Hive's memo encryption which implements:
 * - Elliptic Curve Diffie-Hellman (ECDH) for shared secret generation
 * - AES-256 encryption of message content
 * - Base64 encoding of encrypted bytes
 *
 * @param {string} message - The plain text message to encrypt
 * @param {string} senderPrivateMemoKey - Sender's private memo key (WIF format)
 * @param {string} recipientPublicMemoKey - Recipient's public memo key
 * @returns {string} Encrypted message with # prefix
 * @throws {Error} If encryption fails
 */
export const encryptMessage = (message, senderPrivateMemoKey, recipientPublicMemoKey) => {
  try {
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message: must be a non-empty string')
    }

    if (!senderPrivateMemoKey) {
      throw new Error('Sender private memo key is required')
    }

    if (!recipientPublicMemoKey) {
      throw new Error('Recipient public memo key is required')
    }

    // Convert WIF private key to PrivateKey object
    const privateKey = PrivateKey.fromWif(senderPrivateMemoKey)

    // Encrypt using Hive memo encryption
    // This automatically adds the # prefix
    const encryptedMessage = memo.encode(
      privateKey,
      recipientPublicMemoKey,
      message
    )

    return encryptedMessage
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error(`Failed to encrypt message: ${error.message}`)
  }
}

/**
 * Decrypt message content using recipient's private key
 *
 * @param {string} encryptedMessage - The encrypted message (with # prefix)
 * @param {string} recipientPrivateMemoKey - Recipient's private memo key (WIF format)
 * @param {string} senderPublicMemoKey - Sender's public memo key
 * @returns {string} Decrypted plain text message
 * @throws {Error} If decryption fails
 */
export const decryptMessage = (encryptedMessage, recipientPrivateMemoKey, senderPublicMemoKey) => {
  try {
    if (!encryptedMessage || typeof encryptedMessage !== 'string') {
      throw new Error('Invalid encrypted message')
    }

    if (!recipientPrivateMemoKey) {
      throw new Error('Recipient private memo key is required')
    }

    if (!senderPublicMemoKey) {
      throw new Error('Sender public memo key is required')
    }

    // Remove # prefix if present (memo.decode handles both formats)
    const messageToDecrypt = encryptedMessage.startsWith('#')
      ? encryptedMessage
      : `#${encryptedMessage}`

    // Convert WIF private key to PrivateKey object
    const privateKey = PrivateKey.fromWif(recipientPrivateMemoKey)

    // Decrypt using Hive memo decryption
    const decryptedMessage = memo.decode(
      privateKey,
      messageToDecrypt
    )

    return decryptedMessage
  } catch (error) {
    console.error('Decryption failed:', error)
    // Return placeholder instead of throwing to handle corrupted messages gracefully
    return '[Unable to decrypt message]'
  }
}

/**
 * Test if a message is encrypted (has # prefix)
 *
 * @param {string} message - The message to test
 * @returns {boolean} True if message appears to be encrypted
 */
export const isMessageEncrypted = (message) => {
  return typeof message === 'string' && message.startsWith('#')
}

/**
 * Validate a memo key format
 *
 * @param {string} key - The key to validate
 * @param {boolean} isPrivate - Whether this is a private key (WIF format)
 * @returns {boolean} True if key format is valid
 */
export const validateMemoKey = (key, isPrivate = false) => {
  if (!key || typeof key !== 'string') {
    return false
  }

  if (isPrivate) {
    // Private key in WIF format starts with 5
    return key.startsWith('5') && key.length >= 50 && key.length <= 52
  } else {
    // Public key starts with STM or TST (testnet)
    return (key.startsWith('STM') || key.startsWith('TST')) && key.length >= 50
  }
}

/**
 * Encrypt message for Hive Keychain
 * This function prepares the parameters for Keychain's requestEncode
 *
 * @param {string} message - The plain text message
 * @param {string} senderUsername - Sender's Hive username
 * @param {string} recipientUsername - Recipient's Hive username
 * @param {string} recipientPublicMemoKey - Recipient's public memo key
 * @returns {Promise<string>} Encrypted message
 */
export const encryptMessageWithKeychain = (message, senderUsername, recipientUsername, recipientPublicMemoKey) => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain not found. Please install the extension.'))
      return
    }

    window.hive_keychain.requestEncode(
      senderUsername,
      recipientUsername,
      message,
      'Memo',
      (response) => {
        if (response.success) {
          resolve(response.result)
        } else {
          reject(new Error(response.message || 'Keychain encryption failed'))
        }
      }
    )
  })
}

/**
 * Decrypt message using Hive Keychain
 * This function uses Keychain's requestDecode
 *
 * @param {string} encryptedMessage - The encrypted message (with # prefix)
 * @param {string} recipientUsername - Recipient's Hive username
 * @param {string} senderUsername - Sender's Hive username
 * @returns {Promise<string>} Decrypted message
 */
export const decryptMessageWithKeychain = (encryptedMessage, recipientUsername, senderUsername) => {
  return new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      reject(new Error('Hive Keychain not found. Please install the extension.'))
      return
    }

    // Remove # prefix for Keychain
    const messageToDecrypt = encryptedMessage.startsWith('#')
      ? encryptedMessage.substring(1)
      : encryptedMessage

    window.hive_keychain.requestDecode(
      recipientUsername,
      senderUsername,
      `#${messageToDecrypt}`,
      'Memo',
      (response) => {
        if (response.success) {
          resolve(response.result)
        } else {
          // Return placeholder instead of rejecting to handle errors gracefully
          resolve('[Unable to decrypt message]')
        }
      }
    )
  })
}

/**
 * Check if Hive Keychain is available
 *
 * @returns {boolean} True if Keychain is installed and ready
 */
export const isKeychainAvailable = () => {
  return typeof window !== 'undefined' && !!window.hive_keychain
}

/**
 * Batch decrypt multiple messages
 * Useful for decrypting message history
 *
 * @param {Array<Object>} messages - Array of message objects with encryptedContent
 * @param {string} recipientPrivateMemoKey - Recipient's private memo key
 * @param {Map<string, string>} senderPublicKeys - Map of sender username to public key
 * @returns {Promise<Array<Object>>} Messages with decrypted content
 */
export const batchDecryptMessages = async (messages, recipientPrivateMemoKey, senderPublicKeys) => {
  try {
    const decryptedMessages = await Promise.all(
      messages.map(async (message) => {
        try {
          const senderPublicKey = senderPublicKeys.get(message.from) ||
            await fetchPublicMemoKey(message.from)

          const decryptedContent = decryptMessage(
            message.encryptedContent,
            recipientPrivateMemoKey,
            senderPublicKey
          )

          return {
            ...message,
            content: decryptedContent,
          }
        } catch (error) {
          console.error(`Failed to decrypt message from ${message.from}:`, error)
          return {
            ...message,
            content: '[Unable to decrypt message]',
          }
        }
      })
    )

    return decryptedMessages
  } catch (error) {
    console.error('Batch decryption failed:', error)
    throw error
  }
}

export default {
  fetchPublicMemoKey,
  clearMemoKeyCache,
  encryptMessage,
  decryptMessage,
  isMessageEncrypted,
  validateMemoKey,
  encryptMessageWithKeychain,
  decryptMessageWithKeychain,
  isKeychainAvailable,
  batchDecryptMessages,
}
