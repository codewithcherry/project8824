//this is the route file for the adding products into the shop app
const express=require('express')
const isAuth=require("../middlewares/isAuth");

const adminController=require('../controllers/admin')

const router=express.Router();

router.get("/add-product", isAuth , adminController.addProductController);

router.get("/productslist", isAuth , adminController.getadminProductslist);

router.post("/view-products", isAuth ,adminController.postProductController);

router.post("/productslist", isAuth ,adminController.postEditProductDetails);

router.post("/admin/delete-product", isAuth ,adminController.postDeleteProduct);

router.get("/admin/edit-product/:productID",isAuth,adminController.getEditProduct);


module.exports=router;
