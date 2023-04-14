const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    enlister: mongoose.Schema.Types.ObjectId,
    description: String,
    tags: String,
    intrestedtags:Array,
    bids: [String]
});

module.exports = mongoose.model('Product',productSchema);