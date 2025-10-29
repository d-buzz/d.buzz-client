/**
 * Hive Keychain Integration for D.Buzz Messaging
 *
 * Provides wrapper functions for Hive Keychain browser extension
 * with error handling and user-friendly messages
 *
 * @module services/chat/keychain
 */

/**
 * Check if Hive Keychain is installed and available
 *
 * @returns {boolean} True if Keychain is available
 */
export const isKeychainInstalled = () => {
  return typeof window !== 'undefined' && typeof window.hive_keychain !== 'undefined'
}

/**
 * Wait for Keychain to be ready (loaded)
 * Useful for checking on page load
 *
 * @param {number} timeout - Maximum time to wait in ms (default 5000)
 * @returns {Promise<boolean>} Resolves to true if Keychain is available
 */
export const waitForKeychain = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (isKeychainInstalled()) {
      resolve(true)
      return
    }

    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (isKeychainInstalled()) {
        clearInterval(checkInterval)
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        resolve(false)
      }
    }, 100)
  })
}

/**
 * Request memo encoding (encryption) via Keychain
 *
 * @param {string} username - Sender's username
 * @param {string} recipient - Recipient's username
 * @param {string} message - Plain text message to encrypt
 * @returns {Promise<string>} Encrypted message with # prefix
 */
export const requestEncode = (username, recipient, message) => {
  return new Promise((resolve, reject) => {
    if (!isKeychainInstalled()) {
      reject(new Error('Hive Keychain is not installed. Please install the extension.'))
      return
    }

    window.hive_keychain.requestEncode(
      username,
      recipient,
      message,
      'Memo',
      (response) => {
        if (response.success) {
          resolve(response.result)
        } else {
          const error = parseKeychainError(response)
          reject(new Error(error))
        }
      }
    )
  })
}

/**
 * Request memo decoding (decryption) via Keychain
 *
 * @param {string} username - Recipient's username
 * @param {string} sender - Sender's username
 * @param {string} encryptedMessage - Encrypted message (with # prefix)
 * @returns {Promise<string>} Decrypted plain text message
 */
export const requestDecode = (username, sender, encryptedMessage) => {
  return new Promise((resolve, reject) => {
    if (!isKeychainInstalled()) {
      reject(new Error('Hive Keychain is not installed. Please install the extension.'))
      return
    }

    window.hive_keychain.requestDecode(
      username,
      sender,
      encryptedMessage,
      'Memo',
      (response) => {
        if (response.success) {
          resolve(response.result)
        } else {
          // Return placeholder instead of rejecting for decryption errors
          resolve('[Unable to decrypt message]')
        }
      }
    )
  })
}

/**
 * Request operation broadcast via Keychain
 *
 * @param {string} username - Username to broadcast with
 * @param {Array} operations - Array of operations to broadcast
 * @param {string} keyType - Key type: 'Posting', 'Active', etc.
 * @returns {Promise<Object>} Broadcast result
 */
export const requestBroadcast = (username, operations, keyType = 'Posting') => {
  return new Promise((resolve, reject) => {
    if (!isKeychainInstalled()) {
      reject(new Error('Hive Keychain is not installed. Please install the extension.'))
      return
    }

    window.hive_keychain.requestBroadcast(
      username,
      operations,
      keyType,
      (response) => {
        if (response.success) {
          resolve(response)
        } else {
          const error = parseKeychainError(response)
          reject(new Error(error))
        }
      }
    )
  })
}

/**
 * Request transfer via Keychain with encrypted memo
 *
 * @param {string} username - Sender's username
 * @param {string} recipient - Recipient's username
 * @param {string} amount - Amount to transfer (e.g., "0.001")
 * @param {string} memo - Encrypted memo (with # prefix)
 * @param {string} currency - Currency: 'HIVE' or 'HBD'
 * @returns {Promise<Object>} Transfer result
 */
export const requestSendTransfer = (username, recipient, amount, memo, currency = 'HIVE') => {
  return new Promise((resolve, reject) => {
    if (!isKeychainInstalled()) {
      reject(new Error('Hive Keychain is not installed. Please install the extension.'))
      return
    }

    window.hive_keychain.requestTransfer(
      username,
      recipient,
      amount,
      memo,
      currency,
      (response) => {
        if (response.success) {
          resolve(response)
        } else {
          const error = parseKeychainError(response)
          reject(new Error(error))
        }
      }
    )
  })
}

/**
 * Request custom JSON broadcast via Keychain
 *
 * @param {string} username - Username to broadcast with
 * @param {string} id - Custom JSON ID (e.g., 'dbuzz_dm')
 * @param {string} keyType - Key type: 'Posting' or 'Active'
 * @param {string} json - JSON string payload
 * @param {string} displayMessage - Message to show user in Keychain popup
 * @returns {Promise<Object>} Broadcast result
 */
export const requestCustomJson = (username, id, keyType, json, displayMessage) => {
  return new Promise((resolve, reject) => {
    if (!isKeychainInstalled()) {
      reject(new Error('Hive Keychain is not installed. Please install the extension.'))
      return
    }

    window.hive_keychain.requestCustomJson(
      username,
      id,
      keyType,
      json,
      displayMessage,
      (response) => {
        if (response.success) {
          resolve(response)
        } else {
          const error = parseKeychainError(response)
          reject(new Error(error))
        }
      }
    )
  })
}

/**
 * Parse Keychain error response into user-friendly message
 *
 * @param {Object} response - Keychain error response
 * @returns {string} User-friendly error message
 */
export const parseKeychainError = (response) => {
  if (!response || !response.message) {
    return 'Unknown Keychain error occurred'
  }

  const message = response.message.toLowerCase()

  // Common error patterns
  if (message.includes('user cancel')) {
    return 'You cancelled the operation'
  }

  if (message.includes('locked')) {
    return 'Keychain is locked. Please unlock it and try again.'
  }

  if (message.includes('not found') || message.includes('no account')) {
    return 'Account not found in Keychain. Please add your account first.'
  }

  if (message.includes('insufficient')) {
    return 'Insufficient balance or Resource Credits'
  }

  if (message.includes('timeout')) {
    return 'Operation timed out. Please try again.'
  }

  if (message.includes('denied') || message.includes('rejected')) {
    return 'Operation was rejected. Please check your permissions.'
  }

  // Return original message if no pattern matches
  return response.message || 'Keychain operation failed'
}

/**
 * Check if user account exists in Keychain
 *
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} True if account exists in Keychain
 */
export const hasAccount = (username) => {
  return new Promise((resolve) => {
    if (!isKeychainInstalled()) {
      resolve(false)
      return
    }

    // Try a harmless operation to check if account exists
    window.hive_keychain.requestSignBuffer(
      username,
      'test',
      'Posting',
      (response) => {
        // If error message contains "no account", account doesn't exist
        if (!response.success && response.message && response.message.toLowerCase().includes('no account')) {
          resolve(false)
        } else {
          // Account exists (even if user cancelled or other error)
          resolve(true)
        }
      }
    )
  })
}

/**
 * Get Keychain installation URL
 *
 * @returns {string} URL to install Keychain
 */
export const getInstallUrl = () => {
  return 'https://hive-keychain.com/'
}

/**
 * Prompt user to install Keychain
 * Opens installation page in new tab
 */
export const promptInstall = () => {
  const url = getInstallUrl()
  window.open(url, '_blank')
}

/**
 * Check if specific key type is available in Keychain
 *
 * @param {string} username - Username to check
 * @param {string} keyType - Key type: 'Posting', 'Active', etc.
 * @returns {Promise<boolean>} True if key is available
 */
export const hasKey = (username, keyType = 'Posting') => {
  return new Promise((resolve) => {
    if (!isKeychainInstalled()) {
      resolve(false)
      return
    }

    // Try to sign a test buffer with the specified key type
    window.hive_keychain.requestSignBuffer(
      username,
      'test_key_availability',
      keyType,
      (response) => {
        if (response.success) {
          resolve(true)
        } else if (response.message && response.message.toLowerCase().includes('cancel')) {
          // User cancelled, but key exists
          resolve(true)
        } else {
          resolve(false)
        }
      }
    )
  })
}

/**
 * Get Keychain version
 *
 * @returns {Promise<string|null>} Keychain version or null if not available
 */
export const getKeychainVersion = () => {
  return new Promise((resolve) => {
    if (!isKeychainInstalled()) {
      resolve(null)
      return
    }

    // Keychain doesn't provide a direct version API
    // This is a workaround
    try {
      const version = window.hive_keychain.version || 'unknown'
      resolve(version)
    } catch {
      resolve('unknown')
    }
  })
}

/**
 * Handle Keychain errors with user notifications
 * This is a helper for components to show appropriate error messages
 *
 * @param {Error} error - The error object
 * @param {Function} notifyUser - Function to notify user (e.g., toast notification)
 * @returns {string} User-friendly error message
 */
export const handleKeychainError = (error, notifyUser = null) => {
  let message = 'An error occurred'

  if (error && error.message) {
    message = error.message
  }

  // Don't notify for user cancellations
  if (message.toLowerCase().includes('cancel')) {
    return message
  }

  if (notifyUser && typeof notifyUser === 'function') {
    notifyUser(message, 'error')
  }

  return message
}

export default {
  isKeychainInstalled,
  waitForKeychain,
  requestEncode,
  requestDecode,
  requestBroadcast,
  requestSendTransfer,
  requestCustomJson,
  parseKeychainError,
  hasAccount,
  getInstallUrl,
  promptInstall,
  hasKey,
  getKeychainVersion,
  handleKeychainError,
}
