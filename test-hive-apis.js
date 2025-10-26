#!/usr/bin/env node

/**
 * Test script to verify Hive blockchain API endpoints
 * Tests each public API node for responsiveness and functionality
 */

const https = require('https');

// List of public Hive API endpoints
const API_ENDPOINTS = [
  { url: 'https://api.hive.blog', owner: '@blocktrades' },
  { url: 'https://api.openhive.network', owner: '@gtg' },
  { url: 'https://anyx.io', owner: '@anyx' },
  { url: 'https://rpc.ausbit.dev', owner: '@ausbitbank' },
  { url: 'https://rpc.mahdiyari.info', owner: '@mahdiyari' },
  { url: 'https://api.hive.blue', owner: '@guiltyparties' },
  { url: 'https://techcoderx.com', owner: '@techcoderx' },
  { url: 'https://hive.roelandp.nl', owner: '@roelandp' },
  { url: 'https://hived.emre.sh', owner: '@emrebeyler' },
  { url: 'https://api.deathwing.me', owner: '@deathwing' },
  { url: 'https://api.c0ff33a.uk', owner: '@c0ff33a' },
  { url: 'https://hive-api.arcange.eu', owner: '@arcange' },
  { url: 'https://hive-api.3speak.tv', owner: '@threespeak' },
  { url: 'https://hiveapi.actifit.io', owner: '@actifit' }
];

// Test payload - get dynamic global properties (basic read operation)
const TEST_PAYLOAD = {
  jsonrpc: '2.0',
  method: 'condenser_api.get_dynamic_global_properties',
  params: [],
  id: 1
};

/**
 * Test a single API endpoint
 */
function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(endpoint.url);

    const postData = JSON.stringify(TEST_PAYLOAD);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000 // 10 second timeout
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;

        try {
          const parsed = JSON.parse(data);

          if (parsed.result && parsed.result.head_block_number) {
            resolve({
              url: endpoint.url,
              owner: endpoint.owner,
              status: 'WORKING',
              responseTime: `${responseTime}ms`,
              headBlock: parsed.result.head_block_number,
              error: null
            });
          } else if (parsed.error) {
            resolve({
              url: endpoint.url,
              owner: endpoint.owner,
              status: 'ERROR',
              responseTime: `${responseTime}ms`,
              headBlock: null,
              error: parsed.error.message || 'Unknown error'
            });
          } else {
            resolve({
              url: endpoint.url,
              owner: endpoint.owner,
              status: 'INVALID_RESPONSE',
              responseTime: `${responseTime}ms`,
              headBlock: null,
              error: 'Invalid response format'
            });
          }
        } catch (e) {
          resolve({
            url: endpoint.url,
            owner: endpoint.owner,
            status: 'PARSE_ERROR',
            responseTime: `${responseTime}ms`,
            headBlock: null,
            error: `Parse error: ${e.message}`
          });
        }
      });
    });

    req.on('error', (e) => {
      const responseTime = Date.now() - startTime;
      resolve({
        url: endpoint.url,
        owner: endpoint.owner,
        status: 'FAILED',
        responseTime: `${responseTime}ms`,
        headBlock: null,
        error: e.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      resolve({
        url: endpoint.url,
        owner: endpoint.owner,
        status: 'TIMEOUT',
        responseTime: `${responseTime}ms`,
        headBlock: null,
        error: 'Request timeout after 10 seconds'
      });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Main test function
 */
async function testAllEndpoints() {
  console.log('Testing Hive API Endpoints...\n');
  console.log('='.repeat(80));
  console.log('\n');

  const results = await Promise.all(
    API_ENDPOINTS.map(endpoint => testEndpoint(endpoint))
  );

  // Categorize results
  const working = results.filter(r => r.status === 'WORKING');
  const failed = results.filter(r => r.status !== 'WORKING');

  // Sort working by response time
  working.sort((a, b) => {
    const timeA = parseInt(a.responseTime);
    const timeB = parseInt(b.responseTime);
    return timeA - timeB;
  });

  // Display working endpoints
  console.log(`✓ WORKING ENDPOINTS (${working.length}/${results.length})\n`);
  console.log('─'.repeat(80));

  working.forEach((result, index) => {
    console.log(`${index + 1}. ${result.url}`);
    console.log(`   Owner: ${result.owner}`);
    console.log(`   Response Time: ${result.responseTime}`);
    console.log(`   Head Block: ${result.headBlock}`);
    console.log('');
  });

  // Display failed endpoints
  if (failed.length > 0) {
    console.log('─'.repeat(80));
    console.log(`\n✗ FAILED ENDPOINTS (${failed.length}/${results.length})\n`);
    console.log('─'.repeat(80));

    failed.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url}`);
      console.log(`   Owner: ${result.owner}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${result.error}`);
      console.log('');
    });
  }

  // Summary
  console.log('='.repeat(80));
  console.log('\nSUMMARY:');
  console.log(`  Total Endpoints: ${results.length}`);
  console.log(`  Working: ${working.length} (${Math.round(working.length/results.length*100)}%)`);
  console.log(`  Failed: ${failed.length} (${Math.round(failed.length/results.length*100)}%)`);

  if (working.length > 0) {
    const responseTimes = working.map(r => parseInt(r.responseTime));
    const avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    console.log(`  Average Response Time: ${avgResponseTime}ms`);
    console.log(`  Fastest: ${working[0].url} (${working[0].responseTime})`);
  }

  console.log('\n' + '='.repeat(80));

  // Return results for programmatic use
  return { working, failed, all: results };
}

// Run tests
testAllEndpoints().catch(console.error);
