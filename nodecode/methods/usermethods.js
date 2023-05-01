exports.addtoInventory = addtoInventory;
exports.addnewUser = addnewUser;
exports.fetchUserData = fetchUserData;
exports.checkuser = checkuser;
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../schema/product');
const User = require('../schema/user');

async function checkuser(email,password)
{
    const returnbody={message:"",returnstatus:"",returnstatement:{}};
        User.findOne({Email:email}).exec().then(user=>{
            if(user)
            {
                if(user.Password === password)
                {
                    console.log('found user');
                    returnbody.message = 'user found';
                    returnbody.returnstatus = 200;
                    returnbody.returnstatement = user._id;
                    return returnbody;
                }
                else{
                    returnbody.message = 'invalid credentials';
                    returnbody.returnstatus = 404;
                    return returnbody;
                }
            }
            else{
                returnbody.message = 'invalid credentials';
                    returnbody.returnstatus = 404;
                    return returnbody;
            }
        }).catch(err=>{
            returnbody.message = 'error fetching user';
            returnbody.returnstatus = 500;
            returnbody.returnstatement = err;
            return returnbody;
        });
}

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

async function fetchUserData(username,userpassword,userId = '')
{
    const returnbody={message:"User Found",returnstatus:"200",returnstatement:{}};
    if(userId === '')
    {
        returnbody.returnstatement = User.findOne({Name:username,Password:userpassword}).exec().then(result=>{
            if(result)
            {
                
                return result;
            }
            else
            {
                returnbody.returnstatus = 500;
                returnbody.message = 'Could not find user';
            }
        })
        
    }
    else{
        User.findById(userId).exec().then(result=>{
            if(result)
            {
                return result;
            }
            else
            {
                returnbody.returnstatus = 500;
                returnbody.message = 'Could not find user';
            }
        })
    }
    return returnbody;

}