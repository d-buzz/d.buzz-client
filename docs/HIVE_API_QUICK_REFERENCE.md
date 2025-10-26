# Hive API Quick Reference

## Currently Configured APIs in D.Buzz

### Production APIs (Configured)

These APIs are currently configured in the D.Buzz client and part of the automatic failover system:

```javascript
// Primary (default)
https://api.hive.blog                 // @blocktrades

// Backup nodes (automatic failover)
https://hive-api.3speak.tv            // @threespeak
https://rpc.mahdiyari.info            // @mahdiyari
https://anyx.io                       // @anyx
https://api.deathwing.me              // @deathwing
https://hived.emre.sh                 // @emrebeyler
https://api.openhive.network          // @gtg
https://techcoderx.com                // @techcoderx
https://api.c0ff33a.uk                // @c0ff33a
```

**Total Configured Nodes**: 9 (1 primary + 8 backup)

### Alternative Public APIs (Not Configured)

These public Hive APIs are available but not currently in the D.Buzz configuration:

```javascript
https://rpc.ausbit.dev                // @ausbitbank
https://api.hive.blue                 // @guiltyparties
https://hive.roelandp.nl              // @roelandp
https://hive-api.arcange.eu           // @arcange
https://hiveapi.actifit.io            // @actifit
```

## Testing API Availability

### Method 1: Using the Test Script

```bash
node test-hive-apis.js
```

This script will test all endpoints and report:
- Response times
- Current head block number
- Working vs. failed status
- Error messages for failed nodes

### Method 2: Manual cURL Test

Test a single endpoint manually:

```bash
# Test basic connectivity
curl -X POST https://api.hive.blog \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "condenser_api.get_dynamic_global_properties",
    "params": [],
    "id": 1
  }'
```

Expected response includes:
- `head_block_number`: Current blockchain height
- `total_vesting_shares`: Total HIVE Power in network
- `total_vesting_fund_hive`: Total HIVE backing HP

### Method 3: JavaScript/Node.js

```javascript
const https = require('https');

const testHiveAPI = (url) => {
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    method: 'condenser_api.get_dynamic_global_properties',
    params: [],
    id: 1
  });

  const urlObj = new URL(url);

  const options = {
    hostname: urlObj.hostname,
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      const result = JSON.parse(data);
      if (result.result) {
        console.log(`✓ ${url} - Block: ${result.result.head_block_number}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`✗ ${url} - Error: ${e.message}`);
  });

  req.write(payload);
  req.end();
};

// Test all configured nodes
const nodes = [
  'https://api.hive.blog',
  'https://hive-api.3speak.tv',
  'https://rpc.mahdiyari.info',
  'https://anyx.io',
  'https://api.deathwing.me',
  'https://hived.emre.sh',
  'https://api.openhive.network',
  'https://techcoderx.com',
  'https://api.c0ff33a.uk'
];

nodes.forEach(testHiveAPI);
```

## Common API Methods

### Get User Profile

```javascript
{
  "jsonrpc": "2.0",
  "method": "bridge.get_profile",
  "params": {
    "account": "username"
  },
  "id": 1
}
```

### Get Posts

```javascript
{
  "jsonrpc": "2.0",
  "method": "bridge.get_account_posts",
  "params": {
    "sort": "posts",
    "account": "username",
    "limit": 20
  },
  "id": 1
}
```

### Get Discussion (Post + Comments)

```javascript
{
  "jsonrpc": "2.0",
  "method": "bridge.get_discussion",
  "params": {
    "author": "username",
    "permlink": "post-permlink"
  },
  "id": 1
}
```

### Get Dynamic Global Properties

```javascript
{
  "jsonrpc": "2.0",
  "method": "condenser_api.get_dynamic_global_properties",
  "params": [],
  "id": 1
}
```

### Get Account Info

```javascript
{
  "jsonrpc": "2.0",
  "method": "condenser_api.get_accounts",
  "params": [["username"]],
  "id": 1
}
```

## Failover System Quick Reference

### How It Works

1. **Initial Connection**: Uses default node `api.hive.blog`
2. **On Failure**: Automatically switches to next available backup node
3. **Cooldown**: Failed nodes wait 5 minutes before retry
4. **Retry Logic**: Up to 3 attempts with exponential backoff (1s, 2s, 3s)
5. **Reset**: If all nodes fail, system resets and tries again

### Configuration Files

```
src/config.js           → DEFAULT_RPC_NODE
src/services/helper.js  → hiveAPIUrls array
src/services/api.js     → Failover system implementation
```

### Key Functions

```javascript
getActiveRPCNode()      // Get current active node
setRPCNode()            // Set/switch RPC node
apiCallWithFailover()   // Wrap API calls with failover
markAPIAsFailed()       // Mark node as failed
getNextAvailableAPI()   // Get next node in rotation
```

## Monitoring & Debugging

### Check Current Node

```javascript
import { getActiveRPCNode } from 'services/api';
console.log('Current RPC Node:', getActiveRPCNode());
```

### View Failed APIs

Failed APIs are tracked in memory:
- Check browser console for warnings
- Look for "Marked API as failed" messages
- Failed APIs show cooldown status

### Manual Override

Users can manually select an RPC node:
1. Go to Settings
2. Select preferred RPC node
3. Selection is saved in localStorage as 'rpc-setting'

### Reset Failover State

To reset the failover system:
1. Refresh the page/restart app
2. Failed API list is cleared
3. System starts with default node

## Performance Benchmarks

Typical response times for well-functioning nodes:

- **Excellent**: < 100ms
- **Good**: 100-300ms
- **Acceptable**: 300-500ms
- **Slow**: 500-1000ms
- **Poor**: > 1000ms

Response time varies by:
- Geographic location
- Server load
- Network conditions
- API method complexity

## Status Monitoring Tools

### Community Resources

- **Hive Beacon**: https://beacon.peakd.com/
  - Shows real-time status of Hive API nodes
  - Displays response times and reliability

- **Hive.io Developers**: https://developers.hive.io/
  - Official documentation
  - API reference

### D.Buzz Monitoring

The application automatically monitors API health:
- Tracks successful vs. failed requests
- Measures response times
- Logs errors to console
- Implements automatic recovery

## Troubleshooting Guide

### Issue: All APIs Failing

**Symptoms**: No data loading, connection errors

**Solutions**:
1. Check internet connection
2. Check if Hive blockchain is operational
3. Try manual node selection
4. Clear browser cache and reload

### Issue: Slow Loading

**Symptoms**: Long wait times, timeouts

**Solutions**:
1. Current node may be overloaded
2. System will auto-switch after timeout
3. Manually select a faster node
4. Check network latency

### Issue: Intermittent Failures

**Symptoms**: Sometimes works, sometimes doesn't

**Solutions**:
1. Normal behavior during high traffic
2. Failover system handles automatically
3. Wait for cooldown period to expire
4. Multiple backup nodes provide resilience

## Additional Resources

- Full documentation: `docs/HIVE_APIS.md`
- Test script: `test-hive-apis.js`
- Source code: `src/services/api.js`
- Configuration: `src/config.js`

---

**Note**: API availability can change. Some nodes may go offline temporarily for maintenance or permanently. The automatic failover system is designed to handle these situations gracefully.
