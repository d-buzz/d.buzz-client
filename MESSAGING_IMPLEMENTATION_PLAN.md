# D.Buzz Messaging System - Technical Implementation Plan

## Document Overview

**Project**: D.Buzz On-Chain Encrypted Messaging System
**Version**: 1.0
**Date**: 2025-10-29
**Architecture**: Hybrid Transfer-Initiated + Custom JSON Messaging
**Status**: Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Implementation Phases](#implementation-phases)
5. [Data Models](#data-models)
6. [Message Flow Diagrams](#message-flow-diagrams)
7. [Security & Encryption](#security--encryption)
8. [Performance Optimization](#performance-optimization)
9. [User Experience](#user-experience)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Plan](#deployment-plan)
12. [Risk Management](#risk-management)
13. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

### 1.1 Project Goals

Build a fully decentralized, end-to-end encrypted messaging system for D.Buzz that operates entirely on the Hive blockchain without requiring backend infrastructure. The system will provide real-time-like messaging capabilities while maintaining cost efficiency and user privacy.

### 1.2 Key Features

- End-to-end encrypted direct messaging between Hive users
- Desktop messenger interface (Facebook Messenger style)
- Mobile-responsive full-screen chat views
- No backend server requirements
- Anti-spam protection via transfer fee mechanism
- Cost-efficient ongoing conversations
- Message history persistence on blockchain
- Online/offline status indicators
- Typing indicators (optional)
- Read receipts
- Multi-device synchronization via blockchain

### 1.3 Technical Approach

**Hybrid Messaging Model:**
- **New Conversations**: Initiated via Hive transfer operations (0.001 HIVE) with encrypted memo
- **Ongoing Conversations**: Continued via custom_json operations (RC cost only)
- **Discovery**: Recipients detect new messages via incoming transfer polling
- **Synchronization**: Bidirectional account history polling for active conversations

### 1.4 Success Criteria

- Message delivery within 10-15 seconds average
- 99.9% message delivery success rate
- Support for unlimited message history
- < 5% Resource Credit usage for typical daily messaging
- Zero data stored on centralized servers
- Full message encryption with no plain-text leakage
- Mobile and desktop UI parity in functionality

---

## 2. System Architecture

### 2.1 High-Level Architecture

**Components:**
1. **Encryption Service Layer** - Handles memo encryption/decryption using Hive's secp256k1
2. **Blockchain Interface Layer** - Manages all Hive API interactions
3. **Message Operations Layer** - Generates and broadcasts transfer/custom_json operations
4. **State Management Layer** - Redux store for messages, conversations, UI state
5. **Polling Service Layer** - Manages blockchain polling for new messages
6. **UI Component Layer** - Desktop and mobile messaging interfaces
7. **Notification Service** - Browser notifications and in-app alerts

### 2.2 Data Flow Architecture

**Message Sending Flow:**
```
User Input → UI Component → Redux Action → Saga Middleware
→ Determine Operation Type (Transfer vs Custom JSON)
→ Fetch Public Memo Key → Encrypt Message Content
→ Generate Blockchain Operation → Broadcast to Hive
→ Optimistic UI Update → Wait for Confirmation
→ Poll for Confirmation → Update Final State
```

**Message Receiving Flow:**
```
Polling Service → Fetch Account History (Transfers + Custom JSON)
→ Filter for Message Operations → Decrypt Message Content
→ Dispatch Redux Action → Update State
→ UI Re-render → Show Notification (if needed)
```

### 2.3 Blockchain Operation Strategy

**Operation Type Selection Logic:**

| Scenario | Operation Type | Cost | Reason |
|----------|---------------|------|--------|
| First message to user | Transfer | 0.001 HIVE + RC | Ensures immediate discovery |
| Reply to existing conversation | Custom JSON | RC only | Cost-effective continuation |
| Conversation inactive > 24h | Transfer | 0.001 HIVE + RC | Re-ping recipient |
| Active conversation | Custom JSON | RC only | Ongoing efficiency |
| User requests priority delivery | Transfer | 0.001 HIVE + RC | Guaranteed visibility |

### 2.4 Polling Architecture

**Two-Tier Polling Strategy:**

**Tier 1: Active Conversation Polling**
- Target: Open/active chat windows
- Interval: 10 seconds
- Method: Poll partner's account history for custom_json operations
- Filter: Operations with id='dbuzz_dm' between current user and partner

**Tier 2: New Conversation Discovery**
- Target: Current user's account
- Interval: 30 seconds
- Method: Poll for incoming transfer operations
- Filter: Transfers with DBUZZ: prefix or encrypted memos

**Adaptive Polling:**
- Reduce frequency when app backgrounded
- Increase frequency when chat window focused
- Pause polling when user inactive > 5 minutes
- Resume on user activity

### 2.5 Technology Stack Integration

**Existing Technologies (Leveraged):**
- React 16.13.1 - UI components
- Redux + Redux-Saga - State management and async operations
- Immutable.js - Immutable state structures
- Material-UI - UI component library
- @hiveio/hive-js - Blockchain operations and memo encryption
- Hive Keychain - Secure key management
- React Router - Navigation
- LocalStorage - Message caching

**New Dependencies (Required):**
- uuid (already available) - Message ID generation
- None - All other capabilities exist in current stack

---

## 3. Core Components

### 3.1 Service Layer Components

#### 3.1.1 Encryption Service

**Purpose**: Handle all message encryption and decryption operations

**Responsibilities:**
- Encrypt message content using Hive memo encryption (secp256k1)
- Decrypt received messages using private memo keys
- Manage shared secret generation between sender/recipient
- Handle encryption errors gracefully
- Support both Keychain and direct WIF encryption methods
- Cache public memo keys to reduce API calls

**Key Functions:**
- Encrypt message with sender private key + recipient public key
- Decrypt message with recipient private key
- Fetch public memo keys from blockchain
- Derive memo keys from master password (for non-Keychain users)
- Validate encryption/decryption success

**Error Handling:**
- Failed encryption: Show error, don't send message
- Failed decryption: Display "[Unable to decrypt]" placeholder
- Missing memo key: Fetch from blockchain or prompt user
- Invalid key format: Show clear error message

#### 3.1.2 Message Operations Service

**Purpose**: Generate blockchain operations for message sending

**Responsibilities:**
- Generate transfer operations for new conversations
- Generate custom_json operations for ongoing conversations
- Add metadata to identify D.Buzz messages (DBUZZ: prefix)
- Create proper operation structure per Hive specifications
- Include timestamp, message ID, and conversation metadata
- Handle operation versioning for future compatibility

**Operation Metadata:**
- Application identifier: "dbuzz/1.0.0"
- Operation type: "message"
- Sender and recipient usernames
- Encrypted content payload
- Unix timestamp
- Unique message ID (UUID)
- Optional reply-to field for threading

**Transfer Operation Details:**
- Amount: 0.001 HIVE (configurable)
- Memo: DBUZZ: prefix + encrypted message
- From/To: Sender and recipient usernames
- Auto-detect currency availability (HIVE vs HBD)

**Custom JSON Operation Details:**
- ID: 'dbuzz_dm'
- Required posting authority: Sender only
- No required active authority
- JSON payload: Structured message data
- Minimal RC cost optimization

#### 3.1.3 Message Fetching Service

**Purpose**: Retrieve messages from blockchain account history

**Responsibilities:**
- Fetch account history with operation type filtering
- Filter for transfer operations (for new conversation discovery)
- Filter for custom_json operations (for ongoing conversations)
- Combine operations from multiple accounts
- Parse blockchain operations into message objects
- Handle pagination for large message histories
- Implement incremental fetching (only new blocks)
- Cache last fetched block number per conversation

**Filtering Strategy:**
- Use Hive ChainTypes.operations for bit mask filtering
- Filter transfers: Only between relevant users with DBUZZ prefix
- Filter custom_json: Only id='dbuzz_dm' between relevant users
- Exclude duplicate operations
- Sort by timestamp chronologically

**Optimization Techniques:**
- Incremental fetching: Start from last known block number
- Batch API calls when possible
- Cache results in Redux state
- Implement cursor-based pagination
- Limit initial fetch to recent 50-100 messages

#### 3.1.4 Hive Keychain Integration Service

**Purpose**: Interface with Hive Keychain browser extension

**Responsibilities:**
- Detect Keychain availability
- Request memo encoding via Keychain
- Request memo decoding via Keychain
- Broadcast operations via Keychain
- Handle Keychain errors and user rejections
- Provide fallback for non-Keychain users

**Keychain Operations:**
- requestEncode: Encrypt message for recipient
- requestDecode: Decrypt message from sender
- requestBroadcast: Send operation to blockchain
- requestSendTransfer: Send transfer operation with encrypted memo

**Error Scenarios:**
- Keychain not installed: Prompt user to install or use direct login
- User rejects operation: Cancel gracefully, show message
- Keychain locked: Prompt user to unlock
- Wrong account: Show error, request switch

### 3.2 State Management Components

#### 3.2.1 Redux Store Structure

**Chat State Domain:**

**conversations**: Map of username to conversation metadata
- Key: Partner username
- Value: Conversation object containing:
  - Partner username
  - Public memo key (cached)
  - Last message object
  - Last activity timestamp
  - Unread message count
  - Last fetched block number
  - Is typing indicator
  - Conversation status (active, archived, muted)

**messages**: Map of username to array of message objects
- Key: Partner username
- Value: Array of message objects containing:
  - Unique message ID
  - Sender username
  - Recipient username
  - Message content (decrypted)
  - Timestamp
  - Block number
  - Transaction ID
  - Message type (transfer vs custom_json)
  - Read status
  - Pending/confirmed status
  - Encryption status

**activeChats**: Array of usernames for open chat windows (desktop)
- Tracks which conversations have open UI windows
- Maximum 3 simultaneous windows
- Order determines window stacking position

**currentChat**: String username for mobile full-screen view
- Tracks which conversation is currently displayed on mobile
- Null when on conversation list view

**minimizedChats**: Array of usernames for minimized windows (desktop)
- Tracks which chat windows are minimized to title bar
- Can restore to full window on click

**ui**: UI state object
- isChatListOpen: Boolean for conversation list dropdown
- isLoadingMessages: Boolean for loading indicators
- sendingMessage: Boolean for send button state
- error: Error message string or null
- selectedMessageIds: Array for bulk actions

**memoKeys**: Cache of public memo keys
- Key: Username
- Value: Public memo key string
- TTL: 24 hours before re-fetch

**polling**: Polling state object
- isActive: Boolean for polling status
- lastGlobalPoll: Timestamp of last conversation discovery poll
- lastConversationPoll: Map of username to last poll timestamp
- pollingInterval: Current polling interval in ms

**settings**: User preferences
- transferAmount: Configurable initial message transfer amount
- notificationsEnabled: Browser notification permission
- soundEnabled: Message sound effects
- pollingEnabled: Allow background polling
- autoReadReceipts: Automatically mark messages as read

#### 3.2.2 Redux Actions

**Message Actions:**
- SEND_MESSAGE_REQUEST: User sends message
- SEND_MESSAGE_SUCCESS: Message broadcast successful
- SEND_MESSAGE_FAILURE: Message broadcast failed
- RECEIVE_MESSAGE: New message received
- ADD_OPTIMISTIC_MESSAGE: Add message to UI before confirmation
- CONFIRM_MESSAGE: Mark optimistic message as confirmed
- MESSAGE_FAILED: Mark message as failed to send

**Conversation Actions:**
- FETCH_CONVERSATIONS_REQUEST: Load conversation list
- FETCH_CONVERSATIONS_SUCCESS: Conversations loaded
- FETCH_MESSAGES_REQUEST: Load messages for conversation
- FETCH_MESSAGES_SUCCESS: Messages loaded
- UPDATE_CONVERSATION_MESSAGES: Append new messages to conversation
- NEW_CONVERSATIONS_DETECTED: New conversation initiated via transfer
- MARK_MESSAGES_READ: Mark messages as read
- ARCHIVE_CONVERSATION: Archive conversation
- DELETE_CONVERSATION: Delete conversation locally

**UI Actions:**
- OPEN_CHAT: Open chat window with user
- CLOSE_CHAT: Close chat window
- MINIMIZE_CHAT: Minimize chat window to title bar
- MAXIMIZE_CHAT: Restore minimized chat window
- TOGGLE_CHAT_LIST: Toggle conversation list dropdown
- SET_CURRENT_CHAT: Set mobile current chat view
- UPDATE_TYPING_STATUS: Update typing indicator

**Polling Actions:**
- START_MESSAGE_POLLING: Begin polling for messages
- STOP_MESSAGE_POLLING: Stop polling
- POLL_ACTIVE_CONVERSATIONS: Poll open conversations
- POLL_NEW_CONVERSATIONS: Poll for new conversations

**Settings Actions:**
- UPDATE_MESSAGE_SETTINGS: Update user preferences
- TOGGLE_NOTIFICATIONS: Enable/disable notifications
- SET_TRANSFER_AMOUNT: Set initial message transfer amount

#### 3.2.3 Redux Saga Workflows

**Send Message Saga:**
1. Receive SEND_MESSAGE_REQUEST action
2. Extract recipient, content, and options from payload
3. Get current user from auth state
4. Determine if transfer or custom_json should be used
5. Retrieve or derive memo key based on authentication method
6. Generate appropriate blockchain operation
7. Broadcast operation via Keychain or direct WIF
8. Add optimistic message to UI state
9. Dispatch SUCCESS or FAILURE action
10. Schedule confirmation check after 3-5 seconds
11. Poll for confirmed message in blockchain
12. Update message status from pending to confirmed

**Fetch Messages Saga:**
1. Receive FETCH_MESSAGES_REQUEST action
2. Extract partner username from payload
3. Get current user and memo key
4. Call message fetching service for both users
5. Combine transfer and custom_json messages
6. Decrypt all message contents
7. Sort messages chronologically
8. Remove duplicates by message ID
9. Dispatch FETCH_MESSAGES_SUCCESS with messages
10. Cache messages in LocalStorage
11. Update last fetched block number

**Active Conversation Polling Saga:**
1. Loop indefinitely while polling active
2. Get list of active chat windows
3. For each active conversation:
   - Fetch new messages since last poll
   - Decrypt new messages
   - Dispatch update actions
   - Update unread counts
4. Wait for polling interval (10 seconds)
5. Repeat

**New Conversation Discovery Saga:**
1. Loop indefinitely while polling active
2. Fetch incoming transfers to current user
3. Filter for D.Buzz message transfers (DBUZZ prefix)
4. Parse and decrypt transfer messages
5. Group by sender into conversation objects
6. Check against existing conversations
7. Dispatch NEW_CONVERSATIONS_DETECTED for new ones
8. Show notifications for new conversations
9. Wait for polling interval (30 seconds)
10. Repeat

**Open Chat Saga:**
1. Receive OPEN_CHAT action
2. Check if conversation exists in state
3. If not, fetch initial messages
4. If desktop, add to activeChats array
5. If desktop and already 3 windows, close least recently used
6. If mobile, set as currentChat and navigate
7. Dispatch MARK_MESSAGES_READ action
8. Start focused polling for this conversation

### 3.3 UI Component Hierarchy

#### 3.3.1 Desktop Components

**ChatButton Component:**
- Floating Action Button (FAB) positioned bottom-right
- Material-UI Fab component with message icon
- Displays unread message count badge
- Click handler toggles ConversationList visibility
- Absolute positioning with high z-index
- Theme-aware styling (light/night mode)
- Animations for badge updates

**ConversationList Component:**
- Dropdown popup anchored to ChatButton
- Material-UI Paper with elevation
- Fixed dimensions (350px width, 400px max height)
- Header with search field and settings icon
- Scrollable list of ConversationListItem components
- Empty state when no conversations
- Loading skeleton during fetch
- Click outside to close

**ConversationListItem Component:**
- List item for each conversation
- User avatar (profile picture)
- Username display
- Last message preview (truncated)
- Timestamp (relative format: "2m ago", "1h ago")
- Unread count badge
- Online status indicator (green/grey dot)
- Hover effects
- Click handler opens chat window

**ChatWindow Component:**
- Floating window positioned bottom-right
- Dimensions: 320px width × 400px height
- Material-UI Card component
- Three sections: Header, Messages, Input

**ChatWindowHeader Sub-Component:**
- User avatar and username
- Online status indicator
- Action buttons: Minimize, Close
- Theme-aware background color

**ChatWindowMessages Sub-Component:**
- Scrollable message area with reverse flex direction
- Auto-scrolls to bottom on new messages
- Date separator components for different days
- MessageBubble components for each message
- Typing indicator animation
- Loading spinner for history fetch
- Infinite scroll for message history

**ChatWindowInput Sub-Component:**
- Multi-line text input field
- Emoji picker button and popup
- Send button (disabled when empty)
- Character count indicator
- Shift+Enter for new line, Enter to send
- File attachment button (future enhancement)
- Transfer fee warning for new conversations

**MessageBubble Component:**
- Sent vs received styling differentiation
- Rounded corners, appropriate padding
- Timestamp on hover
- Read receipt indicators (checkmarks)
- Message type indicator (transfer icon if applicable)
- Link detection and rendering
- Image preview support
- Context menu for actions (copy, delete, reply)

**TypingIndicator Component:**
- Animated three-dot indicator
- Appears at bottom of message list
- Shows "{username} is typing..."
- Auto-hides after 5 seconds of inactivity

#### 3.3.2 Mobile Components

**MessagesPage Component:**
- Full-screen page accessible via /messages route
- Header with title, search icon, settings icon
- Scrollable list of conversation items
- Pull-to-refresh functionality
- Swipe gestures for archive/delete
- Empty state with illustration
- New message floating action button
- Bottom navigation integration

**MobileConversationItem Component:**
- Similar to desktop but full-width
- Larger touch targets
- Swipe reveal for actions
- Long-press for context menu
- Optimized for touch interactions

**ChatView Component:**
- Full-screen page at /messages/:username route
- Header with back button, username, options menu
- Full-screen message list area
- Bottom input toolbar
- Keyboard-aware scrolling
- Smooth transitions and animations

**ChatViewHeader Component:**
- Back navigation button
- Partner username and avatar
- Online status
- Options menu (mute, block, clear history)
- Theme-consistent styling

**ChatViewMessages Component:**
- Full-screen scrollable message area
- Optimized for mobile viewport
- Intersection observer for infinite scroll
- Snap-to-bottom behavior
- Touch-friendly message bubbles

**ChatViewInput Component:**
- Fixed bottom position
- Keyboard-aware positioning
- Expanding text input
- Emoji picker optimized for mobile
- Send button prominent
- Attachment options (future)

### 3.4 Routing Configuration

**New Routes:**
- /messages - Mobile conversation list (MessagesPage)
- /messages/:username - Mobile chat view (ChatView)

**Route Guards:**
- Require authentication for all message routes
- Redirect to login if not authenticated
- Validate username parameter exists on blockchain

**Navigation Integration:**
- Add "Messages" to mobile nav menu with badge
- Desktop: No navigation, uses floating ChatButton

### 3.5 Notification System Integration

**Browser Notifications:**
- Request permission on first message received
- Show notification when app backgrounded
- Include sender name and message preview (optional)
- Click notification focuses app and opens chat
- Notification grouping by sender
- Custom notification icon
- Sound effects (configurable)

**In-App Notifications:**
- Integrate with existing NotificationBox component
- Show alerts for:
  - New message received (when chat not open)
  - Message send failures
  - Low Resource Credit warnings
  - System errors
- Non-intrusive placement
- Auto-dismiss after 5 seconds
- Click to navigate to relevant chat

---

## 4. Implementation Phases

### Phase 1: Foundation & Infrastructure (Week 1-2)

**Objectives:**
- Set up encryption service layer
- Create message operation generators
- Implement basic blockchain fetching
- Set up Redux store structure

**Deliverables:**

**1.1 Encryption Service**
- Memo encryption function using Hive.js
- Memo decryption function
- Public memo key fetching
- Memo key caching system
- Error handling for encryption failures
- Unit tests for encryption/decryption

**1.2 Message Operations Service**
- Transfer operation generator with DBUZZ prefix
- Custom JSON operation generator
- Operation structure validation
- Metadata attachment
- Unit tests for operation generation

**1.3 Basic Blockchain Interface**
- Account history fetching with filtering
- Operation parsing utilities
- Message extraction from operations
- Transfer vs custom_json detection
- Initial error handling

**1.4 Redux Store Setup**
- Create /store/chat directory
- Define action types and creators
- Implement initial reducers using Immutable.js
- Set up saga watchers
- Integrate with root store

**1.5 Hive Keychain Integration**
- Keychain detection utility
- Keychain encode/decode wrappers
- Keychain broadcast wrapper
- Error handling for Keychain operations
- Fallback logic for non-Keychain users

**Testing Focus:**
- Encryption/decryption roundtrip tests
- Operation generation validation
- Account history parsing accuracy
- Redux state immutability
- Keychain mock integration

**Success Metrics:**
- All unit tests passing
- Successful encryption/decryption
- Valid operation generation
- Proper Redux state structure
- Clean integration with existing store

---

### Phase 2: Message Sending & Receiving (Week 3)

**Objectives:**
- Implement end-to-end message sending
- Create message fetching and parsing
- Build basic polling mechanism
- Handle Keychain and WIF authentication

**Deliverables:**

**2.1 Send Message Saga**
- Complete saga workflow for sending messages
- Operation type determination logic (transfer vs custom_json)
- Keychain integration for message sending
- Direct WIF integration for non-Keychain users
- Optimistic UI updates
- Confirmation polling
- Error handling and retry logic

**2.2 Message Fetching Service Enhancement**
- Bidirectional account history fetching
- Transfer message parsing
- Custom JSON message parsing
- Message combining and deduplication
- Chronological sorting
- Decryption of fetched messages

**2.3 Basic Polling Implementation**
- Simple polling saga for active conversation
- 30-second interval polling
- Integration with existing polling pattern
- Start/stop polling actions
- Polling state management

**2.4 Conversation Management**
- Conversation detection from messages
- Conversation metadata extraction
- Unread count calculation
- Last message tracking
- Conversation list generation

**2.5 LocalStorage Caching**
- Message caching utilities
- Cache read/write operations
- Cache invalidation logic
- Offline message access
- Cache size management

**Testing Focus:**
- End-to-end message send test
- Message parsing accuracy
- Encryption integrity across send/receive
- Polling reliability
- Cache persistence

**Success Metrics:**
- Successfully send and receive messages
- Messages appear in correct conversation
- Polling detects new messages within interval
- Cached messages persist across sessions
- Zero message loss

---

### Phase 3: Desktop UI Development (Week 4-5)

**Objectives:**
- Build all desktop messaging components
- Implement chat window management
- Create conversation list interface
- Add animations and transitions

**Deliverables:**

**3.1 ChatButton Component**
- FAB with Material-UI styling
- Unread badge implementation
- Theme integration (light/night mode)
- Positioning and z-index management
- Click handler for conversation list toggle
- Animations for badge updates

**3.2 ConversationList Component**
- Dropdown popup with proper positioning
- Search/filter functionality
- Empty state handling
- Loading states with skeletons
- Click-outside-to-close logic
- Keyboard navigation support

**3.3 ConversationListItem Component**
- Avatar display with fallback
- Username and metadata display
- Last message preview truncation
- Relative timestamp formatting
- Unread badge rendering
- Online status indicator
- Hover and active states

**3.4 ChatWindow Component**
- Floating window with card styling
- Window positioning logic (multiple windows)
- Window stacking when 3+ active
- Header, messages, input layout
- Resize handling
- Minimize/maximize animations

**3.5 ChatWindowHeader**
- Avatar and username display
- Online status indicator
- Minimize button with icon
- Close button with confirmation (if unsent messages)
- Theme-aware background

**3.6 ChatWindowMessages**
- Reverse-scrollable message container
- Auto-scroll to bottom on new messages
- Scroll-to-top to load history
- Date separator rendering
- Message grouping by sender
- Typing indicator integration

**3.7 MessageBubble Component**
- Sent vs received styling
- Bubble positioning (left/right)
- Timestamp hover display
- Read receipt indicators
- Link detection and rendering
- Message type indicators (transfer icon)
- Context menu on right-click

**3.8 ChatWindowInput**
- Multi-line text input with auto-expand
- Emoji picker integration (existing EmojiPicker component)
- Send button with loading state
- Character counter
- Transfer fee warning for new conversations
- Keyboard shortcuts (Enter to send, Shift+Enter for newline)

**3.9 Window Management Logic**
- Maximum 3 simultaneous windows
- Window positioning calculations
- Minimize to title bar
- Restore from minimized
- Close and cleanup
- Window focus management

**Testing Focus:**
- Component rendering tests
- User interaction testing
- Window management logic
- Theme consistency
- Responsive behavior at different screen sizes
- Accessibility (keyboard navigation, screen readers)

**Success Metrics:**
- All components render correctly
- Smooth animations and transitions
- Proper window stacking and management
- Theme switching works seamlessly
- No UI performance issues with 100+ messages

---

### Phase 4: Mobile UI Development (Week 5-6)

**Objectives:**
- Build mobile-first messaging pages
- Create full-screen chat interface
- Implement touch gestures
- Optimize for mobile performance

**Deliverables:**

**4.1 MessagesPage Component**
- Full-screen conversation list
- Header with search and settings
- Pull-to-refresh implementation
- Swipe gesture for archive/delete
- Empty state with call-to-action
- Loading states
- FAB for new conversation

**4.2 MobileConversationItem Component**
- Full-width touch-friendly layout
- Larger avatars and text
- Swipe reveal for actions
- Long-press context menu
- Optimized touch targets (min 44px)
- Haptic feedback on interactions

**4.3 ChatView Component**
- Full-screen chat interface
- Smooth page transitions
- Keyboard handling (avoid covering input)
- Pull-down-to-refresh
- Scroll-to-bottom FAB when not at bottom
- Message send animations

**4.4 ChatViewHeader Component**
- Back button navigation
- Partner info display
- Options menu (mute, block, clear)
- Status bar styling
- Safe area handling (notch compatibility)

**4.5 ChatViewMessages Component**
- Full viewport message area
- Optimized scroll performance
- Intersection observer for lazy loading
- Message grouping for readability
- Date separators
- Typing indicator at bottom

**4.6 ChatViewInput Component**
- Fixed bottom toolbar
- Keyboard-aware positioning
- Auto-expanding text input
- Mobile-optimized emoji picker
- Send button prominence
- Attachment button (placeholder)
- Voice message button (placeholder)

**4.7 Mobile Navigation Integration**
- Add Messages to navigation menu
- Message count badge on nav icon
- Navigation transitions
- Deep linking support (/messages/:username)
- Back button handling

**4.8 Touch Gestures**
- Swipe to go back
- Swipe on conversation for actions
- Long-press for message actions
- Pull-to-refresh
- Double-tap message to react (future)

**4.9 Mobile Optimizations**
- Virtualized message list for performance
- Image lazy loading
- Reduced animation complexity
- Service worker for offline support (future)
- Optimistic UI for instant feedback

**Testing Focus:**
- Touch interaction testing on devices
- Keyboard behavior on iOS and Android
- Performance with large message lists
- Gesture recognition accuracy
- Safe area and notch handling
- Cross-browser mobile testing

**Success Metrics:**
- Smooth 60fps scrolling
- Keyboard interactions work flawlessly
- Gestures feel natural and responsive
- No layout shift issues
- Works on iOS Safari and Chrome Android
- Passes mobile accessibility audit

---

### Phase 5: Advanced Features (Week 7)

**Objectives:**
- Implement optimized polling
- Add typing indicators
- Create read receipts
- Build notification system
- Implement Resource Credit management

**Deliverables:**

**5.1 Advanced Polling System**
- Two-tier polling (active vs discovery)
- Adaptive polling intervals
- Background throttling when app inactive
- Incremental fetching (block-based)
- Polling pause/resume on visibility change
- WebWorker for background polling (future)

**5.2 Typing Indicators**
- Typing detection with debouncing
- Typing status broadcast via custom_json
- Typing indicator UI component
- Auto-hide after inactivity
- Throttle broadcasts to save RC

**5.3 Read Receipts**
- Read status tracking in state
- Mark-as-read on conversation open
- Read receipt custom_json operations
- Double-checkmark UI indicators
- Batch read receipts to save RC
- Privacy settings for read receipts

**5.4 Browser Notifications**
- Notification permission request flow
- Show notifications when app backgrounded
- Notification click handling (focus chat)
- Notification grouping by sender
- Sound effects (configurable)
- Do Not Disturb mode

**5.5 In-App Notifications**
- Integration with existing NotificationBox
- New message alerts (when chat closed)
- Send failure alerts
- System notifications (low RC, etc.)
- Notification action buttons
- Notification history

**5.6 Resource Credit Management**
- RC checking before message send
- RC balance display in settings
- Low RC warnings
- Message send throttling on low RC
- RC delegation suggestions
- RC usage statistics

**5.7 Online Status**
- Activity tracking (last seen)
- Online status custom_json broadcasts
- Online status polling
- Online/offline indicators in UI
- Privacy settings for online status

**5.8 Message Actions**
- Copy message text
- Delete message (local only)
- Edit message (within 15 minutes)
- Reply/quote message
- Forward message (future)
- Message reactions (future)

**Testing Focus:**
- Polling efficiency and accuracy
- Typing indicator reliability
- Read receipt consistency
- Notification delivery
- RC calculation accuracy

**Success Metrics:**
- Polling detects messages within 10-15 seconds
- Typing indicators appear within 2 seconds
- Read receipts accurate 99% of time
- Notifications work across all browsers
- RC warnings prevent send failures

---

### Phase 6: Polish & Optimization (Week 8)

**Objectives:**
- Performance optimization
- Theme integration completion
- Accessibility improvements
- Error handling enhancement
- User experience refinement

**Deliverables:**

**6.1 Performance Optimization**
- Message list virtualization (react-window)
- Lazy loading for images
- Debouncing and throttling optimization
- Redux state normalization review
- Memoization of expensive computations
- Code splitting for chat routes
- Bundle size optimization

**6.2 Theme Integration**
- Light mode color scheme for chat components
- Night mode color scheme
- Smooth theme transitions
- Theme-aware SVG icons
- Contrast ratio validation
- Custom theme properties for chat

**6.3 Accessibility**
- ARIA labels for all interactive elements
- Keyboard navigation for all features
- Screen reader testing and optimization
- Focus management for modals and windows
- High contrast mode support
- Reduced motion mode support

**6.4 Error Handling**
- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms for failed operations
- Network error handling
- Blockchain error interpretation
- Graceful degradation

**6.5 Loading States**
- Skeleton screens for all loading states
- Progress indicators for message sending
- Shimmer effects during fetch
- Optimistic UI with loading overlays
- Timeout handling for long operations

**6.6 Animations & Transitions**
- Message send animations
- Chat window open/close transitions
- List item animations
- Smooth scrolling
- Micro-interactions (hover effects, etc.)
- Performance-optimized animations (GPU acceleration)

**6.7 Edge Case Handling**
- Very long messages (truncation/expand)
- Unicode and emoji rendering
- Right-to-left language support
- Timezone handling for timestamps
- Duplicate message prevention
- Out-of-order message handling

**6.8 User Preferences**
- Settings page for messaging
- Notification preferences
- Sound preferences
- Polling interval configuration
- Transfer amount configuration
- Data usage settings

**Testing Focus:**
- Performance benchmarking
- Accessibility audit (WCAG 2.1 AA)
- Error scenario testing
- Cross-browser compatibility
- Theme switching stress test

**Success Metrics:**
- Lighthouse performance score > 90
- Lighthouse accessibility score > 95
- Zero accessibility violations
- All error scenarios handled gracefully
- Smooth 60fps animations

---

### Phase 7: Testing & Quality Assurance (Week 9)

**Objectives:**
- Comprehensive testing coverage
- Bug identification and fixing
- Performance validation
- Security audit
- User acceptance testing preparation

**Deliverables:**

**7.1 Unit Testing**
- Service layer function tests
- Redux reducer tests
- Redux saga tests
- Utility function tests
- Encryption/decryption tests
- Target: >80% code coverage

**7.2 Integration Testing**
- End-to-end message flow tests
- Keychain integration tests
- Polling mechanism tests
- State management integration tests
- API interaction tests

**7.3 Component Testing**
- React component render tests
- User interaction tests
- Props variation tests
- State change tests
- Event handler tests

**7.4 End-to-End Testing**
- Complete user journey tests (Cypress)
- Multi-user messaging scenarios
- Cross-browser E2E tests
- Mobile E2E tests
- Error recovery tests

**7.5 Performance Testing**
- Load testing with many messages
- Stress testing with rapid message sending
- Memory leak detection
- Polling performance validation
- Bundle size analysis

**7.6 Security Testing**
- Encryption strength validation
- Key management security review
- XSS vulnerability testing
- Input sanitization verification
- Privacy leak detection

**7.7 Usability Testing**
- User testing sessions (5-10 users)
- Task completion testing
- Confusion matrix analysis
- Mobile usability testing
- Accessibility user testing

**7.8 Bug Fixing**
- Bug triage and prioritization
- Critical bug fixes
- Edge case handling
- Performance issue resolution
- UI/UX refinements based on feedback

**Testing Focus:**
- Complete test coverage
- Real-world scenario validation
- Cross-platform testing
- Security verification

**Success Metrics:**
- >80% unit test coverage
- All critical paths E2E tested
- Zero critical bugs remaining
- Performance targets met
- Security audit passed

---

### Phase 8: Deployment & Launch (Week 10)

**Objectives:**
- Production deployment
- Monitoring setup
- Documentation completion
- User onboarding preparation
- Post-launch support planning

**Deliverables:**

**8.1 Production Build**
- Optimized production build
- Environment configuration
- Source map generation
- Bundle analysis and optimization
- Cache invalidation strategy

**8.2 Deployment**
- Deployment to production environment
- CDN configuration
- SSL certificate validation
- Service worker deployment (if applicable)
- Rollback plan preparation

**8.3 Monitoring Setup**
- Error tracking (Sentry or similar)
- Analytics integration
- Performance monitoring
- User behavior tracking
- API error logging

**8.4 Documentation**
- User guide for messaging features
- FAQ documentation
- Troubleshooting guide
- Developer documentation
- API documentation

**8.5 User Onboarding**
- First-time user tutorial
- Feature discovery prompts
- Helpful tooltips
- Welcome message flow
- Help section in UI

**8.6 Announcement & Communication**
- Blog post announcing feature
- Social media announcements
- Email to existing users
- In-app announcement banner
- Community Discord/Telegram posts

**8.7 Support Preparation**
- Support team training
- Common issue documentation
- Support ticket categories
- Escalation procedures
- Community moderator briefing

**8.8 Post-Launch Monitoring**
- 24/7 monitoring for first 48 hours
- Rapid response team on standby
- User feedback collection
- Bug report triage
- Performance monitoring

**Testing Focus:**
- Production environment validation
- Smoke testing post-deployment
- Rollback procedure testing

**Success Metrics:**
- Zero-downtime deployment
- <1% error rate in first week
- Positive user feedback
- Successful onboarding completion >70%
- No critical post-launch bugs

---

## 5. Data Models

### 5.1 Message Object Structure

**Properties:**
- messageId: Unique identifier (UUID or txId)
- from: Sender username
- to: Recipient username
- content: Decrypted message text
- encryptedContent: Original encrypted content (for caching)
- timestamp: Unix timestamp (milliseconds)
- blockNum: Blockchain block number
- txId: Blockchain transaction ID
- type: "transfer" or "custom_json"
- status: "pending", "confirmed", "failed"
- read: Boolean read status
- deleted: Boolean deletion flag (local only)
- edited: Boolean edit flag
- editedAt: Timestamp of edit
- replyTo: Message ID if replying to another message

**Derived Properties:**
- isSent: from === currentUser
- isReceived: to === currentUser
- formattedTime: Human-readable timestamp
- dayGroup: Date string for grouping (YYYY-MM-DD)

### 5.2 Conversation Object Structure

**Properties:**
- username: Partner username
- displayName: Partner display name (from profile)
- avatar: Partner avatar URL
- publicMemoKey: Cached public memo key
- lastMessage: Last message object
- lastActivity: Timestamp of last activity
- unreadCount: Number of unread messages
- lastFetchedBlock: Last blockchain block fetched
- lastPolled: Timestamp of last polling
- status: "active", "archived", "muted"
- isTyping: Boolean typing indicator
- isPinned: Boolean pinned status
- notifications: "all", "mentions", "none"

**Derived Properties:**
- isOnline: Based on last activity < 5 minutes
- hasUnreadMessages: unreadCount > 0
- lastActivityFormatted: Relative time string
- sortOrder: Calculated based on lastActivity and isPinned

### 5.3 Blockchain Operation Structures

**Transfer Operation for Messages:**
- operation: "transfer"
- from: Sender username
- to: Recipient username
- amount: "0.001 HIVE" or "0.001 HBD"
- memo: "DBUZZ:{encrypted_message}" or "#{encrypted_message}"

**Custom JSON Operation for Messages:**
- operation: "custom_json"
- required_auths: Empty array
- required_posting_auths: [sender_username]
- id: "dbuzz_dm"
- json: JSON string containing:
  - app: "dbuzz/1.0.0"
  - v: Version number (1)
  - type: "message"
  - to: Recipient username
  - from: Sender username
  - encrypted_content: Encrypted message
  - timestamp: Unix timestamp
  - message_id: UUID
  - reply_to: Optional message ID

**Custom JSON for Read Receipts:**
- operation: "custom_json"
- id: "dbuzz_dm_read"
- json:
  - type: "read_receipt"
  - message_ids: Array of message IDs
  - read_by: Current user
  - timestamp: Unix timestamp

**Custom JSON for Typing Indicators:**
- operation: "custom_json"
- id: "dbuzz_dm_typing"
- json:
  - type: "typing"
  - to: Recipient username
  - from: Sender username
  - timestamp: Unix timestamp

### 5.4 LocalStorage Schema

**Message Cache:**
- Key: "dbuzz_messages_{username}_{partner}"
- Value: Array of message objects
- TTL: 7 days

**Conversation Cache:**
- Key: "dbuzz_conversations_{username}"
- Value: Object mapping partner username to conversation object
- TTL: 24 hours

**Memo Key Cache:**
- Key: "dbuzz_memokeys"
- Value: Object mapping username to {publicKey, fetchedAt}
- TTL: 24 hours

**User Preferences:**
- Key: "dbuzz_message_settings_{username}"
- Value: Settings object
- No TTL (persistent)

**Last Fetched Blocks:**
- Key: "dbuzz_last_blocks_{username}"
- Value: Object mapping partner to last block number
- No TTL (persistent)

### 5.5 Redux State Schema

**Immutable.js Structure:**
- Map for conversations (key: username)
- Map for messages (key: username, value: List of message Maps)
- List for activeChats
- Map for ui state
- Map for memoKeys cache
- Map for polling state
- Map for settings

**State Normalization:**
- Conversations and messages stored separately
- Messages referenced by conversation
- No nested deep structures
- Efficient updates and lookups

---

## 6. Message Flow Diagrams

### 6.1 New Conversation Flow

**User A sends first message to User B:**

1. User A opens chat interface
2. User A types message to User B
3. App checks: Does conversation exist? → No
4. App determines: Use transfer operation
5. App fetches User B's public memo key
6. App encrypts message using User A's private key + User B's public key
7. App generates transfer operation (0.001 HIVE + encrypted memo)
8. App broadcasts operation to blockchain (via Keychain or WIF)
9. App adds optimistic message to UI
10. Blockchain confirms transaction (3 seconds)
11. Transfer appears in User A's account history
12. Transfer appears in User B's account history

**User B discovers message:**

1. User B's app polls their account for incoming transfers (30s interval)
2. App detects transfer from User A with DBUZZ prefix
3. App decrypts transfer memo using User B's private key
4. App creates new conversation for User A
5. App adds message to conversation
6. App shows browser notification "New message from @userA"
7. App updates message badge count
8. User B clicks notification, opens chat with User A

### 6.2 Ongoing Conversation Flow

**User B replies to User A:**

1. User B types reply message
2. App checks: Does conversation exist? → Yes
3. App determines: Use custom_json operation (cheaper)
4. App encrypts message using User B's private key + User A's public key
5. App generates custom_json operation with id='dbuzz_dm'
6. App broadcasts operation to blockchain
7. App adds optimistic message to UI
8. Custom_json operation appears in User B's account history

**User A receives reply:**

1. User A's app actively polls User B's account (10s interval, chat is open)
2. App detects new custom_json operation with id='dbuzz_dm'
3. App filters: Is this message to User A? → Yes
4. App decrypts message content
5. App adds message to conversation state
6. UI automatically updates to show new message
7. Auto-scroll to bottom of chat window

### 6.3 Multi-Message Conversation Flow

**Continuous back-and-forth:**

1. Both users have conversation open
2. Active polling (10s interval) for both users
3. Each message sent as custom_json (no transfer cost)
4. Messages appear within 10-15 seconds on average
5. Optimistic UI shows immediate feedback
6. Blockchain confirmation updates message status
7. Read receipts exchanged as messages are read
8. Typing indicators broadcast during typing

### 6.4 Re-Awakening Inactive Conversation

**User A messages User B after 24+ hours of inactivity:**

1. User A opens existing chat with User B
2. App checks last activity: > 24 hours ago
3. App determines: Use transfer to re-ping
4. App sends transfer operation (0.001 HIVE)
5. Ensures User B will see incoming transfer
6. Conversation reactivated
7. Subsequent messages use custom_json again

### 6.5 Polling Cycle Diagram

**Active Conversation Polling (10 second cycle):**
```
[Start] → Get Active Chats List
       ↓
       For Each Partner:
       ↓
       Fetch Partner's Account History
       ↓
       Filter custom_json (id='dbuzz_dm')
       ↓
       Extract New Messages (since last block)
       ↓
       Decrypt Messages
       ↓
       Update Redux State
       ↓
       Update UI
       ↓
       Wait 10 Seconds → [Loop]
```

**New Conversation Discovery (30 second cycle):**
```
[Start] → Fetch Current User's Transfer History
       ↓
       Filter Incoming Transfers
       ↓
       Filter for DBUZZ Prefix
       ↓
       Parse and Decrypt Messages
       ↓
       Group by Sender (Conversations)
       ↓
       Compare with Existing Conversations
       ↓
       Identify New Conversations
       ↓
       Show Notifications for New
       ↓
       Update Conversation List
       ↓
       Wait 30 Seconds → [Loop]
```

---

## 7. Security & Encryption

### 7.1 Encryption Strategy

**Algorithm:**
- Elliptic Curve Cryptography (secp256k1)
- Same curve used by Bitcoin and Hive
- Shared secret generation via ECDH
- AES-256 encryption of message content
- Native to Hive memo encryption

**Key Management:**
- Public keys fetched from blockchain (account.memo_key)
- Private keys:
  - Keychain users: Keys never exposed, Keychain handles encryption
  - Direct login users: Derived from master password, stored encrypted
- Shared secrets never stored, regenerated each time
- No key transmission over network

**Encryption Process:**
1. Fetch recipient's public memo key from blockchain
2. Generate shared secret using sender's private key + recipient's public key
3. Use shared secret as AES-256 key
4. Encrypt message content with AES-256
5. Encode encrypted bytes as base64
6. Add # prefix to indicate encryption
7. Attach to blockchain operation

**Decryption Process:**
1. Detect encrypted message by # prefix
2. Fetch sender's public memo key
3. Regenerate shared secret using recipient's private key + sender's public key
4. Decode base64 to encrypted bytes
5. Decrypt using AES-256 with shared secret
6. Validate and display plain text

### 7.2 Threat Model

**Threats Mitigated:**
- Blockchain surveillance: Content encrypted, only metadata visible
- Man-in-the-middle attacks: Public keys verified on blockchain
- Replay attacks: Unique message IDs and timestamps
- Message tampering: Blockchain immutability guarantees
- Key theft via phishing: Keychain integration reduces exposure

**Threats NOT Fully Mitigated:**
- Metadata analysis: Sender/recipient/timing visible on blockchain
- Endpoint compromise: If device compromised, messages readable
- Keychain/password theft: Full access to messages
- Quantum computing: secp256k1 vulnerable to future quantum attacks

### 7.3 Privacy Considerations

**What's Public on Blockchain:**
- Message sender and recipient usernames
- Timestamp of message
- Fact that a message was sent
- Frequency and timing of messages
- Message existence (not content)

**What's Private:**
- Message content (encrypted)
- Message length (padded)
- Message subject/topic
- Attachments (if added)

**Privacy Best Practices:**
- Use Keychain when possible (better key management)
- Don't reuse passwords across services
- Lock Keychain when not in use
- Use strong master password
- Be aware metadata is public
- Consider message frequency privacy implications

### 7.4 Security Best Practices

**Implementation Security:**
- Input sanitization for all user input
- XSS prevention in message rendering
- CSP headers for additional protection
- Secure random number generation for UUIDs
- Constant-time comparison for sensitive operations
- Memory clearing after decryption (where possible)

**Key Storage Security:**
- Never log private keys
- Never transmit private keys
- Encrypt stored keys (for non-Keychain users)
- Use secure session storage
- Clear keys on logout
- Prompt for password on sensitive operations

**Operational Security:**
- HTTPS only (no mixed content)
- Secure cookie flags
- Regular security audits
- Dependency vulnerability scanning
- Bug bounty program consideration
- Incident response plan

### 7.5 Compliance & Legal

**Data Protection:**
- No personal data stored on servers (fully decentralized)
- User controls own data via blockchain keys
- Right to be forgotten: User can stop using service
- Data portability: Messages on public blockchain

**Encryption Regulations:**
- Comply with local encryption laws
- Provide warnings in jurisdictions with restrictions
- No backdoors or key escrow
- Open-source encryption implementation

---

## 8. Performance Optimization

### 8.1 Frontend Performance

**React Optimization:**
- Use React.memo for expensive components
- useMemo and useCallback for expensive computations
- Virtualized lists with react-window for large message lists
- Code splitting for chat routes with React.lazy
- Lazy load images with intersection observer
- Debounce expensive operations (typing indicators, scroll handlers)
- Throttle polling when appropriate

**Redux Performance:**
- Normalize state structure (flat, not nested)
- Use Immutable.js for efficient updates
- Selector memoization with reselect
- Batch action dispatches where possible
- Avoid unnecessary re-renders with shallow equality checks
- Use Redux DevTools to identify bottlenecks

**Render Optimization:**
- Minimize component re-renders
- Use key props correctly for lists
- Avoid inline function creation in render
- Optimize Material-UI theme usage
- Use CSS-in-JS efficiently (avoid recreating styles)
- GPU-accelerated animations (transform, opacity)

**Bundle Optimization:**
- Tree-shaking unused code
- Dynamic imports for chat feature
- Separate vendor bundles
- Compress assets (gzip/brotli)
- Optimize images and icons
- Remove unused dependencies
- Analyze bundle with webpack-bundle-analyzer

### 8.2 Blockchain API Performance

**API Call Optimization:**
- Batch API calls where possible
- Cache public memo keys (24 hour TTL)
- Use operation type filtering to reduce data transfer
- Implement request deduplication
- Use limit parameters to fetch only needed data
- Retry failed requests with exponential backoff
- Failover to alternate RPC nodes on errors

**Polling Optimization:**
- Adaptive polling intervals based on activity
- Incremental fetching (only new blocks)
- Pause polling when app backgrounded
- Use last fetched block number as cursor
- Debounce polling triggers
- Cancel in-flight requests on new poll
- WebWorker for background polling (future)

**Caching Strategy:**
- LocalStorage for message history (7 day TTL)
- SessionStorage for temporary data
- In-memory cache for active conversations
- IndexedDB for large datasets (future)
- Cache invalidation on logout
- Stale-while-revalidate pattern

### 8.3 Message Processing Performance

**Encryption/Decryption:**
- Parallel decryption for multiple messages
- Web Worker for heavy encryption operations (future)
- Cache decrypted messages in state
- Lazy decryption (decrypt on view, not on fetch)
- Reuse shared secrets when possible

**Message Parsing:**
- Stream processing for large histories
- Early filtering to reduce processing
- Efficient JSON parsing
- Avoid unnecessary iterations
- Use native array methods (map, filter, reduce)

**State Updates:**
- Batch state updates where possible
- Use Immutable.js efficiently (avoid toJS() calls)
- Update only changed paths in state tree
- Avoid deep cloning when unnecessary

### 8.4 UI Performance

**Scrolling Performance:**
- Virtual scrolling for long message lists
- Intersection observer for lazy loading
- Scroll event throttling
- CSS containment for chat windows
- will-change hints for animated elements
- Avoid layout thrashing

**Animation Performance:**
- Use transform and opacity for animations
- requestAnimationFrame for custom animations
- CSS transitions over JavaScript animations
- Reduce animation complexity on mobile
- Disable animations in reduced motion mode
- GPU acceleration with transform3d

**Image Performance:**
- Lazy load images below fold
- Use appropriate image formats (WebP, AVIF)
- Responsive images with srcset
- Image compression and optimization
- Blur-up placeholder technique
- Cache images in browser cache

### 8.5 Mobile Performance

**Mobile-Specific Optimizations:**
- Reduce JavaScript bundle size
- Touch event handling optimization
- Passive event listeners
- Reduce network requests
- Optimize for 3G networks
- Battery usage optimization
- Memory usage optimization

**Progressive Enhancement:**
- Core functionality works without JavaScript
- Graceful degradation for older devices
- Adaptive loading based on device capability
- Detect device performance and adjust

### 8.6 Performance Monitoring

**Metrics to Track:**
- Time to first message display
- Message send latency
- Polling efficiency (messages detected per poll)
- Bundle size over time
- API call volume and duration
- Error rates by operation type
- User engagement metrics

**Tools:**
- Lighthouse for auditing
- Chrome DevTools Performance tab
- React DevTools Profiler
- Redux DevTools for state analysis
- Network throttling for testing
- Real User Monitoring (RUM)

**Performance Budgets:**
- Initial bundle: < 250KB gzipped
- Chat bundle: < 100KB gzipped
- Time to Interactive: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Largest Contentful Paint: < 2.5 seconds
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

---

## 9. User Experience

### 9.1 User Flows

**First-Time User Flow:**
1. User logs into D.Buzz
2. User sees floating chat button (desktop) or Messages in nav (mobile)
3. User clicks to open messages interface
4. Empty state with illustration and "Start a conversation" prompt
5. User searches for username to message
6. User types first message
7. Warning appears: "First message costs 0.001 HIVE"
8. User confirms and sends
9. Success message: "Message sent! Future messages are free."
10. Chat window/view displays with sent message
11. User waits for response (polling happens in background)
12. Notification when reply received

**Returning User Flow:**
1. User opens D.Buzz with existing conversations
2. Desktop: Badge on chat button shows unread count
3. Mobile: Badge on Messages nav icon
4. User opens conversation list
5. Conversations sorted by most recent activity
6. User clicks conversation with unread badge
7. Chat opens, scrolls to first unread message
8. User reads messages, types reply
9. Reply sent via custom_json (no additional cost)
10. Messages marked as read automatically
11. Conversation continues seamlessly

**Mobile-Specific Flow:**
1. User opens D.Buzz on mobile
2. Taps Messages in bottom navigation
3. Full-screen conversation list appears
4. User swipes down to refresh
5. User taps conversation
6. Full-screen chat view opens
7. User reads messages while scrolling
8. User taps input field, keyboard appears
9. View adjusts to keep input visible
10. User types and sends message
11. Message appears with send animation
12. User taps back to conversation list

### 9.2 Onboarding Experience

**First Message Tutorial:**
- Modal overlay explaining messaging feature
- Step-by-step guide:
  1. How to start a conversation
  2. First message cost (0.001 HIVE)
  3. Subsequent messages are free (RC only)
  4. Messages are private and encrypted
  5. Message discovery takes 10-30 seconds
- "Don't show again" checkbox
- Dismissible with X button

**Feature Discovery:**
- Tooltips on first interaction with each feature
- Contextual help for complex operations
- Empty states with clear calls-to-action
- Inline hints for keyboard shortcuts
- Progressive disclosure of advanced features

**Help Resources:**
- FAQ section in settings
- Link to messaging documentation
- In-app help button
- Support chat link
- Video tutorial (future)

### 9.3 Error States & Recovery

**Network Errors:**
- Show clear message: "Network error, retrying..."
- Automatic retry with backoff
- Manual retry button if auto-retry fails
- Offline indicator in UI
- Queue messages for sending when online

**Send Failures:**
- Mark message with red error icon
- Show error message: "Failed to send. Tap to retry."
- Tap message to retry sending
- Delete unsent message option
- Preserve message text in input on failure

**Decryption Errors:**
- Show placeholder: "[Unable to decrypt message]"
- Explain possible causes (wrong key, corrupted data)
- Retry button
- Contact support option
- Don't crash or hide message entirely

**Low Resource Credits:**
- Warning before sending if RC low
- Explain RC and how to get more
- Suggest waiting for RC regeneration
- Link to HP delegation resources
- Throttle sends to prevent exhaustion

**Keychain Errors:**
- Detect if Keychain not installed
- Prompt to install with link
- Detect if Keychain locked
- Prompt to unlock
- Handle user rejection gracefully
- Fallback to direct login option

**Blockchain Errors:**
- Interpret blockchain error codes
- Show user-friendly messages
- Retry with different RPC node
- Fallback options when available
- Report error to monitoring system

### 9.4 Loading States

**Initial Load:**
- Skeleton screen for conversation list
- Shimmer animation during fetch
- Progressive loading (show cached first)
- Smooth transition to loaded state

**Sending Message:**
- Disable send button during send
- Show spinner on send button
- Optimistic message with "sending..." indicator
- Change to checkmark on confirmation
- Smooth animation for state changes

**Loading Messages:**
- Show loading spinner at top when fetching history
- Maintain scroll position during load
- Smooth insertion of loaded messages
- No jarring layout shifts

**Polling Indication:**
- Subtle indicator showing "checking for new messages"
- Only show on manual action or slow network
- Don't distract from conversation

### 9.5 Accessibility

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter to open chat, send message
- Escape to close chat window
- Arrow keys for message navigation (future)
- Keyboard shortcuts visible in help

**Screen Reader Support:**
- ARIA labels on all buttons and inputs
- ARIA live regions for new messages
- Descriptive alt text for images and icons
- Semantic HTML structure
- Announce message send status
- Announce new message arrivals

**Visual Accessibility:**
- High contrast mode support
- Minimum contrast ratio 4.5:1 for text
- Large touch targets (min 44x44px) on mobile
- Clear focus indicators
- Support for browser zoom up to 200%
- No information conveyed by color alone

**Motion Accessibility:**
- Respect prefers-reduced-motion
- Disable animations when requested
- Provide instant alternative to animations
- No auto-playing animations

**Cognitive Accessibility:**
- Clear, simple language in UI
- Consistent UI patterns
- Helpful error messages
- Confirmation for destructive actions
- Undo options where applicable

---

## 10. Testing Strategy

### 10.1 Testing Pyramid

**Unit Tests (70% of tests):**
- All service layer functions
- Redux reducers
- Redux action creators
- Utility functions
- Encryption/decryption
- Message parsing
- Operation generation

**Integration Tests (20% of tests):**
- Redux saga workflows
- Component + Redux integration
- API + service layer integration
- Keychain integration flows
- Multi-component interactions

**End-to-End Tests (10% of tests):**
- Complete user journeys
- Critical paths (send/receive messages)
- Cross-browser scenarios
- Mobile scenarios
- Error recovery flows

### 10.2 Unit Testing

**Testing Framework:**
- Jest for test runner
- React Testing Library for component tests
- Redux mock store for state testing

**Coverage Goals:**
- Overall: >80%
- Service layer: >90%
- Redux reducers: 100%
- Critical paths: 100%

**Test Categories:**

**Encryption Service Tests:**
- Encrypt message successfully
- Decrypt message successfully
- Round-trip encryption/decryption
- Handle encryption errors
- Handle decryption errors
- Cache memo keys correctly

**Message Operations Tests:**
- Generate valid transfer operation
- Generate valid custom_json operation
- Include correct metadata
- Handle missing parameters
- Generate unique message IDs

**Message Fetching Tests:**
- Fetch and parse transfers
- Fetch and parse custom_json
- Combine multiple operation types
- Filter for relevant messages only
- Handle empty results
- Handle API errors

**Redux Reducer Tests:**
- Initial state correct
- Handle all action types
- State remains immutable
- Conversations update correctly
- Messages added to correct conversation
- Unread counts accurate

**Redux Saga Tests:**
- Send message saga complete flow
- Fetch messages saga complete flow
- Polling saga runs continuously
- Error handling in sagas
- Optimistic updates work
- Confirmation updates work

### 10.3 Integration Testing

**Redux Integration:**
- Action → Saga → Reducer flow
- Multiple actions updating state correctly
- State selectors return correct data
- State changes trigger re-renders

**Component Integration:**
- Component receives props from Redux
- Component dispatches actions correctly
- Multiple components share state
- Parent-child component communication

**API Integration:**
- Service layer calls Hive API correctly
- Responses parsed correctly
- Errors handled appropriately
- Retries work as expected
- Failover to backup RPC nodes

**Keychain Integration:**
- Detect Keychain presence
- Encode messages via Keychain
- Decode messages via Keychain
- Broadcast via Keychain
- Handle Keychain errors

### 10.4 End-to-End Testing

**E2E Framework:**
- Cypress for browser automation
- Mobile device emulation
- Network throttling for testing

**Critical User Journeys:**

**Journey 1: Send First Message**
1. User logs in
2. Opens messaging interface
3. Searches for recipient
4. Types message
5. Sees transfer fee warning
6. Confirms and sends
7. Message appears in UI
8. Receives confirmation

**Journey 2: Receive and Reply**
1. User logs in with existing message
2. Sees unread badge
3. Opens conversation
4. Reads message
5. Types reply
6. Sends reply (custom_json)
7. Reply appears in conversation

**Journey 3: Multi-Message Conversation**
1. Two users messaging back-and-forth
2. Messages appear for both users
3. Typing indicators work
4. Read receipts update
5. Timestamps display correctly

**Journey 4: Error Recovery**
1. User tries to send with low RC
2. Sees error message
3. Waits for RC regeneration
4. Retries successfully

**Journey 5: Mobile Experience**
1. User opens on mobile
2. Navigates to Messages
3. Opens conversation
4. Sends message with keyboard open
5. Receives reply with notification
6. Swipe actions work

**Cross-Browser Testing:**
- Chrome (desktop and mobile)
- Firefox
- Safari (desktop and iOS)
- Edge
- Mobile browsers (iOS Safari, Chrome Android)

### 10.5 Performance Testing

**Load Testing:**
- Render 1000 messages in conversation
- Open 3 simultaneous chat windows
- Poll 10 active conversations
- Measure memory usage over time
- Measure CPU usage during heavy use

**Stress Testing:**
- Rapid message sending (10 messages in 10 seconds)
- Receive burst of messages
- Switch between conversations rapidly
- Open/close windows repeatedly
- Large message content (10KB text)

**Benchmarking:**
- Time to decrypt 100 messages
- Time to parse account history
- Time to render message list
- State update performance
- Bundle load time

### 10.6 Security Testing

**Encryption Validation:**
- Encrypted messages unreadable without key
- Decryption requires correct private key
- Shared secret generated correctly
- No key leakage in logs or errors

**XSS Testing:**
- Script injection in message content
- HTML injection in usernames
- Link injection in messages
- Emoji exploitation attempts

**Privacy Testing:**
- Message content not visible on blockchain
- Decrypted messages not stored insecurely
- Keys not transmitted over network
- LocalStorage cleared on logout

**Vulnerability Scanning:**
- Dependency vulnerability checks (npm audit)
- OWASP Top 10 testing
- Automated security scanning
- Manual penetration testing

### 10.7 Usability Testing

**User Testing Sessions:**
- 5-10 users per round
- Mix of technical and non-technical users
- Observe task completion
- Record confusion points
- Collect qualitative feedback

**Tasks for Users:**
1. Send first message to someone
2. Reply to received message
3. Find specific message in history
4. Change notification settings
5. Understand transfer fee warning

**Success Metrics:**
- Task completion rate >80%
- Time to complete <2 minutes
- User satisfaction score >4/5
- No critical confusion points
- Clear understanding of costs

**A/B Testing (Post-Launch):**
- Transfer amount (0.001 vs 0.01 HIVE)
- Polling intervals (10s vs 15s)
- UI variations (chat window size, etc.)
- Notification wording
- Onboarding flow variants

---

## 11. Deployment Plan

### 11.1 Pre-Deployment Checklist

**Code Quality:**
- All tests passing
- Code review completed
- No console.log statements
- Linting passes (ESLint)
- Type checking passes (if using TypeScript)
- Documentation updated
- CHANGELOG.md updated

**Build Verification:**
- Production build succeeds
- Bundle size within budget
- Source maps generated
- Environment variables configured
- Feature flags set correctly
- No hardcoded credentials or keys

**Testing Verification:**
- Unit tests >80% coverage
- Integration tests passing
- E2E tests passing
- Performance benchmarks met
- Security scan completed
- Cross-browser testing done

**Infrastructure:**
- Deployment scripts ready
- Rollback procedure tested
- Monitoring configured
- Error tracking set up
- Analytics configured
- CDN cache invalidation planned

### 11.2 Deployment Strategy

**Phased Rollout:**

**Phase 1: Internal Testing (Week 10, Day 1-2)**
- Deploy to staging environment
- Test with internal team
- Verify all features work
- Load test with simulated users
- Fix any critical bugs

**Phase 2: Beta Release (Week 10, Day 3-4)**
- Enable for 5-10% of users
- Monitor error rates closely
- Collect user feedback
- Fix any issues quickly
- Gradually increase to 25%

**Phase 3: General Release (Week 10, Day 5-7)**
- Enable for 100% of users
- Announce via blog and social media
- Monitor performance and errors
- Provide active support
- Iterate based on feedback

**Deployment Steps:**
1. Merge feature branch to main
2. Tag release version (v1.0.0)
3. Run CI/CD pipeline
4. Build production bundle
5. Upload assets to CDN
6. Deploy to hosting platform
7. Invalidate CDN cache
8. Run smoke tests
9. Monitor error rates
10. Announce release

### 11.3 Monitoring & Observability

**Error Tracking:**
- Integrate Sentry or similar
- Track JavaScript errors
- Track API failures
- Track blockchain operation failures
- Set up error alerts (PagerDuty, Slack)

**Performance Monitoring:**
- Real User Monitoring (RUM)
- Track page load times
- Track API response times
- Track polling efficiency
- Track message delivery latency

**Analytics:**
- User adoption rate
- Messages sent per day
- Active conversations per user
- Average message latency
- Feature usage (typing indicators, read receipts, etc.)
- Error rates by feature
- User retention metrics

**Logging:**
- Application logs
- API request logs
- Blockchain operation logs
- User action logs (privacy-respecting)
- Performance logs

**Alerting:**
- Error rate >1% → Alert immediately
- API latency >2s → Alert
- Message delivery failure >5% → Alert
- Server downtime → Alert immediately
- Unusual traffic patterns → Alert

### 11.4 Rollback Plan

**Rollback Triggers:**
- Critical bug affecting >10% users
- Security vulnerability discovered
- Performance degradation >50%
- Message delivery failure >10%
- Data loss or corruption

**Rollback Procedure:**
1. Identify issue severity
2. Decision to rollback made
3. Deploy previous version tag
4. Invalidate CDN cache
5. Verify rollback successful
6. Notify users of temporary issue
7. Fix issue in development
8. Deploy fix as patch release

**Rollback Testing:**
- Test rollback procedure in staging
- Verify data compatibility
- Ensure no data loss during rollback
- Document rollback time (target: <5 minutes)

### 11.5 Post-Deployment

**First 24 Hours:**
- Team on call for issues
- Monitor error rates continuously
- Respond to user reports quickly
- Fix critical bugs immediately
- Hot-fix deployment if necessary

**First Week:**
- Daily monitoring of metrics
- Collect user feedback
- Identify usability issues
- Plan quick iterations
- Communicate with users

**First Month:**
- Weekly performance reviews
- Analyze user adoption
- Identify feature gaps
- Plan enhancements
- Iterate based on data

**Documentation Updates:**
- Update user guide with real screenshots
- Add troubleshooting based on issues
- Create video tutorials
- Update FAQ with common questions
- Document known issues and workarounds

---

## 12. Risk Management

### 12.1 Technical Risks

**Risk: High Resource Credit Consumption**
- Probability: Medium
- Impact: High
- Mitigation:
  - Implement RC checking before operations
  - Throttle message sending on low RC
  - Use custom_json instead of transfers when possible
  - Display RC status to users
  - Educate users about RC and HP
- Contingency: Provide RC delegation service or partner with HP delegators

**Risk: Blockchain API Unavailability**
- Probability: Low
- Impact: High
- Mitigation:
  - Multi-node failover system (already exists)
  - Cache messages locally
  - Queue operations for retry
  - Graceful degradation when API down
- Contingency: Partner with multiple RPC providers

**Risk: Message Delivery Delays**
- Probability: Medium
- Impact: Medium
- Mitigation:
  - Optimize polling intervals
  - Adaptive polling based on activity
  - Optimistic UI for immediate feedback
  - Set user expectations (10-30s latency)
- Contingency: Add option for manual refresh

**Risk: Encryption Key Loss**
- Probability: Low
- Impact: High (for affected user)
- Mitigation:
  - Encourage Keychain usage
  - Warn users to backup keys
  - Provide key recovery documentation
  - No way to recover messages without key (by design)
- Contingency: Clear communication that messages are end-to-end encrypted

**Risk: Performance Issues at Scale**
- Probability: Medium
- Impact: Medium
- Mitigation:
  - Virtualized message lists
  - Aggressive caching
  - Code splitting
  - Performance budgets
  - Load testing before launch
- Contingency: Implement emergency performance mode

**Risk: Browser Compatibility Issues**
- Probability: Low
- Impact: Medium
- Mitigation:
  - Cross-browser testing
  - Polyfills for older browsers
  - Graceful degradation
  - Feature detection
- Contingency: Display browser compatibility warning

### 12.2 User Experience Risks

**Risk: User Confusion About Costs**
- Probability: High
- Impact: Medium
- Mitigation:
  - Clear warnings before first message
  - Explain transfer vs custom_json
  - Tutorial on first use
  - FAQ section
  - In-app help
- Contingency: Proactive support for confused users

**Risk: Expectation of Real-Time Messaging**
- Probability: High
- Impact: Low
- Mitigation:
  - Set expectations about 10-30s latency
  - Explain blockchain-based system
  - Optimize polling for best experience
  - Provide status indicators
- Contingency: Consider WebSocket push service (requires backend)

**Risk: Difficulty Finding Conversations**
- Probability: Medium
- Impact: Low
- Mitigation:
  - Search functionality in conversation list
  - Sort by recent activity
  - Pin important conversations
  - Badge for unread messages
- Contingency: Add filters and advanced search

**Risk: Spam Messages**
- Probability: Medium
- Impact: Medium
- Mitigation:
  - Transfer fee as spam deterrent (0.001 HIVE)
  - Block user functionality
  - Mute conversation feature
  - Report spam option (future)
- Contingency: Increase transfer fee if spam becomes issue

### 12.3 Security Risks

**Risk: Private Key Compromise**
- Probability: Low
- Impact: Critical
- Mitigation:
  - Recommend Keychain usage
  - Never store keys in plain text
  - Warn users about phishing
  - Encourage strong passwords
  - Two-factor authentication for accounts (Hive-level)
- Contingency: Advise user to change keys immediately

**Risk: Phishing Attacks**
- Probability: Medium
- Impact: High
- Mitigation:
  - Educate users about phishing
  - Display warnings about fake sites
  - Use official domain only
  - Clear branding and verification
- Contingency: Rapid response to phishing reports

**Risk: XSS Vulnerabilities**
- Probability: Low
- Impact: High
- Mitigation:
  - Input sanitization
  - Output encoding
  - Content Security Policy
  - Regular security audits
  - React's built-in XSS protection
- Contingency: Emergency patch deployment

**Risk: Metadata Privacy Leaks**
- Probability: High (by design)
- Impact: Low to Medium
- Mitigation:
  - Clearly communicate what's public (metadata)
  - Educate about blockchain transparency
  - Consider batching messages to obscure timing
- Contingency: Add privacy-focused mode (future)

### 12.4 Business Risks

**Risk: Low User Adoption**
- Probability: Medium
- Impact: High
- Mitigation:
  - Compelling onboarding
  - Clear value proposition
  - Promote feature heavily
  - Incentivize early adopters
  - Iterate based on feedback
- Contingency: User research to identify barriers

**Risk: High Support Burden**
- Probability: Medium
- Impact: Medium
- Mitigation:
  - Comprehensive documentation
  - In-app help and tutorials
  - FAQ covering common issues
  - Clear error messages
  - Self-service support tools
- Contingency: Scale support team temporarily

**Risk: Competitive Features**
- Probability: Low
- Impact: Low
- Mitigation:
  - Differentiate with decentralization
  - Emphasize privacy and ownership
  - Continuous improvement
  - Listen to user feedback
- Contingency: Rapid feature development

### 12.5 Compliance Risks

**Risk: Encryption Regulation Changes**
- Probability: Low
- Impact: High
- Mitigation:
  - Monitor regulatory landscape
  - Legal consultation
  - Comply with all current regulations
  - Transparent about encryption use
- Contingency: Ability to disable in restricted regions

**Risk: Data Protection Compliance**
- Probability: Low
- Impact: Medium
- Mitigation:
  - No personal data on servers (decentralized)
  - Clear privacy policy
  - User controls own data
  - GDPR-friendly by design
- Contingency: Legal review and adjustments

---

## 13. Future Enhancements

### 13.1 Short-Term Enhancements (3-6 months)

**Enhanced Media Support:**
- Image sharing via Hive image upload
- Image thumbnails and previews
- GIF support
- Video sharing (link preview)
- File attachment support

**Message Reactions:**
- Emoji reactions to messages
- Reaction aggregation
- Quick reactions (like, love, laugh)
- Custom reactions

**Conversation Management:**
- Archive conversations
- Pin important conversations
- Mute notifications per conversation
- Clear chat history
- Conversation search

**Advanced Notifications:**
- Customizable notification sounds
- Notification scheduling (Do Not Disturb)
- Notification preview depth setting
- Desktop notification actions

**UI Enhancements:**
- Message search within conversation
- Jump to unread messages
- Scroll to quoted message
- Message forwarding
- Multi-message selection and actions

### 13.2 Medium-Term Enhancements (6-12 months)

**Group Messaging:**
- Create group conversations
- Group custom_json operations
- Group member management
- Group admin roles
- Group notifications

**Voice Messages:**
- Record audio messages
- Upload to decentralized storage (IPFS)
- Play in-line in chat
- Waveform visualization
- Playback speed control

**Video Calls:**
- Peer-to-peer video calls via WebRTC
- Integration with decentralized signaling
- Screen sharing
- Call history
- Call notifications

**Message Threading:**
- Reply to specific messages
- Thread visualization
- Thread notifications
- Collapse/expand threads

**Rich Text Support:**
- Markdown formatting
- Bold, italic, code formatting
- Syntax highlighting for code blocks
- Quote blocks
- Lists

**Bot Integration:**
- Bot accounts for automated messages
- Custom_json bot commands
- Bot authentication
- Rate limiting for bots

### 13.3 Long-Term Enhancements (12+ months)

**Decentralized Push Notifications:**
- Push notification server (opt-in)
- WebSocket alternative to polling
- Instant message delivery
- Battery-efficient mobile notifications

**Advanced Encryption:**
- Post-quantum cryptography
- Perfect forward secrecy
- Disappearing messages
- Self-destructing messages

**Cross-Chain Messaging:**
- Bridge to other blockchain networks
- Unified messaging across chains
- Cross-chain identity verification

**AI Integration:**
- Message translation
- Smart replies suggestion
- Spam detection
- Sentiment analysis
- Message summarization

**Enhanced Privacy:**
- Anonymous messaging (zero-knowledge proofs)
- Metadata obfuscation
- Onion routing for messages
- Private group messaging with sealed sender

**Advanced Features:**
- Message scheduling (send later)
- Message pinning in conversation
- Custom themes for chat
- Chat backup and export
- End-to-end encrypted backups

### 13.4 Research & Exploration

**Blockchain Optimizations:**
- Layer 2 solutions for cheaper messaging
- Off-chain messaging with on-chain settlement
- State channels for active conversations
- Plasma/Rollup integration

**Decentralized Storage:**
- IPFS integration for media
- Arweave for permanent storage
- Filecoin for incentivized storage
- Hybrid on-chain/off-chain approach

**Alternative Consensus:**
- Proof-of-stake messaging networks
- DAG-based messaging protocols
- Integration with other decentralized platforms

**Web3 Integration:**
- ENS/DNS name resolution
- NFT avatars
- Token-gated conversations
- DAO governance for features

---

## 14. Appendices

### 14.1 Glossary

**Hive Blockchain Terms:**
- **RC (Resource Credits)**: Bandwidth credits for blockchain operations
- **HP (Hive Power)**: Staked HIVE that provides influence and RC
- **Custom JSON**: Blockchain operation type for custom data
- **Memo**: Encrypted message field in transfer operations
- **Posting Key**: Key for social operations (posting, voting, etc.)
- **Active Key**: Key for wallet operations (transfers, etc.)
- **Memo Key**: Key for encrypting/decrypting memo fields
- **Hivemind**: Backend indexing service for Hive (provides bridge API)
- **Bridge API**: API for accessing processed blockchain data
- **Account History**: Log of all operations by an account

**Cryptography Terms:**
- **secp256k1**: Elliptic curve used for Hive cryptography
- **ECDH**: Elliptic Curve Diffie-Hellman (shared secret generation)
- **AES-256**: Advanced Encryption Standard with 256-bit key
- **Public Key**: Publicly visible key for encryption
- **Private Key**: Secret key for decryption
- **Shared Secret**: Secret generated from public + private keys

**UI/UX Terms:**
- **FAB**: Floating Action Button
- **Optimistic UI**: Show update immediately before confirmation
- **Skeleton Screen**: Loading placeholder matching final content
- **Pull-to-Refresh**: Gesture to reload content
- **Swipe Gesture**: Touch gesture for actions
- **Toast**: Brief notification message

### 14.2 Reference Links

**Hive Documentation:**
- Hive Developer Portal: https://developers.hive.io
- Hive.js Documentation: https://github.com/openhive-network/hive-js
- Hive Keychain: https://hive-keychain.com
- Bridge API Reference: https://developers.hive.io/apidefinitions/#bridge

**Technical Resources:**
- React Documentation: https://react.dev
- Redux Documentation: https://redux.js.org
- Material-UI Documentation: https://mui.com
- secp256k1 Specification: https://www.secg.org/sec2-v2.pdf

**Tools:**
- Jest Testing: https://jestjs.io
- React Testing Library: https://testing-library.com/react
- Cypress E2E: https://www.cypress.io
- Lighthouse: https://developers.google.com/web/tools/lighthouse

### 14.3 Team Roles & Responsibilities

**Development Team:**
- Frontend Developer: UI components, state management
- Blockchain Developer: Hive integration, encryption
- UX Designer: User flows, interface design
- QA Engineer: Testing, quality assurance
- DevOps Engineer: Deployment, monitoring

**Support Roles:**
- Product Manager: Feature prioritization, roadmap
- Technical Writer: Documentation
- Community Manager: User communication
- Security Auditor: Security review
- Legal Advisor: Compliance review

### 14.4 Success Metrics

**Adoption Metrics:**
- Number of users who send first message
- Daily active messaging users
- Messages sent per day
- Average messages per user
- Conversation retention rate

**Performance Metrics:**
- Average message delivery time
- Message delivery success rate
- API response time
- UI render time
- Bundle load time

**Quality Metrics:**
- Error rate per feature
- Bug report volume
- User satisfaction score
- Support ticket volume
- Feature usage rates

**Business Metrics:**
- User retention (7-day, 30-day)
- Feature adoption rate
- Time to first message
- Conversion from view to use
- Net Promoter Score (NPS)

---

## Document Control

**Version History:**
- v1.0 - 2025-10-29 - Initial comprehensive plan

**Approval:**
- Technical Lead: [Pending]
- Product Manager: [Pending]
- Security Review: [Pending]

**Next Review Date:** 2025-11-15

**Document Owner:** Development Team

**Distribution:** Development Team, Product Management, Stakeholders

---

END OF DOCUMENT
