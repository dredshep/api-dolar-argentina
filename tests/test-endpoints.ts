import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Base URL for the API
const BASE_URL = 'http://localhost:8080';

// Function to extract endpoints from README.md
function extractEndpoints(readmeContent: string): string[] {
  const endpoints: string[] = [];
  const regex = /\| GET \| (\/api\/[^\s|]+) \|/g;
  let match;

  while ((match = regex.exec(readmeContent)) !== null) {
    if (match[1]) {
      endpoints.push(match[1]);
    }
  }

  return endpoints;
}

// Function to test an endpoint and return its status
async function testEndpoint(endpoint: string): Promise<{ endpoint: string; status: number; statusText: string }> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await axios.get(url, { timeout: 10000 });
    return {
      endpoint,
      status: response.status,
      statusText: getStatusCategory(response.status),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        endpoint,
        status: error.response.status,
        statusText: getStatusCategory(error.response.status),
      };
    } else {
      return {
        endpoint,
        status: 0,
        statusText: 'Error (Network/Timeout)',
      };
    }
  }
}

// Function to categorize status codes
function getStatusCategory(status: number): string {
  if (status >= 200 && status < 300) return '2xx (Success)';
  if (status >= 400 && status < 500) return '4xx (Client Error)';
  if (status >= 500 && status < 600) return '5xx (Server Error)';
  return 'Unknown';
}

// Function to generate markdown report
function generateMarkdownReport(results: { endpoint: string; status: number; statusText: string }[]): string {
  let markdown = '# API Endpoints Status Report\n\n';
  markdown += 'This report shows the status of all API endpoints listed in the README.md file.\n\n';
  markdown += '| Endpoint | Status Code | Status Category |\n';
  markdown += '| -------- | ----------- | --------------- |\n';

  for (const result of results) {
    markdown += `| ${result.endpoint} | ${result.status} | ${result.statusText} |\n`;
  }

  markdown += '\n\n*Report generated on: ' + getArgentinaDateTime() + '*\n';
  return markdown;
}

// Add a function to get Argentina date time
function getArgentinaDateTime(): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  return new Date().toLocaleString('es-AR', options) + ' (ART)';
}

// Main function
async function main() {
  try {
    // Read README.md
    const readmeContent = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8');
    
    // Extract endpoints
    const endpoints = extractEndpoints(readmeContent);
    console.log(`Found ${endpoints.length} endpoints to test.`);
    
    // Test each endpoint
    const results: Array<{ endpoint: string; status: number; statusText: string }> = [];
    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint}...`);
      const result = await testEndpoint(endpoint);
      results.push(result);
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Generate and save report
    const report = generateMarkdownReport(results);
    fs.writeFileSync(path.join(__dirname, 'endpoint-status-report.md'), report);
    
    console.log('Testing complete. Report saved to endpoint-status-report.md');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main(); 