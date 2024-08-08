// this route is for home page of the website

const express=require('express');

const path=require('path')

const router=express.Router();

const rootdir=require('../utils/utilpath');

router.get("/",(req,res,next)=>{
    console.log("Home page");
    res.sendFile(path.join(rootdir,'views','home.html'));
})

module.exports=router;