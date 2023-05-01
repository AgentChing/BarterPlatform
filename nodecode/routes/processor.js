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
    const userid = req.body.userid;
    if(action === 'getlist')
    {
       Product.find({enlister:{$ne:userid}}).exec().then(result=>{
        res.status(200).json(result);
       }).catch(err=>{
        res.status(500).json({error:'could not fetch'});
       });
    }
    else if (action === 'getmylist')
    {
        User.findById(userid).exec().then(async function(result){
            let arr1 = new Array();
            let arr2 = new Array();
            let arr3 = new Array();
            for(let i=0;i<result.Inventory.length;i++)
            {
                let temp = await productMethods.getproductdetails(result.Inventory[i]);
                arr1.push(temp);
            }
            /*
            Auction:[{auctionitemId:String,bidIds:[String]}],
 */
            for(let i=0;i<result.Auction.length;i++)
            {
                let aucnid = await productMethods.getproductdetails(result.Auction[i].auctionitemId);
                let temparray = new Array();
                for(let j =0;j<result.Auction[i].bidIds.length;j++)
                {
                    let temp = await productMethods.getproductdetails(result.Auction[i].bidIds[j]);
                    temparray.push(temp);
                }
                arr2.push({auctionitemId:aucnid,bidIds:temparray});
            }
            /*Mybids:[{auctionitemId:String,bidId:String,Status:{type:String,default:'ignored'}}]*/
            for(let i=0;i<result.Mybids.length;i++)
            {
                let aucnid = await productMethods.getproductdetails(result.Mybids[i].auctionitemId);
                let bidid = await productMethods.getproductdetails(result.Mybids[i].bidId);
                arr3.push({auctionitemId:aucnid,bidId:bidid,Status:result.Mybids[i].Status});
            }

            const returnbody = {
                Inventory: arr1,
                Auction: arr2,
                Mybids: arr3
            }
            res.status(200).json(returnbody);
            console.log(returnbody);
        }).catch(err=>{
            console.log(err);
            res.status(500).json({error:'user not found'});
        });
    }
    else if(action === 'getProduct')
    {
       
    }
    else{  

    }

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/',(req,res,next)=>{
    const action = req.body.action;
    if(action === 'addproduct')
    {
        const doc = productMethods.addProduct(req.body.target,req.body.data)
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
    
    if(action==='deleteproduct')
    {
        const user = req.body.userid;
        const prod = req.body.target;

        Product.findById(prod).exec().then(result=>{
            if(String(result.enlister)===String(user))
            {
                categoryMethods.removefromcategories(prod);
                Product.findByIdAndDelete(prod).exec().then(result=>{
                    User.findByIdAndUpdate(user,{$pull:{Inventory:prod}}).exec().then(result=>console.log(result)).catch(err=>console.log(err));
                    User.findByIdAndUpdate(user,{$pull:{Auction:{auctionitemId:prod}}}).exec().then(result=>console.log(result)).catch(err=>console.log(err));
                    User.findByIdAndUpdate(user,{$pull:{Mybids:{bidId:prod}}}).exec().then(result=>console.log(result)).catch(err=>console.log(err));
                    res.status(200).json({message:'product deleted',result:result});
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json({error:err});
                })
            }
            else{
                res.status(500).json({error:'Unauthorised action',resultenlister:result.enlister,user:user});
            }

        }).catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        })

    }
    
})

module.exports = router;