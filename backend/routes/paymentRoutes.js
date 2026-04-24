const express = require("express");

const router = express.Router();

const { verifyPayment,createPaymentOrder} = require("../controllers/paymentWebhook");


router.post("/createOrder", createPaymentOrder );
router.post("/verify", verifyPayment);


module.exports = router;