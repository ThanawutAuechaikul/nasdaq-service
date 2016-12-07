'use strict';

const apiV1 = require('./server/nasdaqServiceV1.js');
const collector = require('./server/nasdaqDataCollector');
const COLLECTED_CODES = ['ixic']; // Add here if it has more index codes
const SERVICE_PORT = process.env.NASDAQ_SERVICE_PORT || 8080;  

for (var codeIndex = 0; codeIndex < COLLECTED_CODES.length; codeIndex++) {
    collector(COLLECTED_CODES[codeIndex]).start();
}

apiV1.start(SERVICE_PORT);