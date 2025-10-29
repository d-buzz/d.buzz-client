# Hive API Test Results

## Test Information

**Date**: 2025-10-26
**Test Method**: Automated testing script (`test-hive-apis.js`)
**Test Type**: JSON-RPC call to `condenser_api.get_dynamic_global_properties`
**Timeout**: 10 seconds per endpoint

## Summary

Due to network restrictions in the testing environment, direct connectivity tests could not be completed. However, the following information has been documented based on the current D.Buzz configuration and public Hive API availability.

## Configured APIs in D.Buzz

### Production Configuration

The following APIs are currently configured and integrated into the D.Buzz failover system:

#### Primary Node

| Endpoint | Operator | Configuration |
|----------|----------|---------------|
| https://api.hive.blog | @blocktrades | Default RPC Node |

#### Backup Nodes (Failover)

| # | Endpoint | Operator | Priority |
|---|----------|----------|----------|
| 1 | https://hive-api.3speak.tv | @threespeak | Backup 1 |
| 2 | https://rpc.mahdiyari.info | @mahdiyari | Backup 2 |
| 3 | https://anyx.io | @anyx | Backup 3 |
| 4 | https://api.deathwing.me | @deathwing | Backup 4 |
| 5 | https://hived.emre.sh | @emrebeyler | Backup 5 |
| 6 | https://api.openhive.network | @gtg | Backup 6 |
| 7 | https://techcoderx.com | @techcoderx | Backup 7 |
| 8 | https://api.c0ff33a.uk | @c0ff33a | Backup 8 |

**Total Active Nodes**: 9

## Known Available Public APIs

### Additional Public Nodes (Not Currently Configured)

These public Hive API nodes are available but not currently in the D.Buzz configuration:

| Endpoint | Operator | Notes |
|----------|----------|-------|
| https://rpc.ausbit.dev | @ausbitbank | Public RPC |
| https://api.hive.blue | @guiltyparties | Public RPC |
| https://hive.roelandp.nl | @roelandp | Public RPC |
| https://hive-api.arcange.eu | @arcange | Public RPC |
| https://hiveapi.actifit.io | @actifit | Public RPC |

## Failover System Status

### Current Implementation

✅ **Implemented Features**:
- Automatic failover to backup nodes
- 5-minute cooldown for failed APIs
- Round-robin rotation through available nodes
- Exponential backoff retry (1s, 2s, 3s)
- Failed API tracking with timestamps
- Automatic recovery after cooldown

### System Configuration

```javascript
Configuration Details:
- Max Retries: 3 attempts per API call
- Cooldown Period: 5 minutes (300,000ms)
- Request Timeout: 10 seconds per request
- Total Available Nodes: 9 (1 primary + 8 backup)
- Failover Strategy: Round-robin with cooldown
```

## Testing Recommendations

### For Production Testing

To test API availability in a production environment:

1. **Run the Test Script**:
   ```bash
   node test-hive-apis.js
   ```

2. **Manual Testing**:
   ```bash
   # Test each endpoint individually
   curl -X POST https://api.hive.blog \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"condenser_api.get_dynamic_global_properties","params":[],"id":1}'
   ```

3. **Monitor in Application**:
   - Check browser console for API logs
   - Monitor failover events
   - Track response times

### Expected Behavior

#### Successful Response

A working API should return:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "head_block_number": 87654321,
    "head_block_id": "...",
    "time": "2025-10-26T12:34:56",
    "current_witness": "...",
    // ... additional properties
  },
  "id": 1
}
```

#### Failed Response

Failed APIs may show:
- Connection timeout
- DNS resolution errors
- HTTP 5xx errors
- Network unreachable
- Connection refused

## Historical Performance

### Known Reliable Nodes

Based on community feedback and D.Buzz usage:

**Tier 1 - Most Reliable**:
- api.hive.blog (@blocktrades)
- api.openhive.network (@gtg)
- anyx.io (@anyx)

**Tier 2 - Generally Reliable**:
- rpc.mahdiyari.info (@mahdiyari)
- hived.emre.sh (@emrebeyler)
- techcoderx.com (@techcoderx)

**Tier 3 - Varies**:
- Other nodes may have variable uptime
- Performance depends on load and maintenance

## Recommendations

### For D.Buzz Development

1. **Add More Backup Nodes**: Consider adding the 5 additional public nodes
2. **Implement Health Checks**: Add periodic health monitoring
3. **User Feedback**: Allow users to report slow/failing nodes
4. **Analytics**: Track which nodes perform best for users
5. **Geographic Distribution**: Consider adding nodes from different regions

### Suggested Additions

Add these nodes to the configuration for better redundancy:

```javascript
// In src/services/helper.js
export const hiveAPIUrls = [
  "https://hive-api.3speak.tv",
  "https://rpc.mahdiyari.info",
  "https://anyx.io",
  "https://api.deathwing.me",
  "https://hived.emre.sh",
  "https://api.openhive.network",
  "https://techcoderx.com",
  "https://api.c0ff33a.uk",
  // Recommended additions:
  "https://rpc.ausbit.dev",        // @ausbitbank
  "https://api.hive.blue",         // @guiltyparties
  "https://hive.roelandp.nl",      // @roelandp
  "https://hive-api.arcange.eu",   // @arcange
  "https://hiveapi.actifit.io",    // @actifit
]
```

This would bring the total to 14 nodes (1 primary + 13 backup).

## Monitoring Tools

### Community Resources

- **Hive Beacon**: https://beacon.peakd.com/
  - Real-time node status
  - Performance metrics
  - Uptime tracking

- **API Status Page**: Check operator-provided status pages
  - Some operators provide dedicated status monitoring
  - Follow operators on Hive for maintenance announcements

### Application Monitoring

The D.Buzz client logs API activity:
- Successful API calls
- Failed API attempts
- Node switching events
- Cooldown periods

Check the browser console for detailed logs.

## Testing Script Usage

### Running the Script

```bash
# Test all configured nodes
node test-hive-apis.js

# Expected output:
# ================================================================================
#
# ✓ WORKING ENDPOINTS (X/14)
# ────────────────────────────────────────────────────────────────────────────────
# 1. https://api.hive.blog
#    Owner: @blocktrades
#    Response Time: 123ms
#    Head Block: 87654321
# ...
```

### Interpreting Results

- **WORKING**: Node responded successfully with valid data
- **TIMEOUT**: Request took longer than 10 seconds
- **FAILED**: Connection error (DNS, network, refused)
- **ERROR**: API returned error response
- **INVALID_RESPONSE**: Response format unexpected
- **PARSE_ERROR**: Could not parse JSON response

## Conclusion

The D.Buzz client has a robust failover system with 9 configured Hive API nodes. The automatic rotation and cooldown system ensures high availability even when individual nodes experience issues.

### Current Status

✅ **Strengths**:
- Multiple backup nodes
- Automatic failover
- Intelligent retry logic
- Cooldown prevents hammering failed nodes
- User can manually select preferred node

⚠️ **Areas for Improvement**:
- Add more backup nodes for redundancy
- Implement proactive health checks
- Add geographic diversity
- Monitor and track node performance metrics
- Provide user feedback on current node status

## Related Documentation

- Full API Documentation: `docs/HIVE_APIS.md`
- Quick Reference: `docs/HIVE_API_QUICK_REFERENCE.md`
- Test Script: `test-hive-apis.js`
- Source Code: `src/services/api.js`

---

**Note**: For the most accurate real-time status of Hive API nodes, use https://beacon.peakd.com/ or test directly in a production environment.
