class util {

    /**
     * Obtiene la fecha y hora actual formateada en zona horaria de Argentina.
     */
    getDateTime = function () {
        const options = {
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

    /**
     * Formatea un texto numérico a formato moneda.
     * @param {string} value Texto que contiene el valor numérico a convertir.
     * @param {number} decimalPlaces Cantidad de caracteres decimales a conservar.
     */
    formatNumber = function (value, decimalPlaces) {
        let decimals = decimalPlaces || 2;
        let convertedValue = parseFloat(value.replace('.', '').replace(',', '.'))
        return !isNaN(convertedValue) ? convertedValue.toFixed(decimals) : 'No cotiza'
    }

    /**
     * Devuelve un objeto que contiene los valores de la cotización anual por mes.
     * @param {object} evolucionAnual Objeto que contiene el valor de cada mes del año.
     */
    getEvolucion = function (evolucionAnual) {
        const options = {
            timeZone: 'America/Argentina/Buenos_Aires'
        };
        const now = new Date();
        const mesActual = new Date(now.toLocaleString('en-US', options)).getMonth() + 1;

        let meses = []
        for (let i = 1; i <= Object.keys(evolucionAnual).length; i++) {
            meses.push({
                "anio": (i < mesActual ? now.getFullYear() : now.getFullYear() - 1).toString(),
                "mes": i.toString(),
                "valor": this.formatNumber(evolucionAnual[[Object.keys(evolucionAnual)[i - 1]]]._text).toString()
            })
        }
        meses = meses.sort((a, b) => a.anio - b.anio)

        const valores = {
            fecha: this.getDateTime(),
            meses
        }

        return valores
    }
}

module.exports = util