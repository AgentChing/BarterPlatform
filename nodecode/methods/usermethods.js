exports.addtoInventory = addtoInventory;
exports.addnewUser = addnewUser;
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../schema/product');
const User = require('../schema/user');

function addnewUser(userdata)
{
    const returnbody={message:"User added",returnstatus:"200",returnstatement:{}};
    const idval = new mongoose.Types.ObjectId();
    const user = new User({
        _id: idval,
        Name: userdata.name,
        Password: userdata.password,
        Email: userdata.email,
        Address:userdata.address,
        Inventory:userdata.inventory,
        History:userdata.history,
        Auction:userdata.auction,
        Mybids:userdata.mybids
    });
    user.save().then(result=>{console.log(result);}).catch(err=>{
        returnbody.message = 'Creating User Failed';
        returnbody.returnstatus = 500;
    });
    if(returnbody.returnstatus === '200')
    {
        returnbody.returnstatement = idval;
    }
    return returnbody;
}

function addtoInventory(inventoryOwnerId,productId)
{
    const returnbody={message:"Inventory Updated",returnstatus:"200",returnstatement:{}};
    User.findByIdAndUpdate(inventoryOwnerId,{$addToSet:{Inventory:productId}},{new:true, runValidators:true, returnDocument:true}).exec().then(doc=>{
        console.log(doc);
    }).catch(err1=>{
        returnbody.message=err1;
        returnbody.returnstatus=500;
    })

    return returnbody;
}