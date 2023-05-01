exports.addtoCategories = addtoCategories;
exports.removefromcategories = removefromcategories;

const mongoose = require('mongoose');
const express = require('express');
const Product = require('../schema/product');
const User = require('../schema/user');
const Category = require('../schema/category');
const userMethods = require('./usermethods');
const productMethods = require('./productmethods');
const category = require('../schema/category');


function createCategoryandUpdate(name,objectId)
{
    const id = new mongoose.Types.ObjectId();
    const tag = new Category({
        _id : id,
        name : name,
        items : [objectId]
    });
    const returnbody={message:"Category created",returnstatus:"200",returnstatement:{}};
    tag.save().then(result=>{
        console.log(result);
    }).catch(err=>{
        returnbody.message = 'Error creating category';
        returnbody.returnstatus = 500;
    });
    if(returnbody.returnstatus === '200')
    {
        returnbody.returnstatement = id;
    }

    return returnbody;
}


function addtoCategory(tag,objectId)
{
    const returnbody={message:"Category updated",returnstatus:"200",returnstatement:{}};
    Category.findOneAndUpdate({name:tag},{$addToSet:{items:objectId}},{new:true, runValidators:true, returnDocument:true}).exec().then(res=>{
        console.log(res);
    }).catch(err=>{
        returnbody.message = 'Could not Update Categories';
        returnbody.returnstatus = 500;
    })
    return returnbody;
}
function removefromCategory(tag,objectId)
{
    Category.updateOne({name:tag},{$pull:{items:objectId}}).exec().then(result=>console.log(result)).catch(err=>console.log(err));
}

function addtoCategories(objectId)
{
    const returnbody={message:"Category Updated",returnstatus:"200",returnstatement:{}};
    Product.findById(objectId).exec().then(obj=>{
        for(let i = 0; i < obj.tags.length;i++)
        {
            console.log('down is the obj');
            console.log(obj);
            Category.findOne({name:obj.tags[i]}).exec().then(category=>{
                if(category)
                {
                    addtoCategory(obj.tags[i],obj._id);
                }
                else{
                    createCategoryandUpdate(obj.tags[i],obj._id);
                }
            })
        }
    }).catch(err=>{
        returnbody.message = 'Could not Update all Categories';
        returnbody.returnstatus = 500;
    });

    return returnbody;
}

function removefromcategories(objectId)
{
    Product.findById(objectId).exec().then(obj=>{
        for(let i = 0; i < obj.tags.length;i++)
        {
            console.log('down is the obj');
            console.log(obj);
            Category.findOne({name:obj.tags[i]}).exec().then(category=>{
                if(category)
                {
                    removefromCategory(obj.tags[i],obj._id);
                }
            })
        }
    }).catch(err=>{
        console.log(err);
    })
}