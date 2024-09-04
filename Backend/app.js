// this is the root file which will executed to start the node server

const express=require('express');

const path=require('path');

const mongoConnect=require("./utils/db.js")
// const rootdir=require('../Backend/utils/utilpath') this code is not used because of template engine

const bodyParser=require("body-parser");

const _404ErrorController=require("./controllers/404controller.js")

const app=express();

app.set('view engine','pug');
app.set('views',"./views");

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,"public")));

const adminRouter=require('./routes/adminRoutes.js');
const shopRouter=require("./routes/shopRoutes.js")


app.use(adminRouter);
app.use(shopRouter);



app.use(_404ErrorController.error404Controller);

mongoConnect(client=>{
    console.log(client);
    app.listen(3000);
})

