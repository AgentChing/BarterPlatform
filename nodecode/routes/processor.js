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
       // const filter = req.body.filter;
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
    else if(action === 'getproductinfo')
    {
        Product.findById(req.body.target).then(resut=>{
            res.status(200).json(result);
        }).catch(err=>{
            res.status(500).json({error:err});
        });
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
    else if(action === 'setupauction')
    {
        const prodid = req.body.target;
        Product.findById(prodid).exec().then(result=>{
            Product.findByIdAndUpdate(result._id,{status:'inauction'},{new:true, runValidators:true, returnDocument:true}).exec()
            .then(result=>{
                const temp = {auctionitemId:result._id,bidIds:new Array()};
                User.findByIdAndUpdate(req.body.userid,{$addToSet:{Auction:temp}},{new:true, runValidators:true, returnDocument:true})
                .exec().then(a=>{
                    res.status(200).json({message:'auction setup complete',result:a});
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json({message:'Error setting up for auction',error:err});
                });
            }).catch(err=>{
                console.log(err);
                res.status(500).json({message:'Error setting up for auction',error:err});
            });
        }).catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        })
    }
    else if(action === 'placebid')
    {
        const prodid = req.body.target;
        const auctionitemid = req.body.target2;
        Product.findById(prodid).exec().then(biditem=>{
            if(biditem.status === 'free')
            {
                Product.findById(auctionitemid).exec().then(auctionitem=>{
                    if(auctionitem.status === 'inauction')
                    {
                        User.findByIdAndUpdate(auctionitem.enlister,{$addToSet:{Auction:{Mybids:prodid}}},{new:true, runValidators:true, returnDocument:true}).exec()
                        .then(updatedauction=>{
                            User.findByIdAndUpdate(biditem.enlister,{$addToSet:{Mybids:{auctionitemId:auctionitemid,bidId:prodid,Status:'ongoing'}}},{new:true, runValidators:true, returnDocument:true}).exec()
                            .then(updatedbid=>{
                                res.status(200).json({message:'bid placed',auctionitem:auctionitem,biditem:biditem});
                            }).catch(err=>{
                                console.log(err);
                                 res.status(500).json({message:'Error updating bid item list',error:err});
                            });
                        }).catch(err=>{
                            console.log(err);
                            res.status(500).json({message:'Error updating auction item list',error:err});
                        })
                    }
                    else{
                        console.log(err);
                        res.status(500).json({message:'Product aint free for auctioning'});
                    }
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json({message:'Error finding auction product',error:err});
                })
            }
            else{
                console.log(err);
                res.status(500).json({message:'Product aint free for bidding'});
            }
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message:'Error finding your product',error:err});
        })
    }
    else{

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