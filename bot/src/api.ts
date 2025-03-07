import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Import the necessary modules from the main repository
// Using relative paths to go up from bot/src to the root directory
const utilPath = path.join(__dirname, "../../util/util.js");
const dolarSiServicePath = path.join(__dirname, "../../services/dolarSiService.js");

// Import the utility and service classes
const Util = require(utilPath);
const DolarSiService = require(dolarSiServicePath);

// Create instances
const utilInstance = new Util();
const dolarSiServiceInstance = new DolarSiService();

// Create a mock request object for the /api/all endpoint
const createMockRequest = (endpoint: string) => {
  return { path: endpoint };
};

/**
 * Fetch data from the API directly using the imported functions
 * @param endpoint The API endpoint to fetch data from
 * @returns The data from the API
 */
export async function fetchDolarData(endpoint: string): Promise<any> {
  try {
    // Create a mock request object if needed
    const mockReq = createMockRequest(endpoint);
    
    // Get the raw data from the service
    const data = await dolarSiServiceInstance.getInfoDolar(mockReq);
    
    // Process the data based on the endpoint
    switch (endpoint) {
      case "/api/dolaroficial":
        return {
          fecha: utilInstance.getDateTime(),
          compra: utilInstance.formatNumber(data.cotiza.Dolar.casa344.compra._text),
          venta: utilInstance.formatNumber(data.cotiza.Dolar.casa344.venta._text)
        };
      case "/api/dolarblue":
        return {
          fecha: utilInstance.getDateTime(),
          compra: utilInstance.formatNumber(data.cotiza.Dolar.casa380.compra._text),
          venta: utilInstance.formatNumber(data.cotiza.Dolar.casa380.venta._text)
        };
      case "/api/dolarbolsa":
        return {
          fecha: utilInstance.getDateTime(),
          compra: utilInstance.formatNumber(data.cotiza.Dolar.casa313.compra._text),
          venta: utilInstance.formatNumber(data.cotiza.Dolar.casa313.venta._text)
        };
      case "/api/dolarturista":
        return {
          fecha: utilInstance.getDateTime(),
          compra: utilInstance.formatNumber(data.cotiza.Dolar.casa406.compra._text),
          venta: utilInstance.formatNumber(data.cotiza.Dolar.casa406.venta._text)
        };
      case "/api/mayorista":
        return {
          fecha: utilInstance.getDateTime(),
          compra: utilInstance.formatNumber(data.cotiza.Dolar.casa44.compra._text),
          venta: utilInstance.formatNumber(data.cotiza.Dolar.casa44.venta._text)
        };
      case "/api/all":
        // Return the data in the expected structure with a 'valores' property
        return {
          valores: data.cotiza
        };
      default:
        throw new Error(`Endpoint not supported: ${endpoint}`);
    }
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
} 