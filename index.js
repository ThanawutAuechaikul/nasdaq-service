'use strict';

const dbClient = require('./server/dbClient');
const nasdaqWebClient = require('./server/nasdaqWebClient');

var ixicClient = dbClient('ixic'); 
ixicClient.init();
nasdaqWebClient.run('ixic');