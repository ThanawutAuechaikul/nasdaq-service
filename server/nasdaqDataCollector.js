'use strict';

const dbClient = require('./dbClient');
const nasdaqWebClient = require('./nasdaqWebClient');

module.exports = function (nasdaqIndexCode) {
    return {
        start: function () {
            var indexDbClient = dbClient(nasdaqIndexCode);
            indexDbClient.init();
            nasdaqWebClient.start(nasdaqIndexCode, indexDbClient.insert);
        }
    }
}
