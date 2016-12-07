'use strict';

const fs = require("fs");
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

const TABLE_NAME = "timeSeriesData";
const CREATE_TABLE_SQL = "CREATE TABLE " + TABLE_NAME + " (AsOf INTEGER, Value TEXT)";

// key is index code, value is knex conn
var knexConnections = {};

function getDataFileName(nasdaqIndexCode) {
    // TODO: file should be moved to outside of project folder
    return path.join(__dirname, 'data', nasdaqIndexCode + '.db');
}

module.exports = {

    init: function (nasdaqIndexCode) {
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

    insert: function (nasdaqIndexCode, asOf, value) {
        return this.createOrGetKnexConnection(nasdaqIndexCode)
            .insert({ AsOf: asOf, Value: value })
            .into(TABLE_NAME)
            .catch(function (error) {
                console.error(error);
            });;
    },

    select: function (nasdaqIndexCode) {
        return this.createOrGetKnexConnection(nasdaqIndexCode)
            .distinct('AsOf')
            .select('AsOf', 'Value')
            .from(TABLE_NAME)
            .orderBy('AsOf', 'asc');
    },

    createOrGetKnexConnection: function (nasdaqIndexCode) {
        if (!knexConnections[nasdaqIndexCode]) {
            knexConnections[nasdaqIndexCode] = require('knex')({
                client: 'sqlite3',
                connection: {
                    filename: getDataFileName(nasdaqIndexCode)
                }
            });
        }
        return knexConnections[nasdaqIndexCode];
    }
};