const express = require("express");

const router = express.Router();

const { razorpayWebhook,createPaymentOrder} = require("../controllers/paymentWebhook");

router.post("/razorpay-webhook", razorpayWebhook);
router.post("/createOrder", createPaymentOrder );



module.exports = router;