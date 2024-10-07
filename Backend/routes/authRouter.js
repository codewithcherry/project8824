const express=require('express');
const router=express.Router();

const authController=require("../controllers/auth");

const {body}=require("express-validator");


router.get("/signup",authController.getSignup);

router.post("/signup", [
    body('email').isEmail().withMessage("Enter a valid email id!"),
    body('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password and confirm password do not match');
        }
        return true;  // Return true if validation passed
    })
],
authController.postSignup);


router.get("/login",authController.getLogin);
router.post('/login',authController.postLogin);
router.get("/logout",authController.getLogout);

router.get("/change-password",authController.getChangePassword);
router.post("/reset-password",authController.postResetPassword);

router.get("/new-password/:token",authController.getNewPassword);
router.post("/new-password/:token",authController.postNewPassword);

module.exports=router;