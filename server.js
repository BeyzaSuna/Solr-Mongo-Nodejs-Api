var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
const url = require('url');
const querystring = require('querystring');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Configuring the database
const dbConfig = require('./app/config/mongodb.config.js');
const mongoose = require('mongoose');

  mongoose.Promise = global.Promise
  mongoose.connect(dbConfig.url, {useNewUrlParser: true})
  .then(() => {
  console.log('Successfully connected to MongoDB.')
  })
  .catch((err) => {
      console.log('Could not connect to MongoDB.');
      process.exit();
  });
  
require("./app/routes/customer.js")(app);
require("./app/routes/product.js")(app);
require("./app/routes/search.js")(app);

// Create a Server and Listen Port
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
})
