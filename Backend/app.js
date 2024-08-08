// this is the root file which will executed to start the node server

const express=require('express');

const path=require('path');

const rootdir=require('../Backend/utils/utilpath')

const app=express();

const addProductsrouter=require('./routes/add-product.js');
const viewProductsrouter=require("./routes/view-products.js")

app.use(addProductsrouter);
app.use(viewProductsrouter);


app.use((req,res,next)=>{
    console.log("server just started");
    res.sendFile(path.join(rootdir,'views','404.html'));
})

app.listen(3000);