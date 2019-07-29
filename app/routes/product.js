module.exports = function (app) {
    const ProductSchema = require('../models/product.model.js');
    const solrConnection = require("../solrconnection.js");
    app.get("/product", (req, res, next) => {
        ProductSchema.find({}, (err, data) => {
            if (err)
                throw (err);
            //console.log(data[0]);

            //For all data update
        //     for (let i=0; i < data.length; i++) {
        //         solrConnection.update(data[i], function (err, result) {
        //             if (err) {
        //                 console.log(err);
        //                 return;
        //             }
        //             console.log('Response: ', result.responseHeader);
        //         });
        //     };
        // }); 
            
            solrConnection.update(data[3], function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Response: ', result.responseHeader);
            });
            res.send(data[3]);
        });
    });
    //you can use POSTMAN for posting 
    app.post("/product", (req, res, next) => {
        const productSchema = new ProductSchema(req.body);
        const promise = productSchema.save();
        promise.then(data => {
            console.log(data);
            res.send(data);
        }).catch((err) => {
            console.log(err);
        })
    });
};
    
