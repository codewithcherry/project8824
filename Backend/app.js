// this is the root file which will executed to start the node server

const express=require('express');

const path=require('path');

const rootdir=require('../Backend/utils/utilpath')

const bodyParser=require("body-parser");

const app=express();

app.set('view engine','pug');
app.set('views',"./views");

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,"public")));

const addProductsrouter=require('./routes/add-product.js');
const viewProductsrouter=require("./routes/view-products.js")
const homerouter=require('./routes/home.js');

app.use(addProductsrouter);
app.use(viewProductsrouter.route);
app.use(homerouter);


app.use((req,res,next)=>{
    console.log("server just started");
    res.render('404',{pagetitle:"Not responding | 404 Error"});
})

app.listen(3000);