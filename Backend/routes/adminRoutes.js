//this is the route file for the adding products into the shop app
const express=require('express')


const adminController=require('../controllers/admin')

const router=express.Router();

router.get("/admin/add-product",adminController.addProductController);

router.get("/admin/productslist",adminController.getadminProductslist);


module.exports=router
