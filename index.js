'use strict';

const apiV1 = require('./server/nasdaqServiceV1.js');
const collector = require('./server/nasdaqDataCollector');
const _ = require('lodash');

// Add element here if it has more index codes
const COLLECTED_CODES = ['ixic'];
const SERVICE_PORT = process.env.NASDAQ_SERVICE_PORT || 8080;

// Scrap NASDAQ data
_.each(COLLECTED_CODES, function(code) {
    collector(code).start();
});

// Start REST servvice
apiV1.start(SERVICE_PORT);