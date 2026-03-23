const express = require("express");
const router = express.Router();

const{ sendOtp, verifyOtp, googleLogin } = require("../controllers/Auth");

const { auth } = require("../middlewares/auth");


//public routes

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);


router.post("/google-login", googleLogin);

// test protexted routes

router.get("/me",auth,(req,res) =>{
    res.json({
        success:true,
        user:req.user
    });
})

module.exports = router;