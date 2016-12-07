'use strict';

const nasdaqRequest = require('request');
const INTERVAL_SECONDS = 2 * 1000; 

var _nasdaqIndexCode = "";
var _callback = null;

function requestData() {
    nasdaqRequest.post({
        url: 'http://www.nasdaq.com/aspx/IndexData.ashx',
        json: true,
        timeout: 5 * 1000,
        form: { index: _nasdaqIndexCode }
    }, function (error, response, body) {
        if (!error) {
            if (_callback && body.Value && body.AsOf) {
                console.log(body.Value);
                console.log(body.AsOf);

                _callback(body.AsOf, body.Value);
            }
        } else {
            console.error("request nasdaq data error: " + error);
        }
    });
}

module.exports = {
    run: function (nasdaqIndexCode) {
        _nasdaqIndexCode = nasdaqIndexCode;
        setInterval(requestData, INTERVAL_SECONDS);
    }
}
