//this is the route file for the adding products into the shop app
const express=require('express')
const isAuth=require("../middlewares/isAuth");
const {body}=require("express-validator");
const adminController=require('../controllers/admin')

const router=express.Router();

router.get("/add-product", isAuth , adminController.addProductController);

router.get("/productslist", isAuth , adminController.getadminProductslist);

router.post("/view-products" ,isAuth,
    [
        body("title").isString().isLength({min:3}).withMessage("Invalid product title please check"),
        body('description').isString().isLength({min:50}).withMessage("Description should be atleast 50 characters"),
        body('price').isFloat().withMessage("Enter a valid price of the product"),
        // body('image').isURL().withMessage("Invalid product image url")
    ] ,
    adminController.postProductController);

router.post("/productslist", isAuth,
    [
        body("title").isString().isLength({min:3}).withMessage("Invalid product title please check"),
        body('description').isString().isLength({min:50}).withMessage("Description should be atleast 50 characters"),
        body('price').isFloat().withMessage("Enter a valid price of the product")
    ], 
    adminController.postEditProductDetails);

router.post("/admin/delete-product", isAuth ,adminController.postDeleteProduct);

router.get("/admin/edit-product/:productID",isAuth,adminController.getEditProduct);


module.exports=router;
