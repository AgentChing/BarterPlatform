const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    enlister: mongoose.Schema.Types.ObjectId,
    description: {type:String, default:''},
    tags: [String],
    intrestedtags:[String],
    status:{type:String,default:'free'}
});

module.exports = mongoose.model('Product',productSchema);