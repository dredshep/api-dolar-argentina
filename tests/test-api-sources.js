const axios = require('axios');

/**
 * Test various API sources for Argentine dollar rates
 */
async function testAPISources() {
  console.log('Testing API sources for Argentine dollar rates...\n');
  
  // Array of API sources to test
  const apiSources = [
    {
      name: 'DolarAPI.com - All Dollars',
      url: 'https://dolarapi.com/v1/dolares',
      description: 'Returns all dollar types'
    },
    {
      name: 'DolarAPI.com - Official Dollar',
      url: 'https://dolarapi.com/v1/dolares/oficial',
      description: 'Returns official dollar rate'
    },
    {
      name: 'DolarAPI.com - Blue Dollar',
      url: 'https://dolarapi.com/v1/dolares/blue',
      description: 'Returns blue dollar rate'
    },
    {
      name: 'Bluelytics API',
      url: 'https://api.bluelytics.com.ar/v2/latest',
      description: 'Returns various dollar rates'
    },
    {
      name: 'Original DolarSi API (expected to fail)',
      url: 'https://www.dolarsi.com/api/dolarSiInfo.xml',
      description: 'Original API that is no longer available'
    }
  ];
  
  // Test each API source
  for (const api of apiSources) {
    console.log(`\n=== Testing ${api.name} ===`);
    console.log(`URL: ${api.url}`);
    console.log(`Description: ${api.description}`);
    
    try {
      const startTime = Date.now();
      const response = await axios.get(api.url, { timeout: 10000 });
      const endTime = Date.now();
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Response time: ${endTime - startTime}ms`);
      console.log(`Content type: ${response.headers['content-type']}`);
      
      // Print sample of the response data
      if (response.data) {
        if (typeof response.data === 'object') {
          console.log('Sample data:');
          console.log(JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
        } else {
          console.log('Sample data:');
          console.log(response.data.substring(0, 500) + '...');
        }
      }
      
      console.log('✅ API is working');
    } catch (error) {
      console.log('❌ API request failed');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`Status: ${error.response.status}`);
        console.log(`Response data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received');
        console.log(error.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error setting up request:', error.message);
      }
    }
  }
}

// Run the tests
testAPISources().catch(error => {
  console.error('Error running tests:', error);
}); 