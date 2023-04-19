const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const User = require('../schema/user');
const mongoose = require('mongoose');
const productMethods = require('../methods/productmethods');
const userMethods = require('../methods/usermethods');
const categoryMethods = require('../methods/categorymethods');

router.get('/',(req,res,next)=>{
    const action = req.body.action;

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/',(req,res,next)=>{
    const action = req.body.action;
    if(action === 'addproduct')
    {
        const doc = productMethods.addProduct(req.body.target,req.body.data)
        res.status(parseInt(doc.returnstatus,10)).json({message:doc.message,data:doc.returnstatement});
    }
    
    else if(action === 'adduser')
    {
        const doc = userMethods.addnewUser(req.body.data)
        res.status(parseInt(doc.returnstatus,10)).json({message:doc.message,data:doc.returnstatement});
   
    }
    else
    {
        console.log(action+' is not a correct post action');
        res.status(500).json({message:action+' is not a correct post action'});
    }
    
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.patch('/',(req,res,next)=>{
    const action = req.body.action;
    
    if(action === 'addproduct')
    {
        User.findByIdAndUpdate(req.body.target,{$addToSet:{Inventory:req.body.data}},{new:true, runValidators:false, returnDocument:true}).exec().then(result=>{
            console.log('done');
            res.status(500).json({message:'added product', productdetails:result});
        }).catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        });
    }


})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/',(req,res,next)=>{
    const action = req.body.action;
    
})

module.exports = router;