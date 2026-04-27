const express = require("express");

const router = express.Router();

const { verifyPayment,createPaymentOrder} = require("../controllers/paymentWebhook");


  const { auth } = require("../middlewares/auth");
   
router.post("/createOrder",auth, createPaymentOrder );
router.post("/verify", auth,verifyPayment);


module.exports = router;