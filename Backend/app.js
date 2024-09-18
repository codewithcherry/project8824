// this is the root file which will executed to start the node server
const express=require('express');
const path=require('path');
// const mongodb=require('mongodb')
// const {mongoClientConnect}=require("./utils/db.js")

const mongoose=require("mongoose");
const {uri}=require("./utils/dbcredentials.js")
// const rootdir=require('../Backend/utils/utilpath') this code is not used because of template engine
const bodyParser=require("body-parser");
const _404ErrorController=require("./controllers/404controller.js")
const User=require("./models/users.js");

const app=express();

app.set('view engine','pug');
app.set('views',"./views");


const adminRouter=require('./routes/adminRoutes.js');
const shopRouter=require("./routes/shopRoutes.js");

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

// app.use((req,res,next)=>{
//     User.findUserbyId("66dab8b0bdb87e934d2593eb")
//     .then(user=>{
        
//         req.user=new User(new mongodb.ObjectId(user._id),user.userName,user.email,user.cart);
//         next();
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// })


app.use(adminRouter);
app.use(shopRouter);



app.use(_404ErrorController.error404Controller);

// mongoClientConnect(client=>{   
//     app.listen(3000);
// })  

mongoose.connect(uri).then(()=>{
    console.log("server started with mongodb connection")
    app.listen(3000);
})
.catch((err)=>{
    console.log("database connection failed",err)
})

