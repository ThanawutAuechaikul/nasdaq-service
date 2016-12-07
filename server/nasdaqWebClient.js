'use strict';

const nasdaqRequest = require('request');
const INTERVAL_SECONDS = 2 * 1000;
const REQUEST_TIMEOUT_SECONDS = 5 * 1000;

var _nasdaqIndexCode = "";
var _getIndexDataCallback = null;

function requestData() {
    nasdaqRequest.post({
        url: 'http://www.nasdaq.com/aspx/IndexData.ashx',
        json: true,
        timeout: REQUEST_TIMEOUT_SECONDS,
        form: { index: _nasdaqIndexCode }
    }, requestCallback);
}

function requestCallback(error, response, body) {
    if (!error) {
        if (_getIndexDataCallback && body.Value && body.AsOf) {
            _getIndexDataCallback(body.AsOf, body.Value);
        }
    } else {
        console.error("request nasdaq data error: " + error);
    }
}

module.exports = {
    start: function (nasdaqIndexCode, getIndexDataCallback) {
        _nasdaqIndexCode = nasdaqIndexCode;
        _getIndexDataCallback = getIndexDataCallback;

        setInterval(requestData, INTERVAL_SECONDS);
    }
}
