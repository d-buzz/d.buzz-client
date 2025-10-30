/**
 * Web Notifications Service for D.Buzz Messaging
 *
 * Handles browser notifications for new messages
 * Requires user permission
 *
 * @module services/chat/notifications
 */

/**
 * Check if notifications are supported in this browser
 *
 * @returns {boolean} True if notifications are supported
 */
export const isNotificationSupported = () => {
  return 'Notification' in window
}

/**
 * Check current notification permission status
 *
 * @returns {string} 'granted', 'denied', or 'default'
 */
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) {
    return 'denied'
  }
  return Notification.permission
}

/**
 * Request notification permission from user
 *
 * @returns {Promise<string>} Permission status after request
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('Failed to request notification permission:', error)
    return 'denied'
  }
}

/**
 * Show a notification for a new message
 *
 * @param {Object} message - Message object
 * @param {string} message.from - Sender username
 * @param {string} message.content - Message content
 * @param {Function} onClick - Callback when notification is clicked
 * @returns {Notification|null} Notification object or null if not shown
 */
export const showMessageNotification = (message, onClick) => {
  if (!isNotificationSupported()) {
    return null
  }

  if (Notification.permission !== 'granted') {
    return null
  }

  const { from, content } = message

  // Truncate long messages
  const truncatedContent = content.length > 100
    ? content.substring(0, 100) + '...'
    : content

  try {
    const notification = new Notification(`New message from @${from}`, {
      body: truncatedContent,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `dbuzz-message-${from}`, // Prevents duplicate notifications from same user
      renotify: false, // Don't vibrate/sound if replacing existing notification
      requireInteraction: false, // Auto-close after a few seconds
      silent: false,
    })

    // Handle notification click
    if (onClick) {
      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        onClick(from)
        notification.close()
      }
    }

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)

    return notification
  } catch (error) {
    console.error('Failed to show notification:', error)
    return null
  }
}

/**
 * Show a notification for multiple new messages from same user
 *
 * @param {string} username - Sender username
 * @param {number} count - Number of new messages
 * @param {Function} onClick - Callback when notification is clicked
 * @returns {Notification|null} Notification object or null if not shown
 */
export const showMultipleMessagesNotification = (username, count, onClick) => {
  if (!isNotificationSupported()) {
    return null
  }

  if (Notification.permission !== 'granted') {
    return null
  }

  try {
    const notification = new Notification(`@${username}`, {
      body: `${count} new messages`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `dbuzz-message-${username}`,
      renotify: false,
      requireInteraction: false,
      silent: false,
    })

    if (onClick) {
      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        onClick(username)
        notification.close()
      }
    }

    setTimeout(() => {
      notification.close()
    }, 10000)

    return notification
  } catch (error) {
    console.error('Failed to show notification:', error)
    return null
  }
}

/**
 * Clear all notifications (called when user focuses the app)
 */
export const clearAllNotifications = () => {
  // Note: There's no direct way to clear all notifications
  // They will auto-close or user will dismiss them
  // This is a placeholder for future implementation
}

/**
 * Check if document is currently focused
 *
 * @returns {boolean} True if document is focused
 */
export const isDocumentFocused = () => {
  return document.hasFocus()
}

/**
 * Check if should show notification for this message
 * Don't show if:
 * - Document is focused and chat is open
 * - Notifications are disabled in settings
 *
 * @param {boolean} isChatOpen - Is the chat with this user currently open
 * @param {boolean} notificationsEnabled - User's notification setting
 * @returns {boolean} True if should show notification
 */
export const shouldShowNotification = (isChatOpen, notificationsEnabled) => {
  if (!notificationsEnabled) {
    return false
  }

  if (Notification.permission !== 'granted') {
    return false
  }

  // Don't notify if chat is open and document is focused
  if (isChatOpen && isDocumentFocused()) {
    return false
  }

  return true
}
