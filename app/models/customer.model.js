const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
   Customer_id: Number,
   Customer_name : String,
   Customer_surname : String,
   Customer_phone : Number,
   Customer_gender: Boolean //1-W , 2-M
});

module.exports = mongoose.model('Customer', CustomerSchema);
