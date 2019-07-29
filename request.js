var solrRequest=require('node-solr-request');
var express=require('express');
var bodyParser=require('body-parser');
var fs=require('fs');
var app=express();
 
//configure bodyParser
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

var port=process.env.PORT || 8080;

var settings = {
    "serverAddress":"http://localhost:8983/solr/#",
    "solrCore":"\/solr\/mycol1",
    "solrPort":"8983",
    "solrUpdatePath":"\/update\/json?commitWithin=300",
    "solrDataPath":"\/select"
  };

var objRequest=new solrRequest(settings);
var router=express.Router();

router.use(function(req,res,next){
    //do logging
    next();
});

router.route('/solrQuery')
    .post(function(req,res){
        objRequest.insertDocument(req, body, res);
    })

    .get(function(req,res){
        objRequest.getDocuments('*', req.query, res);
    })

router.route('/solrQeury/:queryString')
    .get(function(req,res){
        objRequest.getDocuments(req.params.queryString, req.query, res);
    })

app.use('/solr-api',router);
app.listen(8080);
console.log('Listenin on port' + port);