// this is the routes page for the listing the products of shop app

const express=require('express');
const path=require("path")

const router=express.Router();

const rootdir=require("../utils/utilpath");

const products=[]

router.get("/view-products",(req,res,next)=>{
    console.log("view products page rendered");
    res.render('view-products',{pagetitle:"View Products"});
})

router.post("/view-products",(req,res,next)=>{
    products.push(req.body);
    console.log(products);
    res.redirect("/");
})

module.exports={route:router, productsList:products};

