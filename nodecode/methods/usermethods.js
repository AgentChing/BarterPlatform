exports.addtoInventory = addtoInventory;

const mongoose = require('mongoose');
const express = require('express');
const Product = require('../schema/product');
const User = require('../schema/user');

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