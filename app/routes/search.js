// Require module
module.exports = function (app) {
    const solrConnection = require("../solrconnection.js");
    app.get("/search", (req, res, next) => {
        

        //var strQuery=solrConnection.query().q('product:etek^20.1 OR product:tunik');
        var querystring = unescape(req.originalUrl.split("?")[1]);
        // console.log(querystring); // without 200% due to unescape function.
        // console.log(req.originalUrl.split("?")[1]); // with 20%
        var strQuery = solrConnection.query().q(querystring);
        solrConnection.search(strQuery, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            //console.log('Response: ', result.response);
            res.json(result.response);
        });
     });
}