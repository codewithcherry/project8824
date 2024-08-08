// this is the routes page for the listing the products of shop app

const express=require('express');
const path=require("path")

const router=express.Router();

const rootdir=require("../utils/utilpath");

router.get("/view-products",(req,res,next)=>{
    console.log("view products page rendered");
    res.sendfile(path.join(rootdir,"views",'view-products.html'));
})

module.exports=router

