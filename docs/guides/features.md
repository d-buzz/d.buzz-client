# D.Buzz Features Documentation

## Overview

D.Buzz is a decentralized microblogging platform with a comprehensive set of social media features built on the Hive blockchain.

## Core Features

### 1. Content Creation

#### Buzzes (Micro-posts)
- **Character Limit**: 280 characters max (Twitter-like)
- **Markdown Support**: Rich text formatting
- **Tagging**: Add hashtags and topics
- **Mentions**: @username mentions
- **Drafts**: Save buzzes as drafts before posting

**How to Create a Buzz**:
1. Click "What's buzzing?" input field
2. Type your content (max 280 chars)
3. Add tags (optional)
4. Add media (images, GIFs) (optional)
5. Click "Buzz" to post

**Code Example**:
```javascript
// Create buzz action
dispatch(createBuzz({
  body: 'Hello #Hive! This is my first #buzz',
  tags: ['hive-193084', 'dbuzz', 'hive'],
  metadata: {
    app: 'dbuzz/0.1',
    format: 'markdown'
  }
}))
```

#### Replies and Comments
- **Nested Threading**: Reply to buzzes and comments
- **Thread View**: View full conversation threads
- **Notifications**: Get notified of replies

#### Editing Posts
- **7-Day Window**: Edit posts within 7 days
- **Edit History**: Track changes (on blockchain)
- **No Votes Required**: Can edit if no votes received

#### Deleting Posts
- **Conditions**: No replies, no votes
- **Permanent**: Blockchain entries remain but marked deleted

### 2. Social Interactions

#### Following System
- **Follow Users**: Build your network
- **Followers/Following Lists**: View relationships
- **Follow Counts**: Display follower metrics

**Implementation**:
```javascript
// Follow a user
dispatch(followUser({
  follower: currentUser,
  following: targetUser
}))

// Get followers
dispatch(fetchFollowers(username, limit, startFollower))
```

#### Voting (Likes)
- **Upvote/Downvote**: Vote on content
- **Vote Weight**: Adjustable vote strength (1-100%)
- **Vote Display**: Show vote counts
- **Voter List**: View who voted

**Vote Values**:
- `10000` = 100% upvote
- `5000` = 50% upvote
- `0` = remove vote
- `-10000` = 100% downvote

#### Sharing
- **Internal Sharing**: Reblog to your followers
- **External Sharing**: Share to social media
- **Copy Link**: Quick link copying

### 3. Content Discovery

#### Feed Types

**Home Feed**
- Personalized feed for authenticated users
- Posts from followed users
- Chronological or ranked

**Trending Feed**
- Most engaged content
- Based on votes, comments, payouts
- Updated regularly

**Latest Feed**
- Most recent posts
- Chronological order
- All users

**Tag-Based Feeds**
- Browse by specific tags
- Filter by topic
- Community-specific content

#### Search Functionality

**Post Search**:
- Full-text search
- Search by keyword
- Filter by date, relevance

**User Search**:
- Find users by username
- Search by display name
- Browse profiles

**Implementation**:
```javascript
// Search posts
const results = await searchPosts(query, limit, sort)

// Search users
const users = await searchAccounts(query, limit)
```

#### Leaderboard
- Top contributors
- Ranked by reputation, engagement
- Weekly/monthly/all-time views

### 4. User Profiles

#### Profile Features
- **Display Name**: Customize your name
- **Avatar**: Profile picture
- **Cover Image**: Banner image
- **Bio**: About section
- **Location**: Geographic info
- **Website**: Link to external site

#### Profile Tabs
- **Posts**: User's buzzes
- **Replies**: User's comments
- **Media**: Media posts
- **Wallet**: Blockchain wallet (if own profile)

#### Profile Stats
- **Followers**: Follower count
- **Following**: Following count
- **Post Count**: Total posts
- **Reputation**: Hive reputation score

**Update Profile**:
```javascript
dispatch(updateProfile({
  name: 'Alice',
  about: 'Blockchain enthusiast',
  profile_image: 'https://...',
  cover_image: 'https://...',
  website: 'https://alice.com',
  location: 'New York, USA'
}))
```

### 5. Moderation System

#### Personal Mute List
- **Mute Users**: Hide posts from specific users
- **Mute Management**: View and manage muted users
- **Reversible**: Unmute at any time

#### Personal Blacklist
- **Block Users**: Completely block users
- **Blacklist Management**: Manage blocked users
- **Stronger than Mute**: Complete blocking

#### Global Moderation
- **Moderator Account**: @dbuzz moderator
- **Global Mute List**: Platform-wide muting
- **Automatic Filtering**: Auto-filter muted accounts

#### Follow Mute/Blacklists
- **Community Lists**: Follow other users' lists
- **Shared Moderation**: Leverage community moderation
- **Multiple Lists**: Follow multiple lists

**Implementation**:
```javascript
// Mute a user
dispatch(muteUser(username))

// Follow a mute list
dispatch(followMutedList(listOwner, listName))

// Global moderation filter
const filtered = invokeMuteFilter(posts, personalMuteList, globalMuteList)
```

### 6. Content Collections (Pockets)

#### Pockets Feature
- **Save Posts**: Bookmark favorite content
- **Organize**: Create multiple collections
- **Manage**: Add/remove posts
- **Share**: Share collection links

**Operations**:
```javascript
// Create pocket
dispatch(createPocket(name, description))

// Add to pocket
dispatch(addToPocket(pocketId, author, permlink))

// Remove from pocket
dispatch(removeFromPocket(pocketId, author, permlink))
```

### 7. Wallet Integration

#### Supported Currencies
- **HIVE**: Native blockchain token
- **HBD**: Hive Backed Dollar (stablecoin)
- **HIVE Power**: Staked HIVE

#### Wallet Features
- **View Balances**: See all holdings
- **Transaction History**: View past transactions
- **Transfer**: Send HIVE/HBD
- **Power Up/Down**: Stake/unstake HIVE

#### Reward System
- **Content Rewards**: Earn for posts and curation
- **7-Day Payout**: Rewards paid after 7 days
- **50/50 Split**: Author/curator reward distribution

**Transfer Example**:
```javascript
dispatch(transfer({
  from: 'alice',
  to: 'bob',
  amount: '10.000 HIVE',
  memo: 'Payment'
}))
```

### 8. Rich Media Support

#### Image Support ⭐ NEW in 2025
- **Direct Hive Upload**: Upload to images.hive.blog (native blockchain hosting)
- **Cryptographic Signing**: Secure authentication with posting key
- **Upload Progress**: Real-time progress tracking
- **Image Compression**: Auto-compress large images
- **Image Cropping**: Crop before upload
- **Multiple Images**: Upload several images
- **Image Preview**: Preview before posting
- **Legacy Fallback**: Automatic handling of old image URLs

**How It Works**:
1. Select image from your device
2. Image is cryptographically signed with your posting key
3. Uploaded directly to images.hive.blog
4. Progress tracked in real-time (0-100%)
5. Image URL automatically added to buzz

**Technical Details**:
```javascript
// Upload to Hive blockchain image hosting
const result = await uploadImageToHiveBlog(
  imageFile,
  username,
  postingPrivateKey,
  (progress) => console.log(`${progress}%`)
)
// Returns: { previewUrl: 'https://images.hive.blog/...' }
```

**Benefits**:
- ✅ **Decentralized**: No third-party image hosts
- ✅ **Permanent**: Images stored on Hive infrastructure
- ✅ **Secure**: Cryptographic proof of ownership
- ✅ **Fast**: Direct upload with progress tracking

#### GIF Integration
- **Giphy Search**: Search and add GIFs
- **GIF Preview**: Preview GIFs in feed
- **Inline Display**: GIFs displayed in posts

#### Video Embedding
- **YouTube**: Embed YouTube videos
- **External Videos**: Link to videos
- **Video Preview**: Preview thumbnails

#### Link Previews
- **Auto-Detection**: Detect URLs in posts
- **Metadata Extraction**: Fetch title, description, image
- **Preview Cards**: Display rich previews
- **Multiple Links**: Handle multiple URLs

### 9. Notifications

#### Notification Types
- **Votes**: Someone voted on your content
- **Replies**: Someone replied to you
- **Mentions**: Someone mentioned you
- **Follows**: Someone followed you
- **Reblogs**: Someone reblogged your content

#### Notification Management
- **Filter Notifications**: By type
- **Mark as Read**: Clear notifications
- **Real-time Updates**: Live notification polling

**Implementation**:
```javascript
// Fetch notifications
dispatch(fetchNotifications(username, limit, lastId))

// Filter notifications
const filtered = notifications.filter(n => n.type === 'vote')
```

### 10. Theme Customization

#### Available Themes
- **Light Theme**: Default light mode
- **Dark Theme**: Dark mode for low-light

#### Theme Features
- **System Preference**: Match OS theme
- **Manual Toggle**: Switch manually
- **Persistent**: Saved preference
- **Smooth Transition**: Animated theme change

**Toggle Theme**:
```javascript
dispatch(changeTheme('dark'))
```

### 11. Authentication Methods

#### Hive Keychain
- **Browser Extension**: Secure key storage
- **Transaction Signing**: Sign with private keys
- **No Key Entry**: Keys never entered in app

#### Ceramic Network + MetaMask
- **Lite Accounts**: No Hive account required
- **Ethereum Wallet**: Use MetaMask
- **Decentralized ID**: DID-based authentication

#### Direct Login
- **Posting Key**: Enter posting private key
- **Less Secure**: Not recommended
- **Fallback Method**: For users without Keychain

### 12. Progressive Web App (PWA)

#### PWA Features
- **Installable**: Add to home screen
- **Offline Support**: Service worker caching
- **Push Notifications**: Web push (future)
- **App-like Experience**: Full-screen mode

#### Install Process
1. Visit D.Buzz on mobile
2. Tap "Add to Home Screen"
3. Use as native app

### 13. Drafts System

#### Draft Features
- **Auto-Save**: Save buzzes as drafts
- **Draft List**: View all drafts
- **Resume Editing**: Continue from drafts
- **Delete Drafts**: Remove unwanted drafts

**Draft Management**:
```javascript
// Save draft
dispatch(saveDraft({ body, tags, metadata }))

// Load drafts
dispatch(loadDrafts())

// Delete draft
dispatch(deleteDraft(draftId))
```

### 14. Accessibility Features

#### Accessibility Support
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels
- **High Contrast**: Theme options
- **Focus Indicators**: Clear focus states

### 15. Performance Features

#### Optimization
- **Infinite Scroll**: Load on demand
- **Lazy Loading**: Load components as needed
- **Image Optimization**: Compressed images
- **Code Splitting**: Route-based splitting
- **Caching**: Service worker caching

#### Skeleton Loading
- **Loading States**: Placeholder UI
- **Perceived Performance**: Instant feedback
- **Smooth Transitions**: No layout shift

## Feature Roadmap

### Planned Features
- **Direct Messaging**: Private messages
- **Video Upload**: Native video hosting
- **Advanced Analytics**: Detailed stats
- **Mobile Apps**: Native iOS/Android
- **Multi-Chain**: Support more blockchains
- **Enhanced Moderation**: Better tools
- **Community Features**: Groups, communities

## Feature Usage Statistics

| Feature | Usage Level | Implementation Complexity |
|---------|-------------|--------------------------|
| Buzzes | High | Medium |
| Replies | High | Medium |
| Voting | High | Low |
| Following | High | Medium |
| Trending Feed | High | High |
| Search | Medium | High |
| Pockets | Medium | Medium |
| Wallet | Medium | High |
| Muting | Medium | Low |
| Themes | High | Low |
| Media | High | Medium |
| Notifications | High | High |

## Developer Resources

For implementing features:
- [API Service Documentation](../api/api-service.md)
- [Component Overview](../components/overview.md)
- [Redux Store](../architecture/redux-store.md)
- [Development Setup](./development-setup.md)
