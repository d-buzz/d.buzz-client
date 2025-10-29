/**
 * D.Buzz Messaging Services
 *
 * Central export point for all messaging-related services
 *
 * @module services/chat
 */

// Encryption services
export * as encryption from './encryption'
export {
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
} from './encryption'

// Message operations
export * as operations from './operations'
export {
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
} from './operations'

// Blockchain interface
export * as blockchain from './blockchain'
export {
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
} from './blockchain'

// Keychain integration
export * as keychain from './keychain'
export {
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
} from './keychain'

// Cache utilities
export * as cache from './cache'
export {
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
} from './cache'
