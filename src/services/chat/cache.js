/**
 * LocalStorage Caching Service for D.Buzz Messaging
 *
 * Provides efficient caching of messages and conversations
 * with TTL (Time To Live) support and automatic cleanup
 *
 * @module services/chat/cache
 */

// Cache keys
const CACHE_PREFIX = 'dbuzz_chat_'
const MESSAGES_KEY = (username, partner) => `${CACHE_PREFIX}messages_${username}_${partner}`
const CONVERSATIONS_KEY = (username) => `${CACHE_PREFIX}conversations_${username}`
const MEMO_KEYS_KEY = 'dbuzz_memokeys'
const LAST_BLOCKS_KEY = (username) => `${CACHE_PREFIX}last_blocks_${username}`
const SETTINGS_KEY = (username) => `${CACHE_PREFIX}settings_${username}`

// Cache TTLs (Time To Live) in milliseconds
const TTL = {
  MESSAGES: 7 * 24 * 60 * 60 * 1000, // 7 days
  CONVERSATIONS: 24 * 60 * 60 * 1000, // 24 hours
  MEMO_KEYS: 24 * 60 * 60 * 1000, // 24 hours
  SETTINGS: null, // Never expires
  BLOCKS: null, // Never expires
}

/**
 * Cache entry structure
 * @typedef {Object} CacheEntry
 * @property {*} data - The cached data
 * @property {number} timestamp - When the data was cached
 * @property {number|null} ttl - Time to live in milliseconds (null = never expires)
 */

/**
 * Check if localStorage is available
 *
 * @returns {boolean} True if localStorage is available
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = '__dbuzz_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Get item from cache with TTL check
 *
 * @param {string} key - Cache key
 * @returns {*|null} Cached data or null if not found/expired
 */
const getCacheEntry = (key) => {
  if (!isLocalStorageAvailable()) {
    return null
  }

  try {
    const item = localStorage.getItem(key)
    if (!item) {
      return null
    }

    const entry = JSON.parse(item)

    // Check if expired
    if (entry.ttl !== null && Date.now() - entry.timestamp > entry.ttl) {
      localStorage.removeItem(key)
      return null
    }

    return entry.data
  } catch (error) {
    console.error(`Failed to get cache entry for ${key}:`, error)
    return null
  }
}

/**
 * Set item in cache with TTL
 *
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number|null} ttl - Time to live in milliseconds (null = never expires)
 * @returns {boolean} True if successfully cached
 */
const setCacheEntry = (key, data, ttl = null) => {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    localStorage.setItem(key, JSON.stringify(entry))
    return true
  } catch (error) {
    console.error(`Failed to set cache entry for ${key}:`, error)
    // If quota exceeded, try to clear old entries
    if (error.name === 'QuotaExceededError') {
      cleanupExpiredCache()
      // Try again after cleanup
      try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), ttl }))
        return true
      } catch {
        return false
      }
    }
    return false
  }
}

/**
 * Remove item from cache
 *
 * @param {string} key - Cache key
 * @returns {boolean} True if successfully removed
 */
const removeCacheEntry = (key) => {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Failed to remove cache entry for ${key}:`, error)
    return false
  }
}

/**
 * Cache messages for a conversation
 *
 * @param {string} username - Current user's username
 * @param {string} partner - Conversation partner's username
 * @param {Array} messages - Array of message objects
 * @returns {boolean} True if successfully cached
 */
export const cacheMessages = (username, partner, messages) => {
  const key = MESSAGES_KEY(username, partner)
  return setCacheEntry(key, messages, TTL.MESSAGES)
}

/**
 * Get cached messages for a conversation
 *
 * @param {string} username - Current user's username
 * @param {string} partner - Conversation partner's username
 * @returns {Array|null} Cached messages or null
 */
export const getCachedMessages = (username, partner) => {
  const key = MESSAGES_KEY(username, partner)
  return getCacheEntry(key)
}

/**
 * Clear cached messages for a conversation
 *
 * @param {string} username - Current user's username
 * @param {string} partner - Conversation partner's username
 * @returns {boolean} True if successfully cleared
 */
export const clearCachedMessages = (username, partner) => {
  const key = MESSAGES_KEY(username, partner)
  return removeCacheEntry(key)
}

/**
 * Cache conversations list
 *
 * @param {string} username - Current user's username
 * @param {Object} conversations - Conversations object
 * @returns {boolean} True if successfully cached
 */
export const cacheConversations = (username, conversations) => {
  const key = CONVERSATIONS_KEY(username)
  return setCacheEntry(key, conversations, TTL.CONVERSATIONS)
}

/**
 * Get cached conversations list
 *
 * @param {string} username - Current user's username
 * @returns {Object|null} Cached conversations or null
 */
export const getCachedConversations = (username) => {
  const key = CONVERSATIONS_KEY(username)
  return getCacheEntry(key)
}

/**
 * Clear cached conversations
 *
 * @param {string} username - Current user's username
 * @returns {boolean} True if successfully cleared
 */
export const clearCachedConversations = (username) => {
  const key = CONVERSATIONS_KEY(username)
  return removeCacheEntry(key)
}

/**
 * Cache memo keys
 *
 * @param {Object} memoKeys - Memo keys object (username -> {key, timestamp})
 * @returns {boolean} True if successfully cached
 */
export const cacheMemoKeys = (memoKeys) => {
  return setCacheEntry(MEMO_KEYS_KEY, memoKeys, TTL.MEMO_KEYS)
}

/**
 * Get cached memo keys
 *
 * @returns {Object|null} Cached memo keys or null
 */
export const getCachedMemoKeys = () => {
  return getCacheEntry(MEMO_KEYS_KEY)
}

/**
 * Clear cached memo keys
 *
 * @returns {boolean} True if successfully cleared
 */
export const clearCachedMemoKeys = () => {
  return removeCacheEntry(MEMO_KEYS_KEY)
}

/**
 * Cache last fetched block numbers
 *
 * @param {string} username - Current user's username
 * @param {Object} blocks - Last fetched blocks object (partner -> blockNum)
 * @returns {boolean} True if successfully cached
 */
export const cacheLastFetchedBlocks = (username, blocks) => {
  const key = LAST_BLOCKS_KEY(username)
  return setCacheEntry(key, blocks, TTL.BLOCKS)
}

/**
 * Get cached last fetched blocks
 *
 * @param {string} username - Current user's username
 * @returns {Object|null} Cached blocks or null
 */
export const getCachedLastFetchedBlocks = (username) => {
  const key = LAST_BLOCKS_KEY(username)
  return getCacheEntry(key)
}

/**
 * Cache user settings
 *
 * @param {string} username - Current user's username
 * @param {Object} settings - Settings object
 * @returns {boolean} True if successfully cached
 */
export const cacheSettings = (username, settings) => {
  const key = SETTINGS_KEY(username)
  return setCacheEntry(key, settings, TTL.SETTINGS)
}

/**
 * Get cached settings
 *
 * @param {string} username - Current user's username
 * @returns {Object|null} Cached settings or null
 */
export const getCachedSettings = (username) => {
  const key = SETTINGS_KEY(username)
  return getCacheEntry(key)
}

/**
 * Clear all cached data for a user
 *
 * @param {string} username - Current user's username
 * @returns {boolean} True if successfully cleared
 */
export const clearAllCacheForUser = (username) => {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    const keys = Object.keys(localStorage)
    const userKeys = keys.filter(key =>
      key.startsWith(`${CACHE_PREFIX}`) &&
      (key.includes(`_${username}_`) || key.endsWith(`_${username}`))
    )

    userKeys.forEach(key => localStorage.removeItem(key))
    return true
  } catch (error) {
    console.error('Failed to clear cache for user:', error)
    return false
  }
}

/**
 * Clear all D.Buzz chat cache
 *
 * @returns {boolean} True if successfully cleared
 */
export const clearAllCache = () => {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    const keys = Object.keys(localStorage)
    const chatKeys = keys.filter(key => key.startsWith(CACHE_PREFIX))

    chatKeys.forEach(key => localStorage.removeItem(key))

    // Also clear memo keys
    localStorage.removeItem(MEMO_KEYS_KEY)

    return true
  } catch (error) {
    console.error('Failed to clear all cache:', error)
    return false
  }
}

/**
 * Cleanup expired cache entries
 * Should be called periodically to free up space
 *
 * @returns {number} Number of entries removed
 */
export const cleanupExpiredCache = () => {
  if (!isLocalStorageAvailable()) {
    return 0
  }

  try {
    const keys = Object.keys(localStorage)
    const chatKeys = keys.filter(key => key.startsWith(CACHE_PREFIX) || key === MEMO_KEYS_KEY)

    let removedCount = 0

    chatKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          const entry = JSON.parse(item)

          // Remove if expired
          if (entry.ttl !== null && Date.now() - entry.timestamp > entry.ttl) {
            localStorage.removeItem(key)
            removedCount++
          }
        }
      } catch {
        // If parse fails, remove the corrupted entry
        localStorage.removeItem(key)
        removedCount++
      }
    })

    return removedCount
  } catch (error) {
    console.error('Failed to cleanup expired cache:', error)
    return 0
  }
}

/**
 * Get cache size in bytes (approximate)
 *
 * @returns {number} Cache size in bytes
 */
export const getCacheSize = () => {
  if (!isLocalStorageAvailable()) {
    return 0
  }

  try {
    const keys = Object.keys(localStorage)
    const chatKeys = keys.filter(key => key.startsWith(CACHE_PREFIX) || key === MEMO_KEYS_KEY)

    let totalSize = 0

    chatKeys.forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        totalSize += item.length + key.length
      }
    })

    return totalSize
  } catch (error) {
    console.error('Failed to calculate cache size:', error)
    return 0
  }
}

/**
 * Get cache statistics
 *
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  if (!isLocalStorageAvailable()) {
    return {
      available: false,
      entryCount: 0,
      sizeBytes: 0,
      sizeKB: 0,
      sizeMB: 0,
    }
  }

  try {
    const keys = Object.keys(localStorage)
    const chatKeys = keys.filter(key => key.startsWith(CACHE_PREFIX) || key === MEMO_KEYS_KEY)

    const sizeBytes = getCacheSize()

    return {
      available: true,
      entryCount: chatKeys.length,
      sizeBytes,
      sizeKB: (sizeBytes / 1024).toFixed(2),
      sizeMB: (sizeBytes / (1024 * 1024)).toFixed(2),
    }
  } catch (error) {
    console.error('Failed to get cache stats:', error)
    return {
      available: false,
      entryCount: 0,
      sizeBytes: 0,
      sizeKB: 0,
      sizeMB: 0,
    }
  }
}

/**
 * Initialize cache on app load
 * Performs cleanup and migration if needed
 */
export const initializeCache = () => {
  if (!isLocalStorageAvailable()) {
    console.warn('LocalStorage not available, caching disabled')
    return
  }

  try {
    // Cleanup expired entries
    const removed = cleanupExpiredCache()
    if (removed > 0) {
      console.log(`Cleaned up ${removed} expired cache entries`)
    }

    // Log cache stats
    const stats = getCacheStats()
    console.log('Chat cache initialized:', stats)
  } catch (error) {
    console.error('Failed to initialize cache:', error)
  }
}

export default {
  isLocalStorageAvailable,
  cacheMessages,
  getCachedMessages,
  clearCachedMessages,
  cacheConversations,
  getCachedConversations,
  clearCachedConversations,
  cacheMemoKeys,
  getCachedMemoKeys,
  clearCachedMemoKeys,
  cacheLastFetchedBlocks,
  getCachedLastFetchedBlocks,
  cacheSettings,
  getCachedSettings,
  clearAllCacheForUser,
  clearAllCache,
  cleanupExpiredCache,
  getCacheSize,
  getCacheStats,
  initializeCache,
}
