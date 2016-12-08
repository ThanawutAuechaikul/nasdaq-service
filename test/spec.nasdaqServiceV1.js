'use strict';

const path = require('path');
const request = require('supertest');
const sinon = require('sinon');
const nasdaqServiceV1 = require(path.resolve('server/nasdaqServiceV1'));
const dbClient = require(path.resolve('server/dbClient'));

const TEST_PORT = 8888;

describe('nasdaqServiceV1', function () {
    describe('GET /api/v1/:nasdaqIndexCode', function () {
        var testIndexCode = "test_index_code";

        before(function () {
            nasdaqServiceV1.start(TEST_PORT);
        });

        it('should return empty array when no data', function (done) {
            var mockRows = [];
            var expectedServiceResponse = [];
            var dbclientStub = sinon.stub(dbClient, "select", mockSelectFunction(mockRows));

            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/' + testIndexCode)
                .expect(expectedServiceResponse, done);
        });

        it('should return correct time-series data when DB has data', function (done) {
            var mockRows = [
                { AsOf: 1481130777777, Value: "7777.0000" },
                { AsOf: 1481130888888, Value: "8888.0000" }
            ];
            var expectedServiceResponse = [
                { x: 1481130777777, y: "7777.0000" },
                { x: 1481130888888, y: "8888.0000" }
            ];
            var dbclientStub = sinon.stub(dbClient, "select", mockSelectFunction(mockRows));

            // Act + Assert
            request('http://localhost:' + TEST_PORT)
                .get('/api/v1/' + testIndexCode)
                .expect(expectedServiceResponse, done);
        });

        afterEach(function () {
            dbClient.select.restore();
        });

        function mockSelectFunction(mockRows) {
            return function mockPromise(indexCode) {
                if (indexCode === testIndexCode) {
                    return new Promise(
                        function (resolve, reject) {
                            resolve(mockRows);
                        }
                    );
                } else {
                    console.error("select parameter should be " + testIndexCode);
                }
            }
        }
    });
});