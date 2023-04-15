const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: String,
    Password: String,
    Email: String,
    Address:{type:String,default:''},
    Inventory:[String],
    History:[{auctionitemId:String,bidId:String}],
    Auction:[{auctionitemId:String,bidIds:[String]}],
    Mybids:[{auctionitemId:String,bidId:String,Status:{type:String,default:'ignored'}}]

});

module.exports = mongoose.model('User',userSchema);