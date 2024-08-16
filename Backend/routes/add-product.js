//this is the route file for the adding products into the shop app
const express=require('express')
const path=require('path');

const rootdir = require('../utils/utilpath');

const router=express.Router();

router.get("/add-product",(req,res,next)=>{
    console.log("add product page rendered");
    res.render("add-product",{pagetitle:"Add Products"});
})


module.exports=router
