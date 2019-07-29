const mongoose = require('mongoose');

const ProductShema = mongoose.Schema({
    Product_id: Number,
    Product_name: String
});

module.exports = mongoose.model('Product', ProductShema);
