const express = require("express");

const router = express.Router();

const { verifyPayment,createPaymentOrder,markPaymentFailed} = require("../controllers/paymentWebhook");


  const { auth } = require("../middlewares/auth");
   
router.post("/createOrder",auth, createPaymentOrder );
router.post("/verify", auth,verifyPayment);
router.post("/payment/fail", auth, markPaymentFailed);


module.exports = router;