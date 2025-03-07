const DolarSiService = require('./services/dolarSiService');
const DolarController = require('./controller/dolarController');
const Util = require('./util/util');

/**
 * Test the updated service with the existing controllers
 */
async function testUpdatedService() {
  try {
    console.log('Testing updated service with existing controllers...\n');
    
    // Create instances of the service, util, and controller
    const dolarSiService = new DolarSiService();
    const util = new Util();
    const dolarController = new DolarController(dolarSiService, util);
    
    // Mock response object
    const res = {
      send: (data) => {
        console.log('Response data:');
        console.log(JSON.stringify(data, null, 2));
      },
      sendStatus: (status) => {
        console.log(`Response status: ${status}`);
      }
    };
    
    // Test the getAllValues method
    console.log('\n=== Testing getAllValues ===');
    await dolarController.getAllValues({}, res);
    
    // Test the getDolarOficial method
    console.log('\n=== Testing getDolarOficial ===');
    await dolarController.getDolarOficial({}, res);
    
    // Test the getDolarBlue method
    console.log('\n=== Testing getDolarBlue ===');
    await dolarController.getDolarBlue({}, res);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testUpdatedService(); 