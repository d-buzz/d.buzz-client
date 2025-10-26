# Hive API Documentation for D.Buzz

## Overview

D.Buzz uses multiple Hive blockchain API nodes to ensure reliability and availability. The application implements an automatic failover system that switches between nodes when one becomes unavailable.

## Current Hive API Configuration

### Primary RPC Node

The default RPC node is configured in `src/config.js`:

```javascript
DEFAULT_RPC_NODE: process.env.REACT_APP_DEFAULT_RPC_NODE || 'https://api.hive.blog'
```

**Default Node:** `https://api.hive.blog` (operated by @blocktrades)

### Backup API Nodes

The following backup nodes are configured in `src/services/helper.js`:

| API Endpoint | Operator | Status |
|--------------|----------|--------|
| https://hive-api.3speak.tv | @threespeak | Backup |
| https://rpc.mahdiyari.info | @mahdiyari | Backup |
| https://anyx.io | @anyx | Backup |
| https://api.deathwing.me | @deathwing | Backup |
| https://hived.emre.sh | @emrebeyler | Backup |
| https://api.openhive.network | @gtg | Backup |
| https://techcoderx.com | @techcoderx | Backup |
| https://api.c0ff33a.uk | @c0ff33a | Backup |

### Additional Known Hive API Nodes

The following public nodes are also available but not currently configured in D.Buzz:

| API Endpoint | Operator |
|--------------|----------|
| https://rpc.ausbit.dev | @ausbitbank |
| https://api.hive.blue | @guiltyparties |
| https://hive.roelandp.nl | @roelandp |
| https://hive-api.arcange.eu | @arcange |
| https://hiveapi.actifit.io | @actifit |

## Automatic Failover System

### Implementation

The failover system is implemented in `src/services/api.js` and provides the following features:

#### 1. Failed API Tracking

```javascript
const failedAPIs = new Map() // Track failed APIs with timestamps
const API_COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes cooldown
```

- APIs that fail are marked with a timestamp
- Failed APIs enter a 5-minute cooldown period
- After cooldown, APIs are automatically retried

#### 2. Available API Selection

The `getAvailableAPIs()` function:
- Filters out recently failed APIs
- Removes APIs from the failed list after cooldown expires
- Returns list of currently available nodes

#### 3. Automatic Rotation

The `getNextAvailableAPI()` function:
- Rotates through available APIs using round-robin
- Resets to first API if all APIs have failed
- Clears failed list when all nodes are unavailable

#### 4. API Call Wrapper

The `apiCallWithFailover()` function wraps API calls with automatic retry:

```javascript
export const apiCallWithFailover = async (apiCallFunction, maxRetries = 3) => {
  // Attempts up to 3 times by default
  // Marks failed APIs and switches to next available node
  // Implements exponential backoff (1s, 2s, 3s)
}
```

### Usage Examples

#### Setting RPC Node

```javascript
import { setRPCNode } from 'services/api'

// Automatically selects next available node with failover
await setRPCNode()
```

#### Making API Calls with Failover

```javascript
import { apiCallWithFailover } from 'services/api'

// Wrap any API call for automatic failover
const result = await apiCallWithFailover(() => {
  return api.call('bridge.get_profile', { account: 'username' })
})
```

#### Getting Active RPC Node

```javascript
import { getActiveRPCNode } from 'services/api'

const currentNode = getActiveRPCNode()
// Returns user-selected node or next available node from rotation
```

## Hive API Methods Used

D.Buzz uses the following Hive blockchain API methods:

### Bridge API Methods

- `bridge.get_profile` - Fetch user profile information
- `bridge.get_discussion` - Fetch post and comments
- `bridge.unread_notifications` - Get unread notification count
- `bridge.account_notifications` - Get account notifications
- `bridge.get_community` - Get community information
- `bridge.get_account_posts` - Fetch posts from an account
- `bridge.get_relationship_between_accounts` - Check follow relationships
- `bridge.get_follow_list` - Get user's follow lists

### Condenser API Methods

- `condenser_api.get_trending_tags` - Fetch trending tags
- `condenser_api.get_dynamic_global_properties` - Get blockchain properties
- `condenser_api.get_following` - Get accounts a user follows
- `condenser_api.list_proposal_votes` - Get proposal votes

### Database API Methods

- `getAccounts` - Get account information
- `getContent` - Fetch post content
- `getContentReplies` - Fetch replies to a post
- `getActiveVotes` - Get votes on a post
- `getDynamicGlobalProperties` - Get global blockchain properties
- `getFollowCount` - Get follower/following counts
- `getFollowers` - Get account followers
- `getFollowing` - Get accounts user follows
- `getFeedHistory` - Get price feed history
- `getRewardFund` - Get reward pool information
- `getAccountHistory` - Get account transaction history

### Broadcast Methods

- `broadcast.vote` - Cast a vote
- `broadcast.send` - Broadcast transactions (posts, comments, follows, etc.)

## RPC Node Selection

Users can manually select their preferred RPC node through the application settings. The selection is stored in localStorage:

```javascript
const rpcSetting = localStorage.getItem('rpc-setting')
```

If a user selects a specific node (not 'default'), that node will be used instead of the automatic rotation system.

## Testing Hive APIs

A test script is available at `/test-hive-apis.js` that can be used to verify the availability of Hive API endpoints:

```bash
node test-hive-apis.js
```

The test script:
- Tests all configured endpoints
- Measures response times
- Reports working vs. failed nodes
- Shows head block numbers for verification

## Troubleshooting

### If API Calls Fail

1. **Check Network Connection**: Ensure you have internet connectivity
2. **Check Console Logs**: Failed APIs are logged with warnings
3. **Wait for Cooldown**: Failed APIs automatically retry after 5 minutes
4. **Try Manual Node Selection**: Select a different RPC node in settings
5. **Clear Failed APIs**: Restart the application to reset failed API tracking

### Common Error Codes

- `-32000`: General RPC error
- `-32001`: Post already paid out (voting forbidden)
- `EAI_AGAIN`: DNS resolution failure (network issue)
- `ECONNREFUSED`: Connection refused (node offline)
- `ETIMEDOUT`: Request timeout (node overloaded or slow)

## Adding New Hive API Nodes

To add a new Hive API node to the rotation:

1. Add the URL to `hiveAPIUrls` array in `src/services/helper.js`:

```javascript
export const hiveAPIUrls = [
  "https://hive-api.3speak.tv",
  // ... existing nodes ...
  "https://your-new-node.com",  // Add new node here
]
```

2. The node will automatically be included in the failover rotation

## Security Considerations

- All API nodes use HTTPS for secure communication
- Private keys are never sent to API nodes
- Transactions are signed locally before broadcasting
- User credentials are stored locally (not on API servers)

## Performance Optimization

The failover system includes several optimizations:

1. **Cooldown Period**: Prevents repeated attempts to failed nodes
2. **Round-robin Rotation**: Distributes load across available nodes
3. **Exponential Backoff**: Reduces network congestion during retries
4. **Local Caching**: Profile data is cached to reduce API calls

## API Rate Limits

Different Hive API nodes may have different rate limits. The automatic rotation helps distribute requests across multiple nodes to avoid hitting individual node limits.

## References

- [Hive Developer Documentation](https://developers.hive.io/)
- [Hive.js Library](https://www.npmjs.com/package/@hiveio/hive-js)
- [Public Hive API Nodes List](https://beacon.peakd.com/)

## Version History

- **v3.0.0**: Implemented automatic failover system with cooldown
- **v2.x**: Multiple API node support
- **v1.x**: Single API node configuration

---

**Last Updated**: 2025-10-26
