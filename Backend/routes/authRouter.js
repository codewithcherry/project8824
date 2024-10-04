const express=require('express');
const router=express.Router();

const authController=require("../controllers/auth");


router.get("/signup",authController.getSignup);
router.post("/signup",authController.postSignup);

router.get("/login",authController.getLogin);
router.post('/login',authController.postLogin);
router.get("/logout",authController.getLogout);

router.get("/change-password",authController.getChangePassword);
router.post("/reset-password",authController.postResetPassword);

router.get("/new-password/:token",authController.getNewPassword);
router.post("/new-password/:token",authController.postNewPassword);

module.exports=router;