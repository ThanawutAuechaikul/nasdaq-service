'use strict';

const nasdaqRequest = require('request');
const REQUEST_TIMEOUT_MS = 5 * 1000;

var _nasdaqIndexCode = "";
var _getIndexDataCallback = null;

function requestData() {
    nasdaqRequest.post({
        url: 'http://www.nasdaq.com/aspx/IndexData.ashx',
        json: true,
        timeout: REQUEST_TIMEOUT_MS,
        form: { index: _nasdaqIndexCode }
    }, requestCallback);
}

function requestCallback(error, response, body) {
    if (!error) {
        if (_getIndexDataCallback && body.Value && body.AsOf) {
            _getIndexDataCallback(_nasdaqIndexCode, body.AsOf, body.Value);
        }
    } else {
        console.error("request nasdaq data error: " + error);
    }
}

module.exports = {
    start: function (nasdaqIndexCode, interval, getIndexDataCallback) {
        _nasdaqIndexCode = nasdaqIndexCode;
        _getIndexDataCallback = getIndexDataCallback;

        setInterval(requestData, interval);
    }
}
