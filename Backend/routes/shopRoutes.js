// this is the routes page for the listing the products of shop app

const express=require('express');
const path=require("path")
const isAuth=require("../middlewares/isAuth");

const router=express.Router();

const adminController=require("../controllers/admin")
const shopController=require('../controllers/shop')

// const rootdir=require("../utils/utilpath"); using template engine doesnot require the root dir

router.get("/",shopController.getShopHome);

router.get("/view-products",shopController.getProdducts);

router.get('/home',shopController.getShopHome);

router.get('/product/:productId', isAuth ,shopController.getProductDetails);


router.get("/orders", isAuth, shopController.getOrders);

router.get('/cart', isAuth, shopController.getShopCart);
 
router.post("/cart", isAuth, shopController.postShopCart);

router.post("/cart-remove-product", isAuth, shopController.postDeleteCartProduct);
router.post("/orders", isAuth, shopController.postCartToOrders);
router.get('/orders', isAuth, shopController.getOrders);

module.exports=router

