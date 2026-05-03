// ======================================================
// 📁 routes/paymentRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// 🎮 CONTROLLERS
// ======================================================

const {
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed,
  // razorpayWebhook,
} = require("../controllers/paymentWebhook");

// ======================================================
// 🔐 MIDDLEWARE
// ======================================================

const { auth } = require("../middlewares/auth");

// ======================================================
// 💳 PAYMENT ROUTES
// ======================================================

// ✅ CREATE RAZORPAY ORDER
router.post(
  "/create-order",
  auth,
  createPaymentOrder
);

// ✅ VERIFY PAYMENT
router.post(
  "/verify",
  auth,
  verifyPayment
);

// ✅ MARK PAYMENT FAILED
router.post(
  "/fail",
  auth,
  markPaymentFailed
);

// ======================================================
// 🔔 WEBHOOK ROUTE (OPTIONAL)
// ======================================================

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   razorpayWebhook
// );

module.exports = router;