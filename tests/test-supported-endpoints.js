const DolarSiService = require('./services/dolarSiService');
const DolarController = require('./controller/dolarController');
const BancosController = require('./controller/bancosController');
const Util = require('./util/util');

/**
 * Test the supported endpoints with the updated service
 */
async function testSupportedEndpoints() {
  try {
    console.log('Testing supported endpoints with the updated service...\n');
    
    // Create instances of the service, util, and controllers
    const dolarSiService = new DolarSiService();
    const util = new Util();
    const dolarController = new DolarController(dolarSiService, util);
    const bancosController = new BancosController(dolarSiService, util);
    
    // Mock response object
    const res = {
      send: (data) => {
        console.log('Response data:');
        console.log(JSON.stringify(data, null, 2));
        return true;
      },
      sendStatus: (status) => {
        console.log(`Response status: ${status}`);
        return true;
      }
    };
    
    // Test supported endpoints
    const supportedEndpoints = [
      { name: 'getDolarOficial', method: dolarController.getDolarOficial },
      { name: 'getDolarBlue', method: dolarController.getDolarBlue },
      { name: 'getDolarBolsa', method: dolarController.getDolarBolsa },
      { name: 'getDolarTurista', method: dolarController.getDolarTurista },
      { name: 'getDolarMayorista', method: bancosController.getDolarMayorista },
      { name: 'getAllValues', method: dolarController.getAllValues }
    ];
    
    // Test each endpoint
    for (const endpoint of supportedEndpoints) {
      console.log(`\n=== Testing ${endpoint.name} ===`);
      try {
        const result = await endpoint.method({}, res);
        if (result === false) {
          console.log(`❌ ${endpoint.name} failed`);
        } else {
          console.log(`✅ ${endpoint.name} succeeded`);
        }
      } catch (error) {
        console.error(`❌ ${endpoint.name} failed with error:`, error.message);
      }
    }
    
    // Test an unsupported endpoint to verify error handling
    console.log('\n=== Testing getContadoConLiqui (unsupported) ===');
    try {
      const result = await dolarController.getContadoConLiqui({}, res);
      if (result === false) {
        console.log('❌ getContadoConLiqui failed as expected');
      } else {
        console.log('⚠️ getContadoConLiqui succeeded unexpectedly');
      }
    } catch (error) {
      console.log('✅ getContadoConLiqui failed with error as expected:', error.message);
    }
    
    console.log('\nTesting complete!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSupportedEndpoints(); 