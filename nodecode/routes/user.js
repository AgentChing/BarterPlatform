const express = require('express');
const router = express.Router();
const Product = require('../schema/product');
const User = require('../schema/user');
const mongoose = require('mongoose');
const userMethods = require('../methods/usermethods');


router.get('/',(req,res,next)=>{
    res.status(200).json({message:'i am here'});
});

router.post('/',async (req,res,next)=>{
    const action = req.body.action;
    if(action === 'signup')
    {
        const userdata = req.body.data;
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            Name: userdata.name,
            Password: userdata.password,
            Email: userdata.email,
            Address:userdata.address,
            Inventory:userdata.inventory,
            History:userdata.history,
            Auction:userdata.auction,
            Mybids:userdata.mybids
        })

        user.save().then(result=>{
            delete result.password;
            res.status(200).json({message:'user added',return:user._id,result:result});
        }).catch(err=>{
            res.status(500).json({message:'user could not be added',return:'',result:err});
        })
    }
    else if(action ==='signin')
    {
        
        const userdata = req.body.data;
        User.findOne({Email:userdata.email}).exec().then(user=>{
            if(user)
            {
                if(user.Password === userdata.password)
                {
                    res.status(200).json({message:'User Signin sucessfull',return:user._id,result:''});
                }
                else{
                    res.status(404).json({message:'invalid credentials',return:'',result:''});
                }
            }
            else{
                res.status(404).json({message:'invalid credentials',return:'',result:''});
            }
        }).catch(err=>{
            res.status(500).json({message:'error fetching user',return:'',result:err});
        });
    }
    else {
        res.status(500).json({message:'no such action present',return:'',result:err});
    }
});

router.delete('/',(req,res,next)=>{
    const action = req.body.action;
    const userid = req.body.userid;
    if(action === 'deleteuser')
    {
        User.findByIdAndDelete(userid).exec().then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            res.status(500).json({error:err});
        })
    }
    else{

    }
});


module.exports = router;