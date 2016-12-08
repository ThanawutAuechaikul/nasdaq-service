'use strict';

const fs = require("fs");
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

const TABLE_NAME = "indexValue";
const COLUMN_AS_OF = "AsOf";
const COLUMN_VALUE = "Value";

// Connection cache
// key is index code, value is knex connection
var knexConnections = {};

function createOrGetKnexConnection(nasdaqIndexCode) {
    if (!knexConnections[nasdaqIndexCode]) {
        knexConnections[nasdaqIndexCode] = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: getDataFilePath(nasdaqIndexCode)
            },
            useNullAsDefault: true
        });
    }
    return knexConnections[nasdaqIndexCode];
}

function getDataFilePath(nasdaqIndexCode) {
    // TODO: file should be moved to outside of project folder
    // So data will not be deleted when new package is deployed
    return path.join(path.resolve('data'), nasdaqIndexCode + '.db');
}

module.exports = {
    getColumnNames: function() {
        return {
            COLUMN_AS_OF: COLUMN_AS_OF,
            COLUMN_VALUE: COLUMN_VALUE
        };
    },

    init: function(nasdaqIndexCode) {
        const dataFile = getDataFilePath(nasdaqIndexCode);
        var exists = fs.existsSync(dataFile);

        if (!exists) {
            console.log("Creating DB file : " + dataFile);
            fs.openSync(dataFile, "w");
        }

        return createOrGetKnexConnection(nasdaqIndexCode)
            .schema
            .createTableIfNotExists(TABLE_NAME, function(table) {
                table.integer(COLUMN_AS_OF);
                table.string(COLUMN_VALUE);
            }).catch(function(e) {
                console.error(e);
            });
    },

    insert: function(nasdaqIndexCode, asOf, value) {
        // TODO: Avoid insert duplicate asOf
        var insertObject = {};
        insertObject[COLUMN_AS_OF] = asOf;
        insertObject[COLUMN_VALUE] = value;

        return createOrGetKnexConnection(nasdaqIndexCode)
            .insert(insertObject)
            .into(TABLE_NAME)
            .catch(function(error) {
                console.error(error);
            });
    },

    select: function(nasdaqIndexCode) {
        return createOrGetKnexConnection(nasdaqIndexCode)
            .distinct(COLUMN_AS_OF)
            .select(COLUMN_AS_OF, COLUMN_VALUE)
            .from(TABLE_NAME)
            .orderBy(COLUMN_AS_OF, 'asc');
    },

    dropTable: function(nasdaqIndexCode) {
        return createOrGetKnexConnection(nasdaqIndexCode)
            .schema
            .dropTableIfExists(TABLE_NAME);
    },

    release: function(nasdaqIndexCode) {
        createOrGetKnexConnection(nasdaqIndexCode).destroy;
    },

    getDataFilePath: getDataFilePath
};