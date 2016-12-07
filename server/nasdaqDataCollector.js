'use strict';

const dbClient = require('./dbClient');
const nasdaqWebClient = require('./nasdaqWebClient');

const INTERVAL_MS = 3 * 1000;

module.exports = function (nasdaqIndexCode) {
    return {
        start: function () {
            dbClient.init(nasdaqIndexCode);
            nasdaqWebClient.start(nasdaqIndexCode, INTERVAL_MS, dbClient.insert.bind(dbClient));
        }
    }
}
