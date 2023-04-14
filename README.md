# BarterPlatform
a platform to trade in goods leaving dependency on bank valued money and other such systems.

npm install --save body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


to handle cors errors (cross origin resource sharing), we will have to append the headers for all the req so that the client and servers are in aggrement. we do this by appenduing the headers in this format:
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); // here * can be replaced with any domain.
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, GET, POST, DELETE');
        return res.status(200).json({});
    }

    next();
});
this has to be done before nay routing is to be encountered.