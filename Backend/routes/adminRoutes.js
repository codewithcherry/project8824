//this is the route file for the adding products into the shop app
const express=require('express')


const productsController=require('../controllers/admin')

const router=express.Router();

router.get("/admin/add-product",productsController.addProductController);


module.exports=router
