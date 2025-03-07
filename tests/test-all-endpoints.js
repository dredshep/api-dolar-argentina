const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Test all API endpoints
 */
async function testAllEndpoints() {
  console.log('Testing all API endpoints...\n');
  
  // Extract endpoints from README.md
  const readmeContent = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8');
  const endpoints = extractEndpoints(readmeContent);
  
  console.log(`Found ${endpoints.length} endpoints to test.\n`);
  
  // Start the server
  const server = require('./index');
  
  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test each endpoint
  const results = [];
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}...`);
    const result = await testEndpoint(endpoint);
    results.push(result);
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate and save report
  const report = generateMarkdownReport(results);
  fs.writeFileSync(path.join(__dirname, 'endpoint-status-report.md'), report);
  
  console.log('\nTesting complete. Report saved to endpoint-status-report.md');
  
  // Close the server
  server.close();
}

/**
 * Extract endpoints from README.md
 * @param {string} readmeContent - The content of README.md
 * @returns {string[]} - The extracted endpoints
 */
function extractEndpoints(readmeContent) {
  const endpoints = [];
  const regex = /\| GET \| (\/api\/[^\s|]+) \|/g;
  let match;
  
  while ((match = regex.exec(readmeContent)) !== null) {
    if (match[1]) {
      endpoints.push(match[1]);
    }
  }
  
  return endpoints;
}

/**
 * Test an endpoint
 * @param {string} endpoint - The endpoint to test
 * @returns {Object} - The test result
 */
async function testEndpoint(endpoint) {
  const url = `http://localhost:8080${endpoint}`;
  try {
    const startTime = Date.now();
    const response = await axios.get(url, { timeout: 5000 });
    const endTime = Date.now();
    
    return {
      endpoint,
      status: response.status,
      statusText: getStatusCategory(response.status),
      responseTime: endTime - startTime,
      success: true
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        endpoint,
        status: error.response.status,
        statusText: getStatusCategory(error.response.status),
        responseTime: 0,
        success: false
      };
    } else {
      return {
        endpoint,
        status: 0,
        statusText: 'Error (Network/Timeout)',
        responseTime: 0,
        success: false
      };
    }
  }
}

/**
 * Get the status category
 * @param {number} status - The HTTP status code
 * @returns {string} - The status category
 */
function getStatusCategory(status) {
  if (status >= 200 && status < 300) return '2xx (Success)';
  if (status >= 400 && status < 500) return '4xx (Client Error)';
  if (status >= 500 && status < 600) return '5xx (Server Error)';
  return 'Unknown';
}

/**
 * Generate a markdown report
 * @param {Object[]} results - The test results
 * @returns {string} - The markdown report
 */
function generateMarkdownReport(results) {
  let markdown = '# API Endpoints Status Report\n\n';
  markdown += 'This report shows the status of all API endpoints listed in the README.md file.\n\n';
  markdown += '| Endpoint | Status Code | Status Category | Response Time |\n';
  markdown += '| -------- | ----------- | --------------- | ------------ |\n';
  
  for (const result of results) {
    const responseTime = result.responseTime ? `${result.responseTime}ms` : 'N/A';
    markdown += `| ${result.endpoint} | ${result.status} | ${result.statusText} | ${responseTime} |\n`;
  }
  
  const successCount = results.filter(result => result.success).length;
  const failureCount = results.length - successCount;
  
  markdown += `\n## Summary\n\n`;
  markdown += `- Total endpoints: ${results.length}\n`;
  markdown += `- Successful endpoints: ${successCount}\n`;
  markdown += `- Failed endpoints: ${failureCount}\n`;
  
  markdown += '\n\n*Report generated on: ' + new Date().toISOString() + '*\n';
  return markdown;
}

// Run the tests
testAllEndpoints().catch(error => {
  console.error('Error running tests:', error);
}); 