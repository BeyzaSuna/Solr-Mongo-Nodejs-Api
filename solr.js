const solrConnection = require("./app/solrconnection.js");
require('log4js').getLogger('solr-node').level = 'DEBUG';
const mongoose=require("mongoose");
const dbConfig = require('./app/config/mongodb.config.js');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

mongoose.Promise = global.Promise
  mongoose.connect(dbConfig.url, {useNewUrlParser: true})
  .then(() => {
  console.log('Successfully connected to MongoDB.')
  })
  .catch((err) => {
      console.log('Could not connect to MongoDB.');
      process.exit();
  });

