var http = require('http');

var solrConnect = function(settings, responseHandler){
    this.settings = settings;
    this.responseHandler = responseHandler;
};

solrConnect.prototype = {
    constructor:solrConnect,

    // Function to initialize solrConnect Connection Object
    createConnection:function (method, settings, contentLength){
        objConnection = {};
        if (method == "GET") {
            var path = settings.solrCore.concat(settings.solrDataPath);
        } else {
            var path = settings.solrCore.concat(settings.solrUpdatePath);
            objConnection.headers = {
                'Content-Type': 'application/json',
                'Content-Length': contentLength
            };
        }
        objConnection.host = settings.serverAddress;
        objConnection.port = settings.solrPort;
        objConnection.path = path;
        objConnection.method = method;
        return objConnection;
    },

    // Function to make request to Solr
    postRequest:function(connectionParams, docString, parseResponse){
        responseHandler = this.responseHandler;
        callBack = this.returnResponse;
        var sendRequest = http.request(connectionParams, function(response){
            response.setEncoding('utf-8');
            var responseString = '';


            response.on('data', function(data){
                responseString += data;
            });

            response.on('end', function(){
                callBack(responseString, responseHandler, parseResponse);
            });

            response.on('error', function(err){
                callBack(err, responseHandler, parseResponse);
            })
        });
        sendRequest.write(docString);
        sendRequest.end();
    },

    // Function to build request to update or create new document in solr
    updateCreate:function (docString){
        connectionParams = new this.createConnection('POST', this.settings, docString.length);
        this.postRequest(connectionParams, docString, 'full_response');
    },

    // Function to delete document in solr by unique document ID
    deletById:function (docID){
        docString = JSON.stringify({"delete": {"id":docID}});
        connectionParams = new this.createConnection('POST', this.settings, docString.length);
        this.postRequest(connectionParams, docString, 'full_response');
    },

    // Function to delete document in solr by using a query string
    deleteByQuery:function (queryString){
        docString = JSON.stringify('{"query": {' + queryString +'}}');
        connectionParams = new this.createConnection('POST', this.settings, docString.length);
        this.postRequest(connectionParams, docString, 'full_response');
    },

    // Function to get data from solr
    getData:function (queryString){
        connectionParams = new this.createConnection('GET', this.settings, null);
        connectionParams.path = connectionParams.path.concat(queryString);
        this.postRequest(connectionParams, '', 'data_only');
    },

    // Function to get facets from solr
    getFacets:function (queryString){
        connectionParams = new this.createConnection('GET', this.settings, null);
        connectionParams.path = connectionParams.path.concat(queryString);
        this.postRequest(connectionParams, '', 'facets_only');
    },

    // Function to get facets from solr
    getDataFacets:function (queryString){
        connectionParams = new this.createConnection('GET', this.settings, null);
        connectionParams.path = connectionParams.path.concat(queryString);
        this.postRequest(connectionParams, '', 'data_facets');
    },


    // Function to return data from solr back to requesting function
    returnResponse:function (objResponse, responseHandler, parseResponse){
        objResponse = JSON.parse(objResponse);
        responseHandler.setHeader('Content-Type', 'application/json');
        switch (parseResponse) {

            case 'data_only':
                responseHandler.send(objResponse.response);
            break;

            case 'full_response':
                responseHandler.send(objResponse);
            break;

            case 'facets_only':
                responseHandler.send(objResponse.facet_counts.facet_fields);
            break;

            case 'data_facets':
                tmpResponse = {data:{},facet_counts:{}};
                tmpResponse.data = objResponse.response;
                tmpResponse.facet_counts = objResponse.facet_counts.facet_fields;
                responseHandler.send(tmpResponse);
            break;

            default:
                responseHandler.send(objResponse);
            break;
        }
    },


}

module.exports = solrConnect;