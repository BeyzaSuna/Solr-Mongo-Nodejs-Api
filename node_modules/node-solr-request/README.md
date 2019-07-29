# node-solr-request
A lightweight node.js Solr client

### Usage example

The following sample uses Express

```
var solrRequest = require('node-solr-request');
var express     = require('express');
var bodyParser  = require('body-parser');
var fs          = require('fs');
var app         = express();

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var settings = '{
                  "serverAddress":"[SOLR SERVER URL OR IP]",
                  "solrCore":"\/solr\/[SOLR CORE NAME]",
                  "solrPort":"[YOUR SOLR PORT NUMBER]",
                  "solrUpdatePath":"\/update\/json?commitWithin=300",
                  "solrDataPath":"\/select"
                }';

var objRequest = new solrRequest(settings);

var router = express.Router();

router.use(function(req, res, next) {
	// do logging
	next();
});

router.route('/solrQuery')
	.post(function(req, res) {
		objRequest.insertDocument(req.body, res);
	})

	.get(function(req, res) {
		objRequest.getDocuments('*', req.query, res)
	});

router.route('/solrQuery/:queryString')
	.get(function(req, res){
		objRequest.getDocuments(req.params.queryString, req.query, res);
	});

app.use('/solr-api', router);

app.listen(port);
console.log('Listening on port ' + port);
```

#### example URLS
|URL|RESULT|
|---------------------------------|------------------------------------------------------|
|[SERVER NAME]/solr-api/solrQuery | will return all documents based on your solr defaults|
|[SERVER NAME]/solr-api/solrQuery?filters={"field-name":"filter_value","field-name2":"filter_value"} | will return all documents based on your solr defaults and filters specified|
|[SERVER NAME]/solr-api/solrQuery?params={"rows":5,"start":10} | will return 5 documents starting with the 10th document|
|[SERVER NAME]/solr-api/solrQuery?filters={"field-name":"filter_value","field-name2":"filter_value"}&params={"rows":5} | will return maximum 5 documents based on your filters specified|
|[SERVER NAME]/solr-api/solrQuery/widget | will search for the string "widgets" and return all found documents based on your solr defaults|
|[SERVER NAME]/solr-api/solrQuery/widget?filters={"field-name":"filter_value","field-name2":"filter_value"}&params={"rows":5} | will search for the string "widgets" and return maximum 5 found documents based on your filters specified|

