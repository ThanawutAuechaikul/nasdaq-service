# Nasdaq Service
1. Scrapping index value data from http://www.nasdaq.com/
2. Store data to DB
3. Provide time-series data via REST API

## Installation
Install the dependencies and devDependencies
```
$ npm install
```
Install the dependencies only
```
$ npm install --production
```

## Start Service
```
$ npm start
```
**Default port is 8080**
## Run Test
```
$ npm test
```

### REST Endpoint
`GET /api/v1/:nasdaqIndexCode`

get time-series data of `:nasdaqIndexCode` eg. /api/v1/ixic
