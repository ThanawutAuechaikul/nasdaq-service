'use strict';

const express = require('express');
const dbClient = require('./dbClient');
const _ = require('lodash');

module.exports = {
    start: function (port) {
        var app = express();
        app.get('/nasdaq/api/v1/:nasdaqIndexCode', getTimeSeriesDataHandler);
        app.listen(port);
    }
};

function getTimeSeriesDataHandler(req, res) {
    retrieveData(req.params.nasdaqIndexCode)
        .then(function (rows) {
            res.status(200).json(dbRowsToTimeSeries(rows));
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
}

function dbRowsToTimeSeries(rows) {
    var timeSeries = [];
    if (!_.isEmpty(rows)) {
        const columnNames = dbClient.getColumnNames();
        timeSeries = _.map(rows, function (row) {
            return { x: row[columnNames.COLUMN_AS_OF], y: row[columnNames.COLUMN_VALUE] };
        });
    }
    return timeSeries;
}

function retrieveData(nasdaqIndexCode) {
    return dbClient.select(nasdaqIndexCode);
}
