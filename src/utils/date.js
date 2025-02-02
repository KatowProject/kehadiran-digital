const moment = require('moment');

module.exports = {
    /**
     *  Get current date in UTC
     * @returns {string}
     */
    dateUTC: () => {
        return moment().utc().toISOString()
    },
    /**
     * Get current date in ISO format
     * @param {string} locale
     * @returns {string}
     */
    dateISO: (locale) => {
        return moment().locale(locale).toISOString()
    },
}