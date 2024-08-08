// this is the root file which will executed to start the node server

const express=require('express');

const app=express();


app.get("/add-product",(req,res,next)=>{
    console.log("add product page rendered");
    res.send("<h1>This is the add product page");
})

app.use('/view-products',(req,res,next)=>{
    console.log("view products page");
    res.status("200").send("<h1>This the products displayed page");
})


app.use((req,res,next)=>{
    console.log("server just started");
    res.send("<h1>Welcome to Express server");
})

app.listen(3000);