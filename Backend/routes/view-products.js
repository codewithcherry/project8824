// this is the routes page for the listing the products of shop app

const express=require('express');
const path=require("path")

const router=express.Router();

const productsController=require("../controllers/products")

const rootdir=require("../utils/utilpath");



router.get("/view-products",productsController.getProductController)

router.post("/view-products",productsController.postProductController)

module.exports=router

