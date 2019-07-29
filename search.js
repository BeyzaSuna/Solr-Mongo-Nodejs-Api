// Require module
var SolrNode = require('solr-node');
const solrConnection = require("./app/solrconnection");

var strQuery=solrConnection.query().q('product:etek OR product:tunik');

solrConnection.search(strQuery, function(err, result){
    if(err){
        console.log(err);
        return;
    }
    console.log('Response: ', result.response);
});
