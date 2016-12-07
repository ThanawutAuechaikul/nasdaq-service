const express = require('express');
const dbClient = require('./dbClient');

//var knexConnections = {};

module.exports = {
    start: function (port) {
        var app = express();

        app.get('/nasdaq/api/v1/:nasdaqIndexCode', function (req, res) {
            var nasdaqIndexCode = req.params.nasdaqIndexCode;

            //if (!knexConnections[nasdaqIndexCode]) {
          //      knexConnections[nasdaqIndexCode] = dbClient.createKnexInstance(nasdaqIndexCode);
          //  }

            dbClient
                .select(nasdaqIndexCode)
                .then(function (rows) {
                    var result = [];
                    if (rows) {
                        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                            var row = rows[rowIndex];
                            result.push({ x: row.AsOf, y: row.Value });
                        }
                    }

                    res.status(200).json(result);
                })
                .catch(function (error) {
                    res.status(500).json(error);
                });
        });

        app.listen(port);
    }
}
