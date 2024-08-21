//this is the route file for the adding products into the shop app
const express=require('express')
const path=require('path');

const rootdir = require('../utils/utilpath');

const productsController=require('../controllers/products')

const router=express.Router();

router.get("/add-product",productsController.addProductController);


module.exports=router
