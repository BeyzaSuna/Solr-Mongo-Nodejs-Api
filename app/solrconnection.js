// For Solr Connection
var SolrNode = require('solr-node');

// Create client
var client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'mycol1',
    protocol: 'http'
});
// Set logger level (can be set to DEBUG, INFO, WARN, ERROR, FATAL or OFF)
require('log4js').getLogger('solr-node').level = 'DEBUG';
module.exports=client;
