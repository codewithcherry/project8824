// this is the root file which will executed to start the node server
const express=require('express');
const path=require('path');


const mongoose=require("mongoose");
const {uri}=require("./utils/dbcredentials.js")

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

app.use((req,res,next)=>{
    User.findById("66ed8af3932ac24a4df028ac")
    .then(user=>{
        
        req.user=user;
        console.log(req.user);
        next();
    })
    .catch(err=>{
        console.log(err);
    })
})


app.use(adminRouter);
app.use(shopRouter);



app.use(_404ErrorController.error404Controller);

// mongoClientConnect(client=>{   
//     app.listen(3000);
// })  

mongoose.connect(uri).then(()=>{
    console.log("server started with mongodb connection")
    User.findOne().then(user=>{
        if(!user){
            const user=new User({
                username:"demoUser",
                useremail:"demo@test.com",
                cart:{items:[]}
            })
            user.save()
            .then(result=>{
                console.log("user created");
            });
        }
    })
    app.listen(3000);
})
.catch((err)=>{
    console.log("database connection failed",err)
})

