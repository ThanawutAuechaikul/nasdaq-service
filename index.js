'use strict';

const collector = require('./server/nasdaqDataCollector');
// Add here if it has more mode
const COLLECTED_CODES = ['ixic'];

for (var codeIndex = 0; codeIndex < COLLECTED_CODES.length; codeIndex++) {
    collector(COLLECTED_CODES[codeIndex]).start();
}