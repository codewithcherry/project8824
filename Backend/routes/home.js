// this route is for home page of the website

const express=require('express');

const path=require('path')

const router=express.Router();

const rootdir=require('../utils/utilpath');

const viewproducts=require("../routes/view-products.js");

router.get("/",(req,res,next)=>{
    console.log("Home page");
    console.log(viewproducts.productsList);  
    res.sendFile(path.join(rootdir,'views','home.html'));
})

module.exports=router;