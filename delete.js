const solrConnection = require("./app/solrconnection.js");

var objQuery={id:'c526b9d4-d1db-4db7-b5a2-948a20240af6'};
solrConnection.delete(objQuery, function(err, result){
    if(err){
        console.log(err);
        return;
    }
    console.log('Response:', result.responseHeader);
});
