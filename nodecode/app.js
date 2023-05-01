const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Ashwin:Letm31n4now@barterbin.pwri7sd.mongodb.net/?retryWrites=true&w=majority');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, GET, POST, DELETE');
        return res.status(200).json({});
    }

    next();
});

const productroute = require('./routes/processor');
const userroute = require('./routes/user');
app.use('/products',productroute);
app.use('/user',userroute);

app.use((req,res,next)=>{
    res.status(200).json({
        message:'works just fine'
    });
});

module.exports = app;