'use strict';

const path = require('path');
const request = require('supertest');
const nasdaqServiceV1 = require(path.resolve('server/nasdaqServiceV1'));
const dbClient = require(path.resolve('server/dbClient'));

const TEST_PORT = 8888;

describe('nasdaqServiceV1', function () {
    describe('GET /api/v1/:nasdaqIndexCode', function () {
        var testIndex = "test_index";

        before(function () {
            nasdaqServiceV1.start(TEST_PORT);
        });

        beforeEach(function (done) {
            dbClient.init(testIndex).then(function () {
                done();
            });
        });

        it('should return empty array when no data', function (done) {
            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/' + testIndex)
                .expect([], done);
        });

        it('should return correct time-series data when DB has data', function (done) {
            dbClient.insert(testIndex, 1481130777777, "7777.0000");
            dbClient.insert(testIndex, 1481130888888, "8888.0000");
            var expectedReturnValue = [
                { x: 1481130777777, y: "7777.0000" },
                { x: 1481130888888, y: "8888.0000" }
            ];

            // Act + Assert
            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/' + testIndex)
                .expect(expectedReturnValue, done);
        });

        afterEach(function (done) {
            dbClient.dropTable(testIndex).then(function () {
                done();
            });
        });
    });
});