'use strict';

const path = require('path');
const request = require('supertest');
const nasdaqServiceV1 = require(path.resolve('server/nasdaqServiceV1'));
const dbClient = require(path.resolve('server/dbClient'));

const TEST_PORT = 8888;

describe('nasdaqServiceV1', function () {
    describe('GET /api/v1/:nasdaqIndexCode', function () {
        var testIndexCode = "test_index_code";

        before(function () {
            nasdaqServiceV1.start(TEST_PORT);
        });

        beforeEach(function (done) {
            dbClient.init(testIndexCode).then(function () {
                done();
            });
        });

        it('should return empty array when no data', function (done) {
            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/' + testIndexCode)
                .expect([], done);
        });

        it('should return correct time-series data when DB has data', function (done) {
            dbClient.insert(testIndexCode, 1481130777777, "7777.0000");
            dbClient.insert(testIndexCode, 1481130888888, "8888.0000");
            var expectedReturnValue = [
                { x: 1481130777777, y: "7777.0000" },
                { x: 1481130888888, y: "8888.0000" }
            ];

            // Act + Assert
            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/' + testIndexCode)
                .expect(expectedReturnValue, done);
        });

        afterEach(function (done) {
            dbClient.dropTable(testIndexCode).then(function () {
                done();
            });
        });
    });
});