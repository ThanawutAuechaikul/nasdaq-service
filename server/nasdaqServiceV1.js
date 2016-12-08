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
        timeSeries = _.map(rows, function (row) {
            return { x: row.AsOf, y: row.Value };
        });
    }
    return timeSeries;
}

function retrieveData(nasdaqIndexCode) {
    return dbClient.select(nasdaqIndexCode);
}
