//this is the route file for the adding products into the shop app
const express=require('express')


const adminController=require('../controllers/admin')

const router=express.Router();

router.get("/add-product",adminController.addProductController);

// router.get("/productslist",adminController.getadminProductslist);

router.post("/view-products",adminController.postProductController);

// router.post("/productslist",adminController.postProductController);

// router.post("/admin/delete-product",adminController.postDeleteProduct);

// router.get("/admin/edit-product/:productID",adminController.getEditProduct);


module.exports=router;
