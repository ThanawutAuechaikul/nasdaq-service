'use strict';

const path = require('path');
const nasdaqServiceV1 = require(path.resolve('server/nasdaqServiceV1.js'));
const collector = require(path.resolve('server/nasdaqDataCollector'));
const _ = require('lodash');

// Add element here if it has more index codes
const COLLECTED_CODES = ['ixic', 'ixndx'];
const SERVICE_PORT = process.env.NASDAQ_SERVICE_PORT || 8080;

// Scrap and collect NASDAQ data
_.each(COLLECTED_CODES, function(code) {
    collector(code).start();
});

// Start REST service
nasdaqServiceV1.start(SERVICE_PORT);