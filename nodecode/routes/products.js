const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'displaying all the enlisted products'
    });
});
router.post('/:userId',(req,res,next)=>{
    const productdata = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        postedby: req.params.userId,
        tags: req.body.tags,
        intrested: req.body.intrestedtags
    }
    res.status(200).json({
        message:'adding this product to the product list',
        desc:productdata
    });
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
    res.status(200).json({
        message:'deleting product with id',
        id: id
    });
});
router.patch('/:productId/:userId',(req,res,next)=>{
    const id = req.params.productId;
    const user = req.params.userId;
    res.status(200).json({
        message:'updating product values for given id',
        id: id,
        user: user
    });
});


module.exports = router;