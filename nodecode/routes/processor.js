const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const User = require('../schema/user');
const mongoose = require('mongoose');


router.get('/',(req,res,next)=>{
    const action = req.body.action;

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/',(req,res,next)=>{
    const action = req.body.action;
    if(action === 'addproduct')
    {
        const data = req.body.data;
        const prod = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: data.name,
            price: data.price,
            enlister: data.enlister,
            description: data.description,
            tags: data.tags,
            intrestedtags:data.intrestedtags,
            status:data.status
        });
        prod.save().then(result=>{console.log(result);res.status(200).json({message:'product added',output:result});}).catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        });
    }
    else if(action === 'adduser')
    {
        const data = req.body.data;
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            Name: data.name,
            Password: data.password,
            Email: data.email,
            Address:data.address,
            Inventory:data.inventory,
            History:data.history,
            Auction:data.auction,
            Mybids:data.mybids
        
        });
        user.save().then(result=>{console.log(result);res.status(200).json({message:'user added',output:result});}).catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        });
    }
    else{
        console.log(action+' is not a correct post action');
        res.status(500).json({message:action+' is not a correct post action'});
    }
    
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.patch('/',(req,res,next)=>{
    const action = req.body.action;
    
    

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/',(req,res,next)=>{
    const action = req.body.action;
    
})

module.exports = router;