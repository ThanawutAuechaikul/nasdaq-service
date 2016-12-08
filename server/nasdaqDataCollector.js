'use strict';

const path = require('path');
const dbClient = require(path.resolve('server/dbClient'));
const nasdaqWebClient = require(path.resolve('server/nasdaqWebClient'));

const INTERVAL_MS = 10 * 1000;

module.exports = function (nasdaqIndexCode) {
    return {
        start: function () {
            dbClient.init(nasdaqIndexCode).then(function() {
                nasdaqWebClient(nasdaqIndexCode).start(INTERVAL_MS, dbClient.insert.bind(dbClient));
            });     
        }
    };
}
