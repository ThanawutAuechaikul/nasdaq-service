'use strict';

const fs = require("fs");
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

const TABLE_NAME = "timeSeriesData";
const CREATE_TABLE_SQL = "CREATE TABLE " + TABLE_NAME + " (AsOf INTEGER, Value TEXT)";

function getDataFileName(nasdaqIndexCode) {
    // TODO: file should be moved to outside of project folder
    return path.join(__dirname, 'data', nasdaqIndexCode + '.db');
}

module.exports = function (nasdaqIndexCode) {
    return {
        init: function () {
            const dataFile = getDataFileName(nasdaqIndexCode);
            var exists = fs.existsSync(dataFile);

            if (!exists) {
                console.log("Creating DB file : " + dataFile);
                fs.openSync(dataFile, "w");

                var db = new sqlite3.Database(dataFile);
                db.serialize(function () {
                    db.run(CREATE_TABLE_SQL);
                });

                db.close();
            }
        },
        insert: function (asOf, value) {
            const dataFile = getDataFileName(nasdaqIndexCode);
            var db = new sqlite3.Database(dataFile);

            db.serialize(function () {
                var stmt = db.prepare("INSERT INTO " + TABLE_NAME + " VALUES (?, ?)");
                stmt.run(asOf, value);
                stmt.finalize();
                db.each("SELECT AsOf, Value FROM " + TABLE_NAME, function (err, row) {
                    console.log(row.AsOf + ": " + row.Value);
                });
            });

            db.close();
        },
        select: function () {
            const dataFile = getDataFileName(nasdaqIndexCode);
            var db = new sqlite3.Database(dataFile);

            db.serialize(function () {
                db.each("SELECT AsOf, Value FROM " + TABLE_NAME, function (err, row) {
                    console.log(row.AsOf + ": " + row.Value);
                });
            });

            db.close();
        }
    };
};