const axios = require('axios')

class dolarSiService {
    /**
     * @description Obtener un json parseado con los valores de dolar
     * @returns {Promise<Object>} The formatted dollar rates
     */
    getInfoDolar = async (req) => {
        try {
            // Using DolarAPI.com instead of dolarSi
            const response = await axios.get('https://dolarapi.com/v1/dolares')
            
            // Check if this is the /api/all endpoint
            const isAllEndpoint = req && req.path === '/api/all'
            
            // Format the response to match the expected structure
            const formattedData = this.formatDolarApiResponse(response.data, isAllEndpoint)
            
            // Create the structure expected by the controllers
            return {
                cotiza: {
                    // Main dollar rates structure
                    Dolar: formattedData,
                    
                    // Add specific structures for supported endpoints
                    valores_principales: {
                        casa406: formattedData.turistaybolsa, // Tourist dollar
                        casa313: formattedData.bolsa, // Stock market dollar
                        casa44: formattedData.mayorista, // Mayorista dollar
                    },
                    
                    // Add a message for unsupported endpoints
                    _api_notice: {
                        message: "Many endpoints are not supported with the new API source. See docs/API-COMPARISON.md for details.",
                        supported_endpoints: [
                            "/api/dolaroficial",
                            "/api/dolarblue",
                            "/api/dolarbolsa",
                            "/api/dolarturista",
                            "/api/mayorista",
                            "/api/all (partial)"
                        ],
                        unsupported_endpoints: [
                            "/api/contadoliqui",
                            "/api/dolarpromedio",
                            "/api/riesgopais",
                            "All bank-specific endpoints",
                            "All exchange house endpoints",
                            "All Euro and Real endpoints",
                            "All evolution endpoints",
                            "All BCRA endpoints"
                        ]
                    }
                }
            }
        } catch(e) {
            console.log('Error fetching dollar rates:', e)
            throw new Error('Failed to fetch dollar rates')
        }
    }

    /**
     * @description Format DolarAPI response to match the expected format
     * @param {Array} data - The data from DolarAPI
     * @param {boolean} isAllEndpoint - Whether this is the /api/all endpoint
     * @returns {Object} - Formatted data to match the original structure
     */
    formatDolarApiResponse = (data, isAllEndpoint = false) => {
        const result = {}
        
        // Map the DolarAPI response to match the expected structure
        data.forEach(item => {
            const mappedData = this.mapDolarApiData(item)
            if (mappedData) {
                const { key, formattedData } = mappedData
                result[key] = formattedData
                
                // Only add casa mappings if not the /api/all endpoint or if needed for specific endpoints
                if (!isAllEndpoint) {
                    // Add casa mappings for supported dollar types
                    if (key === 'blue') {
                        result['casa380'] = formattedData
                    }
                    
                    if (key === 'dolar') {
                        result['casa310'] = formattedData
                        result['casa344'] = formattedData
                    }
                    
                    if (key === 'bolsa') {
                        result['casa349'] = formattedData
                        result['casa313'] = formattedData
                    }
                    
                    if (key === 'turistaybolsa') {
                        result['casa406'] = formattedData
                    }
                    
                    if (key === 'mayorista') {
                        result['casa44'] = formattedData
                    }
                }
            }
        })
        
        return result
    }
    
    /**
     * @description Map DolarAPI data to the expected format
     * @param {Object} item - The item from DolarAPI
     * @returns {Object|null} - The mapped data or null if not mapped
     */
    mapDolarApiData = (item) => {
        const key = this.getDolarSiKey(item.casa)
        if (!key) return null
        
        const timestamp = new Date(item.fechaActualizacion).toLocaleString('es-AR')
        
        // Format numbers to match the expected format for util.formatNumber
        // The method expects a string with comma as decimal separator
        const formatValue = (value) => {
            if (!value) return 'N/A'
            return value.toString().replace('.', ',')
        }
        
        const formattedData = {
            casa: key,
            nombre: item.nombre,
            compra: {
                _text: formatValue(item.compra)
            },
            venta: {
                _text: formatValue(item.venta)
            },
            fecha: {
                _text: timestamp
            }
        }
        
        return { key, formattedData }
    }
    
    /**
     * @description Map DolarAPI keys to the original dolarSi keys
     * @param {String} dolarApiKey - The key from DolarAPI
     * @returns {String} - The corresponding dolarSi key
     */
    getDolarSiKey = (dolarApiKey) => {
        const keyMap = {
            'oficial': 'dolar',
            'blue': 'blue',
            'bolsa': 'bolsa',
            'tarjeta': 'turistaybolsa',
            'mayorista': 'mayorista',
            'cripto': 'dolarbitcoin'
        }
        
        return keyMap[dolarApiKey]
    }
}

module.exports = dolarSiService