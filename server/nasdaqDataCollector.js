'use strict';

const path = require('path');
const dbClient = require(path.resolve('server/dbClient'));
const nasdaqWebScraper = require(path.resolve('server/nasdaqWebScraper'));

const INTERVAL_MS = 10 * 1000;

module.exports = function (nasdaqIndexCode) {
    return {
        start: function () {
            dbClient
            .init(nasdaqIndexCode)
            .then(function() {
                nasdaqWebScraper(nasdaqIndexCode)
                .start(INTERVAL_MS, dbClient.insert.bind(dbClient));
            });     
        }
    };
}
