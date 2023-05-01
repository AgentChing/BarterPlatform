exports.addProduct = addProduct;
exports.getproductdetails = getproductdetails;
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../schema/product');
const User = require('../schema/user');
const userMethods = require('./usermethods');
const categoryMethods = require('../methods/categorymethods');

function addProduct (targetId,productBody)
{
    const idval = new mongoose.Types.ObjectId();
    const returnbody={message:"Product added Successfully",returnstatus:"200",returnstatement:{}};
    User.findById(targetId).exec().then(m=>{
        const prod = new Product({
            _id: idval,
            name: productBody.name,
            price: productBody.price,
            enlister: targetId,
            description: productBody.description,
            tags: productBody.tags,
            intrestedtags:productBody.intrestedtags,
            status:productBody.status
        });
        prod.save().then(result=>{
           const ret =  userMethods.addtoInventory(prod.enlister,prod._id);
           if(ret.returnstatus === "500")
           {
            returnbody.message='Cannot add product to inventory.';
            returnbody.returnstatus=500;
            Product.findByIdAndRemove(idval).exec().then(res=>{
                returnbody.message=returnbody.message+' Product Delisted';
            }).catch(err=>{
                returnbody.message=returnbody.message+' But cannot be delisted, contace admins.';
            })
           }
           else{
                returnbody.message=returnbody.message+' and Updated Inventory.';
                const doc = categoryMethods.addtoCategories(idval);
                if(doc.returnstatus === '200')
                {
                    returnbody.message=returnbody.message+' And Updated categories as well';
                }
                else{
                    returnbody.message = 'failed in process of updating categories';
                    returnbody.returnstatus=500;
                }
           } 
           return result;
        }).catch(err1=>{
            returnbody.message=err1;
            returnbody.returnstatus=500;
        })
    }).catch(err=>{
        console.log(err);
        returnbody.message=err;
        returnbody.returnstatus=500;
    })
    if(returnbody.returnstatus === '200')
    {
        returnbody.returnstatement = idval;
    }
return returnbody;

}

async function getproductdetails(objId)
{
    let res = await Product.findById(objId);
    return res;
}

