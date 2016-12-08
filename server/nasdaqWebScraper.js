'use strict';

const nasdaqRequest = require('request');
const REQUEST_TIMEOUT_MS = 5 * 1000;

module.exports = function(nasdaqIndexCode) {
    var getIndexDataCallback = null;

    function requestData() {
        nasdaqRequest.post({
            url: 'http://www.nasdaq.com/aspx/IndexData.ashx',
            json: true,
            timeout: REQUEST_TIMEOUT_MS,
            form: { index: nasdaqIndexCode }
        }, requestCallback);
    }

    function requestCallback(error, response, body) {
        if (!error) {
            if (getIndexDataCallback && body.Value && body.AsOf) {
                getIndexDataCallback(nasdaqIndexCode, body.AsOf, body.Value);
            }
        } else {
            console.error("scrapping nasdaq data error: " + error);
        }
    }

    return {
        start: function(interval, callback) {
            getIndexDataCallback = callback;
            setInterval(requestData, interval);
        }
    };
};