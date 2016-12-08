'use strict';

const path = require('path');
const fs = require('fs');
const should = require('should');
const dbClient = require(path.resolve('server/dbClient'));

describe('dbClient', function () {
    describe('.init', function () {
        // Add timestamp to ensure test file is fresh
        var testIndexCode = "test_index_code_" + new Date().getTime();

        it('should create data file if not exist', function (done) {
            dbClient.init(testIndexCode).then(function () {
                var expectedFilePath = dbClient.getDataFilePath(testIndexCode);
                var actualFileExist = fs.existsSync(expectedFilePath);

                // Assert
                actualFileExist.should.be.true();

                done();
            });
        });

        it('should insert and select correct', function (done) {
            dbClient.init(testIndexCode)
                .then(function () {
                    dbClient.insert(testIndexCode, 1481130777777, "7777.0000");
                }).then(function () {
                    dbClient.insert(testIndexCode, 1481130888888, "8888.0000");
                }).then(function () {
                    dbClient.select(testIndexCode)
                    .then(function (rows) {
                        // Assert
                        rows.length.should.be.equal(2);
                        rows[0].AsOf = 1481130777777;
                        rows[0].Value = "7777.0000";

                        rows[1].AsOf = 1481130888888;
                        rows[1].Value = "8888.0000";

                        done();
                    });
                });
        });
    });
});