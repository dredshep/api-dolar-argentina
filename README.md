# API Dolar Argentina

Obtene las diferentes cotizaciones del dólar, euro, reservas, evolucion y riesgo pais.
### Endpoints soportados

Debido a las limitaciones de la nueva fuente de datos, solo un subconjunto de endpoints están soportados:

| Endpoint | Estado | Descripción |
|----------|--------|-------------|
| `/api/dolaroficial` | ✅ Soportado | Cotización dólar oficial |
| `/api/dolarblue` | ✅ Soportado | Cotización dólar blue |
| `/api/dolarbolsa` | ✅ Soportado | Cotización dólar bolsa |
| `/api/dolarturista` | ✅ Soportado | Cotización dólar turista |
| `/api/mayorista` | ✅ Soportado | Cotización dolar Mayorista |
| `/api/all` | ⚠️ Parcial | Todos los valores disponibles (limitado a los tipos soportados) |

### Endpoints no soportados

Los siguientes endpoints **no están soportados** y devolverán un error 500:

| Endpoint | Estado | Descripción |
|----------|--------|-------------|
| `/api/contadoliqui` | ❌ No soportado | Cotización dólar contado con liqui |
| `/api/dolarpromedio` | ❌ No soportado | Cotización dólar promedio |
| `/api/riesgopais` | ❌ No soportado | Valor riesgo pais |
| Endpoints de bancos | ❌ No soportados | Cotizaciones específicas de bancos |
| Endpoints de casas de cambio | ❌ No soportados | Cotizaciones de casas de cambio |
| Endpoints de Euro y Real | ❌ No soportados | Cotizaciones de Euro y Real |
| Endpoints de evolución | ❌ No soportados | Evolución mensual anualizada |
| Endpoints de BCRA | ❌ No soportados | Reservas y circulante |

Para más información sobre las limitaciones actuales y alternativas, consulta el archivo [API-COMPARISON.md](./docs/API-COMPARISON.md).

## Despliegue

Para instrucciones sobre cómo desplegar esta API en un servidor Ubuntu usando PM2, consulta la [Guía de Despliegue](./docs/DEPLOYMENT.md).

## Endpoints originales
URL Antigua: https://api-dolar-argentina.herokuapp.com/

Toca correr en tu propia compu. Ninguna de las urls provistas en esta documentación puede servir ya que es una API antigua y he cambiado de API a otra cosa. Esta es para uso interno en mis bots. Si quieres APIs simplemente corre index.js y tendrás tus APIs. Cualquier duda, con ChatGPT o metes un Issue y lo leo cuando pueda.

| Metodo | Endpoint | Descripcion |
| ------ | ------ | ------ |
| GET | /api/dolaroficial | Cotizacion dólar oficial |
| GET | /api/dolarblue | Cotizacion dólar blue |
| GET | /api/contadoliqui | Cotizacion dólar contado con liqui |
| GET | /api/dolarpromedio | Cotizacion dólar promedio |
| GET | /api/dolarturista | Cotizacion dólar turista |
| GET | /api/dolarbolsa | Cotizacion dólar bolsa |
| GET | /api/riesgopais | Valor riesgo pais |
| GET | /api/bbva | Cotizacion dolar del Banco BBVA |
| GET | /api/piano | Cotizacion dolar del Banco Piano |
| GET | /api/hipotecario | Cotizacion dolar del Banco Hipotecario |
| GET | /api/galicia | Cotizacion dolar del Banco Galicia |
| GET | /api/santander | Cotizacion dolar del Banco Santander |
| GET | /api/ciudad | Cotizacion dolar del Banco Ciudad |
| GET | /api/supervielle | Cotizacion dolar del Banco Supervielle |
| GET | /api/patagonia | Cotizacion dolar del Banco Patagonia |
| GET | /api/comafi | Cotizacion dolar del Banco Comafi |
| GET | /api/nacion | Cotizacion dolar del Banco Nación |
| GET | /api/bind | Cotizacion dolar del Banco Industrial |
| GET | /api/bancor | Cotizacion dolar del Banco de Córdoba |
| GET | /api/chaco | Cotizacion dolar del Nuevo Banco del Chaco |
| GET | /api/pampa | Cotizacion dolar del Banco de La Pampa |
| GET | /api/mayorista | Cotizacion dolar Mayorista Bancos|
| GET | /api/casas/caba/metropolis | Cotizacion dolar de Metrópolis Compañía Financiera S.A |
| GET | /api/casas/caba/alpe | Cotizacion dolar de Cambio Alpe S.A |
| GET | /api/casas/caba/vaccaro | Cotizacion dolar de Francisco Vaccaro S.A |
| GET | /api/casas/caba/transatlantica | Cotizacion dolar de Transatlantica S.A |
| GET | /api/casas/lp/tilos | Cotizacion dolar de Casa de Cambio Los Tilos S.A |
| GET | /api/casas/mdp/jonestur | Cotizacion dolar de Jonestur S.A |
| GET | /api/casas/mdp/moneta | Cotizacion dolar de La Moneta Cambio S.A|
| GET | /api/casas/mdp/exchange | Cotizacion dolar de Mar del Plata Exchange S.A |
| GET | /api/casas/rosario/daminato | Cotizacion dolar de Daminato Viajes y Cambios S.A. |
| GET | /api/casas/mendoza/montemar | Cotizacion dolar de Montemar Compañía Financiera S.A |
| GET | /api/casas/tucuman/maguitur | Cotizacion dolar de Maguitur S.A |
| GET | /api/euro/nacion | Cotizacion del Euro del Banco Nación |
| GET | /api/euro/galicia | Cotizacion del Euro del Banco Galicia |
| GET | /api/euro/bbva | Cotizacion del Euro del Banco BBVA |
| GET | /api/euro/pampa | Cotizacion del Euro del Banco de La Pampa |
| GET | /api/euro/chaco | Cotizacion del Euro del Nuevo Banco del Chaco |
| GET | /api/euro/hipotecario | Cotizacion del Euro del Banco Hipotecario |
| GET | /api/real/nacion | Cotizacion del Real del Banco Nación |
| GET | /api/real/bbva | Cotizacion del Real del Banco BBVA |
| GET | /api/real/chaco | Cotizacion del Real del Nuevo Banco del Chaco |
| GET | /api/bcra/reservas | Reservas del BCRA en dólares |
| GET | /api/bcra/circulante | Total de pesos en circulación |
| GET | /api/evolucion/dolaroficial | Evolución mensual anualizada del dólar oficial |
| GET | /api/evolucion/dolarblue | Evolución mensual anualizada del dólar blue |
| GET | /api/evolucion/realoficial | Evolución mensual anualizada del Real oficial |
| GET | /api/evolucion/eurooficial | Evolución mensual anualizada del Euro oficial |
| GET | /api/all | Todos los valores disponbiles

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/409e96f2e356a5a1c14e)

### Respuestas

_Todos los endpoints de cotización devuelven la fecha y hora, el valor de compra y el valor de venta. Ejemplo:_

```javascript
{
    fecha: "2020/06/21 23:26:42",
    compra: "68.07",
    venta: "73.07"
}
```

_Los endpoints de reservas y circulante devuelven la fecha y hora, el valor y la moneda. Ejemplo:_

```javascript
{
    fecha: "2020/11/22 19:58:37",
    valor: "39120000000",
    moneda: "USD"
}
```

_Los endpoints de evolución devuelven la fecha y hora, y un array de meses con año, mes y valor. Ordenado por año y mes. Ejemplo:_

```javascript
{
    fecha: "2020/11/22 19:59:46",
    meses: [
        {
            anio: "2019",
            mes: "11",
            valor: "66.20",
        },
        {
            anio: "2019",
            mes: "12",
            valor: "69.71",
        },
        {
            anio: "2020",
            mes: "1",
            valor: "77.00",
        },

        ...

        {
            anio: "2020",
            mes: "9",
            valor: "136.80",
        },
        {
            anio: "2020",
            mes: "10",
            valor: "165.16",
        },
    ],
}
```

_La informacion es obtenida del sitio DolarSi, por lo cual tambien se puede obtener mucha mas informacion._

_Si encontras algun error o tenes alguna sugerencia, podes abrir un Issue o un Pull Request para contribuir._

## Actualización de la fuente de datos

**Nota importante:** La API original de DolarSi (`https://www.dolarsi.com/api/dolarSiInfo.xml`) ya no está disponible. Esta API ahora utiliza [DolarAPI.com](https://dolarapi.com/) como fuente de datos alternativa, pero con funcionalidad limitada.



