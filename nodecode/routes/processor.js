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
        User.findById(req.body.target).exec().then(m=>{
            const prod = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: data.name,
                price: data.price,
                enlister: req.body.target,
                description: data.description,
                tags: data.tags,
                intrestedtags:data.intrestedtags,
                status:data.status
            });

            const err={addingproduct:"done",updatinginventory:"done"};
            const returnstatus = 200;
            prod.save().then(result=>{
                User.findByIdAndUpdate(req.body.target,{$addToSet:{Inventory:prod._id}},{new:true, runValidators:true, returnDocument:true}).exec().then(doc=>{
                    console.log(doc);
                }).catch(err1=>{
                    err.updatinginventory=err1;
                    returnstatus=500;
                })
            }).catch(err2=>{
                err.addingproduct=err2;
                returnstatus=500;
            })
            res.status(returnstatus).json(err);
            return;
        }).catch(err=>{
            console.log(err);
            res.status(200).json({message:'no such user is present'});
        })
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