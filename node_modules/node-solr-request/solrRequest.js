var solrConnect = require('./solrConnect.js')
var fs = require('fs');
var path = require('path');

// Function to check for empty objects
var isEmpty = function(object) {
	if (object == null) return true;

	if (object.length && object.length > 0) return false;
	if (object.length == 0) return true;

	for (var key in object){
		if (hasOwnProperty.call(object, key)) return false;
	}

	return true;
};


var objDocument = function(settings){
	this.settings = settings;
};

objDocument.prototype = {
	constructor: objDocument,

	updateDocument:function (docID, objData, responseHandler) {
		var objSolrFields = {};
		var objSolrDoc = {};

		for (fieldName in objData){
			fieldValue = objData[fieldName];
			objSolrFields[fieldName] = {set: fieldValue};
		}

		objSolrDoc['add'] = {};
		objSolrDoc['add']['doc'] = objSolrFields;
		objSolrDoc['add']['doc']['id'] = docID;
		strSolrDoc = JSON.stringify(objSolrDoc);

		var objResult = new solrConnect(this.settings, responseHandler);
		var result = objResult.updateCreate(strSolrDoc);
	},

	insertDocument:function (objData, responseHandler) {
		var objSolrFields = {};
		var objSolrDoc = {};
		objData['id'] = objData.LISTINGID_t;

		objSolrDoc['add'] = {doc:objData};
		strSolrDoc = JSON.stringify(objSolrDoc);

		var objResult = new solrConnect(this.settings, responseHandler);
		var result = objResult.updateCreate(strSolrDoc);
	},

	deleteDocumentById:function (docID, responseHandler) {
		var objSolrFields = objSolrDoc = {};
		var objResult = new solrConnect(this.settings, responseHandler);
		var result = objResult.deletById(docID);
	},

	buildQuery:function (strQuery, queryParams) {
		filterArray = (typeof queryParams.filters == 'undefined' || isEmpty(queryParams.filters)) ? []: JSON.parse(queryParams.filters);
		paramsArray = (typeof queryParams.params == 'undefined' || isEmpty(queryParams.params)) ? []: JSON.parse(queryParams.params);
		var arrFilters = [];
		var arrParams = [];
		var strQueryString = (typeof strQuery != 'undefined' && strQuery != '') ? '?q=' + strQuery : '?q=*';

		for(filterName in filterArray){
			arrFilters.push("fq=" + filterName + ":" + filterArray[filterName]);
		}

		for(paramName in paramsArray){
			arrParams.push(paramName + "=" + paramsArray[paramName])
		}

		if(isEmpty(arrFilters)) {
			strFilters = '';
		} else {
			strFilters = arrFilters.join('&');
		}

		if(isEmpty(arrParams)) {
			strParams = '';
		} else {
			strParams = arrParams.join('&');
		}

		strQuery = (strFilters == '') ? strQueryString : strQueryString.concat('&', strFilters) ;
		strQuery = strQuery.concat('&wt=json');
		strQuery = (strParams == '') ? strQuery : strQuery.concat('&', strParams) ;
		return strQuery;
	},

	getDocuments:function (strQuery, queryParams, responseHandler) {
		strQuery = this.buildQuery(strQuery, queryParams);
		var objResult = new solrConnect(this.settings, responseHandler);
		var result = objResult.getData(strQuery);
	},

	getDataWtihFacets:function (strQuery, queryParams, responseHandler) {
		strQuery = this.buildQuery(strQuery, queryParams);
		var objResult = new solrConnect(this.settings, responseHandler);
		var result = objResult.getDataFacets(strQuery);
	},

	getFacets:function (strQuery, queryParams, responseHandler) {
		strQuery = this.buildQuery(strQuery, queryParams);
		var objResult = new solrConnect(this.settings, responseHandler);
		var result = objResult.getFacets(strQuery);
	}
}


module.exports = objDocument;