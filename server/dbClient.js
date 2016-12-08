'use strict';

const fs = require("fs");
const path = require('path');
const sqlite3 = require("sqlite3").verbose();

const TABLE_NAME = "indexValue";
const COLUMN_AS_OF = "AsOf";
const COLUMN_VALUE = "Value";

// key is index code, value is knex connection
var knexConnections = {};

module.exports = {
    getColumnNames: function() {
        return {
            COLUMN_AS_OF: COLUMN_AS_OF,
            COLUMN_VALUE: COLUMN_VALUE
        };
    },

    init: function(nasdaqIndexCode) {
        const dataFile = getDataFileName(nasdaqIndexCode);
        var exists = fs.existsSync(dataFile);

        if (!exists) {
            console.log("Creating DB file : " + dataFile);
            fs.openSync(dataFile, "w");
        }

        return this.createOrGetKnexConnection(nasdaqIndexCode)
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

        return this.createOrGetKnexConnection(nasdaqIndexCode)
            .insert(insertObject)
            .into(TABLE_NAME)
            .catch(function(error) {
                console.error(error);
            });
    },

    select: function(nasdaqIndexCode) {
        return this.createOrGetKnexConnection(nasdaqIndexCode)
            .distinct(COLUMN_AS_OF)
            .select(COLUMN_AS_OF, COLUMN_VALUE)
            .from(TABLE_NAME)
            .orderBy(COLUMN_AS_OF, 'asc');
    },

    dropTable: function(nasdaqIndexCode) {
        return this.createOrGetKnexConnection(nasdaqIndexCode)
            .schema
            .dropTableIfExists(TABLE_NAME);
    },

    createOrGetKnexConnection: function(nasdaqIndexCode) {
        if (!knexConnections[nasdaqIndexCode]) {
            knexConnections[nasdaqIndexCode] = require('knex')({
                client: 'sqlite3',
                connection: {
                    filename: getDataFileName(nasdaqIndexCode)
                },
                useNullAsDefault: true
            });
        }
        return knexConnections[nasdaqIndexCode];
    }
};

function getDataFileName(nasdaqIndexCode) {
    // TODO: file should be moved to outside of project folder
    return path.join(__dirname, 'data', nasdaqIndexCode + '.db');
}