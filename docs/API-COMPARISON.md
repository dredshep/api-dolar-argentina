# Argentine Dollar Rate API Comparison

This document compares the available APIs for Argentine dollar exchange rates based on our testing.

## Test Results Summary

| API | Status | Response Time | Data Quality |
|-----|--------|---------------|--------------|
| DolarAPI.com - All Dollars | ✅ Working | ~233ms | Comprehensive |
| DolarAPI.com - Official Dollar | ✅ Working | ~151ms | Good |
| DolarAPI.com - Blue Dollar | ✅ Working | ~61ms | Good |
| Bluelytics API | ✅ Working | ~682ms | Good |
| Original DolarSi API | ❌ Failed | N/A | N/A |

## API Response Formats

### DolarAPI.com

**Endpoint:** `https://dolarapi.com/v1/dolares`

**Response Format:**
```json
[
  {
    "moneda": "USD",
    "casa": "oficial",
    "nombre": "Oficial",
    "compra": 1044.75,
    "venta": 1084.75,
    "fechaActualizacion": "2025-03-07T09:12:00.000Z"
  },
  {
    "moneda": "USD",
    "casa": "blue",
    "nombre": "Blue",
    "compra": 1195,
    "venta": 1215,
    "fechaActualizacion": "2025-03-07T15:59:00.000Z"
  },
  ...
]
```

**Single Dollar Type (e.g., `https://dolarapi.com/v1/dolares/oficial`):**
```json
{
  "moneda": "USD",
  "casa": "nombre": "Oficial",
  "compra": 1045.25,
  "venta": 1085.25,
  "fechaActualizacion": "2025-03-07T13:59:00.000Z"
}
```

### Bluelytics API

**Endpoint:** `https://api.bluelytics.com.ar/v2/latest`

**Response Format:**
```json
{
  "oficial": {
    "value_avg": 1065,
    "value_sell": 1095,
    "value_buy": 1035
  },
  "blue": {
    "value_avg": 1205,
    "value_sell": 1215,
    "value_buy": 1195
  },
  "oficial_euro": {
    "value_avg": 1157.5,
    "value_sell": 1190,
    "value_buy": 1125
  },
  "blue_euro": {
    "value_avg": 1310,
    "value_sell": 1321,
    "value_buy": 1299
  },
  "last_update": "2025-03-07T14:01:26.336722-03:00"
}
```

## Comparison

### DolarAPI.com Advantages
- Faster response times
- More comprehensive data with multiple dollar types
- Cleaner JSON structure
- Individual endpoints for each dollar type
- Well-documented API
- Includes timestamp for each rate

### Bluelytics API Advantages
- Includes average values
- Combines dollar and euro rates in a single response
- Simpler structure for basic use cases

## Recommendation

Based on our testing, **DolarAPI.com** appears to be the better choice for replacing the original DolarSi API for the following reasons:

1. **Faster response times** - DolarAPI.com responded significantly faster than Bluelytics
2. **More comprehensive data** - Includes more dollar types and detailed information
3. **Better structure** - The JSON structure is cleaner and more consistent
4. **Individual endpoints** - Allows fetching only the needed data
5. **Documentation** - Better documented API

## Implementation Considerations

When implementing DolarAPI.com as a replacement, we'll need to:

1. Update the service to fetch data from DolarAPI.com
2. Transform the response to match the expected format in the existing codebase
3. Map the DolarAPI keys to the original dolarSi keys
4. Handle error cases appropriately

This approach will minimize changes to the rest of the codebase while updating the data source.

## Supported Endpoints

Due to the differences between the original DolarSi API and the new DolarAPI.com source, only a subset of endpoints are fully supported:

| Endpoint | Status | Description |
|----------|--------|-------------|
| `/api/dolaroficial` | ✅ Supported | Official dollar rate |
| `/api/dolarblue` | ✅ Supported | Blue dollar rate |
| `/api/dolarbolsa` | ✅ Supported | Stock market dollar rate |
| `/api/dolarturista` | ✅ Supported | Tourist dollar rate |
| `/api/mayorista` | ✅ Supported | Wholesale dollar rate |
| `/api/all` | ⚠️ Partial | Returns all available rates (limited to supported types) |
| `/api/contadoliqui` | ❌ Unsupported | Liquidity dollar rate - Not available in DolarAPI.com |
| `/api/dolarpromedio` | ❌ Unsupported | Average dollar rate - Not available in DolarAPI.com |
| `/api/riesgopais` | ❌ Unsupported | Country risk - Not available in DolarAPI.com |
| Bank-specific endpoints | ❌ Unsupported | Not available in DolarAPI.com |
| Exchange house endpoints | ❌ Unsupported | Not available in DolarAPI.com |
| Euro and Real endpoints | ❌ Unsupported | Not available in DolarAPI.com |
| Evolution endpoints | ❌ Unsupported | Not available in DolarAPI.com |
| BCRA endpoints | ❌ Unsupported | Not available in DolarAPI.com |

### Limitations

The original DolarSi API provided a much more comprehensive dataset that is not available from DolarAPI.com. Unsupported endpoints will return a 500 error with a clear message indicating that the endpoint is not supported.

## Error Handling

When calling an unsupported endpoint, you will receive a 500 error response. We recommend checking the API-COMPARISON.md file or the `_api_notice` field in the `/api/all` response to understand which endpoints are supported.

## Future Improvements

To support more endpoints, we would need:

1. Additional data sources for specific data types
2. Web scraping for data not available via APIs
3. A proxy API that combines data from multiple sources

If you need access to the unsupported data types, we recommend:

1. Using the original data sources directly (e.g., bank websites)
2. Finding alternative APIs that provide the specific data you need
3. Contributing to this project by implementing additional data sources 