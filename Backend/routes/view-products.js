// this is the routes page for the listing the products of shop app

const express=require('express');
const path=require("path")

const router=express.Router();

const productsController=require("../controllers/admin")
const shopController=require('../controllers/shop')

// const rootdir=require("../utils/utilpath"); using template engine doesnot require the root dir

router.get("/view-products",shopController.getProdducts)

router.post("/view-products",productsController.postProductController)

module.exports=router

