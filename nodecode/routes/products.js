const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const User = require('../schema/user');
const mongoose = require('mongoose');

router.get('/',(req,res,next)=>{
    Product.find().exec().then(doc=>{
        console.log(doc);
        res.status(200).json(doc);
    }).catch(err=>console.log({error:err}));
});
router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id).exec().then(doc=>{
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({
                message:'Object not found'
            });
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
    
});



router.post('/',(req,res,next)=>{
    
    const action = req.body.action;
    if(action === 'addProduct')
    {
        const prod = new Product({
            _id: new mongoose.Types.ObjectId(),
            name:req.body.name,
            price: req.body.price,
            enlister: req.body.enlisterid,
            description: req.body.description,
            tags: req.body.tags,
            intrestedtags: req.body.intrestedtags,
            bids: req.body.bids,
            status: req.body.status
        }); 
        prod.save().then(result=>{console.log(result); res.status(200).json({message: 'product added sucessfully'});}).catch(err=>console.log(err));
    }
    else if(action === 'addUser')
    {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            Name: req.body.name,
            Password: req.body.password,
            Email: req.body.email,
            Address:req.body.address,
            Inventory:[],
            History:[],
            Auction:[],
            Mybids:[]
        });
        user.save().then(result=>{console.log(result); res.status(200).json({message: 'User added sucessfully'});}).catch(err=>console.log(err));
    
    }
    
});


router.post('/user',(req,res,next)=>{
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.name,
        Password: req.body.password,
        Email: req.body.email,
        Address:req.body.address,
        Inventory:req.body.inventory,
        History:req.body.history,
        Auction:req.body.auction,
        Mybids:req.body.mybids

    });
    user.save().then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
});



router.patch('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    res.status(200).json({
        message:'updating product values for given id',
        id: id
    });
});



router.delete('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findByIdAndRemove(id).exec().then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});






module.exports = router;