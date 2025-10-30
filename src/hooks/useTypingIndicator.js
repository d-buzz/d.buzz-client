/**
 * useTypingIndicator Hook
 *
 * Detects user typing activity and sends typing indicators
 * Automatically debounces to avoid spamming blockchain
 *
 * @module hooks/useTypingIndicator
 */

import { useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { sendTypingIndicator } from 'store/chat/actions'

const TYPING_DEBOUNCE_MS = 2000 // Send typing indicator every 2 seconds while typing
const TYPING_STOP_DELAY_MS = 3000 // Consider stopped typing after 3 seconds of no input

/**
 * Hook to handle typing indicator logic
 *
 * @param {string} recipient - Username of the recipient
 * @returns {Function} onTyping - Function to call when user types
 */
const useTypingIndicator = (recipient) => {
  const dispatch = useDispatch()
  const typingTimeoutRef = useRef(null)
  const lastSentRef = useRef(0)
  const isTypingRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Called when user types in the input field
   * Debounces and sends typing indicator
   */
  const onTyping = useCallback(() => {
    if (!recipient) return

    const now = Date.now()
    const timeSinceLastSent = now - lastSentRef.current

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Send typing indicator if enough time has passed
    if (timeSinceLastSent >= TYPING_DEBOUNCE_MS) {
      dispatch(sendTypingIndicator(recipient))
      lastSentRef.current = now
      isTypingRef.current = true
    }

    // Set timeout to detect when user stops typing
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
    }, TYPING_STOP_DELAY_MS)
  }, [recipient, dispatch])

  return onTyping
}

export default useTypingIndicator
