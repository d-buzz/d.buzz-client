# API Service Documentation

## Overview

The API service (`/src/services/api.js`) is the central module for all Hive blockchain operations. It provides a comprehensive interface for interacting with the Hive network, managing user data, and handling content operations.

**File Size**: 1,600 lines
**Location**: `/src/services/api.js`

## Core Functions

### RPC Node Management

#### `getActiveRPCNode()`
Returns the currently active Hive RPC node URL.

```javascript
const node = getActiveRPCNode()
// Returns: 'https://rpc.d.buzz' or configured node
```

#### `setRPCNode(nodeUrl)`
Sets a new active RPC node.

```javascript
setRPCNode('https://api.hive.blog')
```

**Parameters**:
- `nodeUrl` (string): The URL of the Hive RPC node

### Bridge API Calls

#### `callBridge(endpoint, params)`
Generic function for calling Hive bridge API endpoints.

```javascript
const result = await callBridge('get_ranked_posts', {
  sort: 'trending',
  tag: 'hive-193084',
  limit: 20
})
```

**Parameters**:
- `endpoint` (string): Bridge API endpoint name
- `params` (object): Endpoint-specific parameters

**Returns**: Promise with API response data

**Common Endpoints**:
- `get_ranked_posts` - Get posts by ranking (trending, hot, created)
- `get_account_posts` - Get posts by specific account
- `get_discussion` - Get post with replies
- `get_profile` - Get account profile data

## Content Operations

### Creating Content

#### `createPost(author, title, body, tags, metadata)`
Creates a new post/buzz on Hive blockchain.

```javascript
await createPost(
  'username',
  '', // Empty for buzzes (comments)
  'Hello #Hive!',
  ['hive-193084', 'dbuzz'],
  { app: 'dbuzz/0.1', format: 'markdown' }
)
```

**Parameters**:
- `author` (string): Post author username
- `title` (string): Post title (empty for buzzes)
- `body` (string): Post content
- `tags` (array): List of tags
- `metadata` (object): JSON metadata

**Returns**: Promise with transaction result

#### `createComment(parentAuthor, parentPermlink, author, body, metadata)`
Creates a reply/comment to existing content.

```javascript
await createComment(
  'alice',           // Parent author
  'post-permlink',   // Parent permlink
  'bob',             // Comment author
  'Great post!',     // Comment body
  { app: 'dbuzz/0.1' }
)
```

### Updating Content

#### `updatePost(author, permlink, title, body, tags, metadata)`
Updates an existing post.

```javascript
await updatePost(
  'username',
  'post-permlink',
  '',
  'Updated content',
  ['hive-193084'],
  { app: 'dbuzz/0.1', edited: true }
)
```

**Note**: Posts can only be edited by their author within 7 days.

### Deleting Content

#### `deletePost(author, permlink)`
Deletes a post (only if no replies and no votes).

```javascript
await deletePost('username', 'post-permlink')
```

**Constraints**:
- No replies to the post
- No votes received
- Within editable timeframe

## Voting Operations

### `votePost(voter, author, permlink, weight)`
Upvote or downvote content.

```javascript
// Upvote with 100% weight
await votePost('voter', 'author', 'permlink', 10000)

// Downvote with 50% weight
await votePost('voter', 'author', 'permlink', -5000)

// Remove vote
await votePost('voter', 'author', 'permlink', 0)
```

**Parameters**:
- `voter` (string): Voting account username
- `author` (string): Content author
- `permlink` (string): Content permlink
- `weight` (number): Vote weight (-10000 to 10000)
  - 10000 = 100% upvote
  - 0 = remove vote
  - -10000 = 100% downvote

## User Operations

### Profile Management

#### `getAccount(username)`
Fetch account information.

```javascript
const account = await getAccount('username')
// Returns: Account object with balance, reputation, etc.
```

#### `updateProfile(username, metadata)`
Update user profile metadata.

```javascript
await updateProfile('username', {
  profile: {
    name: 'Display Name',
    about: 'Bio text',
    profile_image: 'https://...',
    cover_image: 'https://...',
    website: 'https://...',
    location: 'City, Country'
  }
})
```

### Follow Operations

#### `followUser(follower, following)`
Follow a user.

```javascript
await followUser('alice', 'bob')
```

#### `unfollowUser(follower, following)`
Unfollow a user.

```javascript
await unfollowUser('alice', 'bob')
```

#### `getFollowers(username, limit, startFollower)`
Get user's followers with pagination.

```javascript
const followers = await getFollowers('username', 100, '')
```

#### `getFollowing(username, limit, startFollowing)`
Get users that a user follows.

```javascript
const following = await getFollowing('username', 100, '')
```

### Mute Operations

#### `muteUser(muter, mutedUser)`
Mute a user (hide their posts).

```javascript
await muteUser('alice', 'spammer')
```

#### `unmuteUser(muter, mutedUser)`
Unmute a user.

```javascript
await unmuteUser('alice', 'username')
```

### Blacklist Operations

#### `blacklistUser(user, blacklistedUser)`
Add user to personal blacklist.

```javascript
await blacklistUser('alice', 'bad-actor')
```

#### `unblacklistUser(user, blacklistedUser)`
Remove user from blacklist.

```javascript
await unblacklistUser('alice', 'username')
```

## Content Filtering

### `invokeFilter(posts, filters)`
Apply content filters to post array.

```javascript
const filteredPosts = invokeFilter(posts, {
  minReputation: 25,
  hideNSFW: true,
  hideDownvoted: true
})
```

**Filters**:
- `minReputation`: Minimum author reputation
- `hideNSFW`: Hide posts with NSFW tag
- `hideDownvoted`: Hide posts with negative net votes

### `invokeMuteFilter(posts, muteList, globalMuteList)`
Filter posts from muted users.

```javascript
const filteredPosts = invokeMuteFilter(
  posts,
  personalMuteList,
  globalModeratorMuteList
)
```

**Parameters**:
- `posts` (array): Array of post objects
- `muteList` (array): Personal mute list usernames
- `globalMuteList` (array): Global moderator mute list

**Returns**: Filtered posts array with muted authors removed

### `removeFootNote(body)`
Remove D.Buzz footer from post body.

```javascript
const cleanBody = removeFootNote(postBody)
// Removes: "Posted via D.Buzz" footer
```

## Wallet Operations

### `getBalance(username)`
Get user's wallet balances.

```javascript
const balances = await getBalance('username')
// Returns: { HIVE: '10.000', HBD: '5.000', savings: {...}, ... }
```

### `getTransactionHistory(username, limit, start)`
Get account transaction history.

```javascript
const history = await getTransactionHistory('username', 100, -1)
```

### `transfer(from, to, amount, currency, memo)`
Transfer HIVE or HBD to another account.

```javascript
await transfer(
  'alice',
  'bob',
  '10.000',
  'HIVE',
  'Payment for service'
)
```

**Parameters**:
- `from` (string): Sender username
- `to` (string): Recipient username
- `amount` (string): Amount with 3 decimals
- `currency` (string): 'HIVE' or 'HBD'
- `memo` (string): Transfer memo

## Search Operations

### `searchPosts(query, limit, sort)`
Search for posts by keyword.

```javascript
const results = await searchPosts('blockchain', 50, 'created')
```

**Parameters**:
- `query` (string): Search query
- `limit` (number): Max results
- `sort` (string): 'created', 'trending', or 'relevance'

### `searchAccounts(query, limit)`
Search for user accounts.

```javascript
const users = await searchAccounts('alice', 20)
```

## Notification Operations

### `getNotifications(username, limit, lastId)`
Fetch user notifications.

```javascript
const notifications = await getNotifications('username', 50, null)
```

**Notification Types**:
- `vote` - Someone voted on your content
- `reply` - Someone replied to your content
- `follow` - Someone followed you
- `mention` - Someone mentioned you
- `reblog` - Someone reblogged your content

## Pockets (Collections) Operations

### `createPocket(username, name, description)`
Create a new content collection.

```javascript
await createPocket('username', 'Favorites', 'My favorite posts')
```

### `addToPocket(username, pocketId, author, permlink)`
Add content to a pocket.

```javascript
await addToPocket('username', 'pocket-id', 'author', 'permlink')
```

### `removeFromPocket(username, pocketId, author, permlink)`
Remove content from a pocket.

```javascript
await removeFromPocket('username', 'pocket-id', 'author', 'permlink')
```

## Data Fetching Patterns

### Trending Posts

```javascript
const trendingPosts = await callBridge('get_ranked_posts', {
  sort: 'trending',
  tag: 'hive-193084',
  limit: 20,
  observer: username // For personalized data
})
```

### User Feed

```javascript
const feedPosts = await callBridge('get_account_posts', {
  sort: 'posts',
  account: username,
  limit: 20,
  observer: currentUser
})
```

### Single Post with Replies

```javascript
const discussion = await callBridge('get_discussion', {
  author: 'username',
  permlink: 'post-permlink',
  observer: currentUser
})
```

## Error Handling

### Common Errors

```javascript
try {
  await createPost(...)
} catch (error) {
  if (error.message.includes('already exists')) {
    // Post with this permlink exists
  } else if (error.message.includes('insufficient')) {
    // Insufficient RC or funds
  } else if (error.message.includes('bandwidth')) {
    // Out of resource credits
  }
}
```

### RPC Node Failover

```javascript
const tryMultipleNodes = async (operation) => {
  const nodes = ['https://rpc.d.buzz', 'https://api.hive.blog']

  for (const node of nodes) {
    try {
      setRPCNode(node)
      return await operation()
    } catch (error) {
      continue // Try next node
    }
  }

  throw new Error('All RPC nodes failed')
}
```

## Performance Considerations

### Batching Requests

```javascript
// Fetch multiple accounts in parallel
const accounts = await Promise.all(
  usernames.map(username => getAccount(username))
)
```

### Pagination

```javascript
// Paginated feed loading
const fetchPage = async (startPermlink = null) => {
  return await callBridge('get_ranked_posts', {
    sort: 'trending',
    tag: 'hive-193084',
    limit: 20,
    start_author: startPermlink ? previousAuthor : null,
    start_permlink: startPermlink
  })
}
```

### Caching Strategy

```javascript
// Cache account data (example pattern)
const accountCache = new Map()

const getCachedAccount = async (username) => {
  if (accountCache.has(username)) {
    return accountCache.get(username)
  }

  const account = await getAccount(username)
  accountCache.set(username, account)
  return account
}
```

## Integration with Redux Saga

```javascript
// Example saga using API service
function* fetchTrendingSaga() {
  try {
    const posts = yield call(api.callBridge, 'get_ranked_posts', {
      sort: 'trending',
      tag: 'hive-193084',
      limit: 20
    })

    yield put(fetchTrendingSuccess(posts))
  } catch (error) {
    yield put(fetchTrendingFailure(error.message))
  }
}
```

## Constants and Configuration

```javascript
// From config.js
export const HIVE_TAG = 'hive-193084'
export const MODERATOR_ACCOUNT = 'dbuzz'
export const DEFAULT_RPC_NODE = process.env.REACT_APP_DEFAULT_RPC_NODE
```

## Best Practices

1. **Always handle errors**: Wrap API calls in try/catch
2. **Use pagination**: Don't fetch all data at once
3. **Implement failover**: Have backup RPC nodes
4. **Cache when appropriate**: Reduce redundant API calls
5. **Validate input**: Check parameters before API calls
6. **Use observer parameter**: Get personalized data (vote status, etc.)
7. **Respect rate limits**: Don't spam the API
8. **Clean up subscriptions**: Unsubscribe from real-time updates
