'use strict';

const nasdaqRequest = require('request');
const REQUEST_TIMEOUT_MS = 3 * 1000;

var _nasdaqIndexCode = "";
var _getIndexDataCallback = null;

module.exports = {
    start: function (nasdaqIndexCode, interval, getIndexDataCallback) {
        _nasdaqIndexCode = nasdaqIndexCode;
        _getIndexDataCallback = getIndexDataCallback;

        setInterval(requestData, interval);
    }
};

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
        console.error("scrapping nasdaq data error: " + error);
    }
}