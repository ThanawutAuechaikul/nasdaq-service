const path = require('path');
const should = require('should'); 
const assert = require('assert');
const request = require('supertest'); 
const nasdaqServiceV1 = require(path.resolve('server/nasdaqServiceV1')); 
const TEST_PORT = 8888;

describe('nasdaqServiceV1', function () {
    describe('GET /api/v1/:nasdaqIndexCode', function () {
        it('should extend the request prototype', function (done) {
            console.log('..... test .....')
            nasdaqServiceV1.start(TEST_PORT);
            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/ixic')
                .expect('nasdaqIndexCode=ixic', done);
        
        });
    });
});