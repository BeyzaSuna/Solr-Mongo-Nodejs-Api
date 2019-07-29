module.exports = function (app) {
    const CustomerSchema = require('../models/customer.model.js');
    const solrConnection = require("../solrconnection.js");
    app.get("/customer", (req, res, next) => {
        CustomerSchema.find({}, (err, data) => {
            if (err)
                throw (err);
            console.log(data[0]);
            solrConnection.update(data[0], function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Response: ', result.responseHeader);
            });
            res.send(data[0]);
        });
    });

    app.post('/customer', (req, res, next) => {
        const customerSchema = new CustomerSchema(req.body);
        const promise = customerSchema.save();
        promise.then((data) => {
            console.log(data);
            res.send(data);
        }).catch((err) => {
            console.log(err);
        });

    });
}