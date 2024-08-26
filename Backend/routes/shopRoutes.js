// this is the routes page for the listing the products of shop app

const express=require('express');
const path=require("path")

const router=express.Router();

const adminController=require("../controllers/admin")
const shopController=require('../controllers/shop')

// const rootdir=require("../utils/utilpath"); using template engine doesnot require the root dir

router.get("/view-products",shopController.getProdducts);

router.get('/home',shopController.getShopHome);

router.post("/view-products",adminController.postProductController);

router.get("/orders",shopController.getOrders);

router.get('/cart',shopController.getShopCart);
router.get('/checkout',shopController.getShopCheckout);

module.exports=router

