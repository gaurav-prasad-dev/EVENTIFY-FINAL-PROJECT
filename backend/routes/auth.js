// ======================================================
// 📁 routes/authRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  googleLogin,
  logout,
  requestOrganizer,
  // getMe,
} = require("../controllers/Auth");

const { auth } = require("../middlewares/auth");

// ======================================================
// 🔓 PUBLIC ROUTES
// ======================================================

// ✅ SEND OTP
router.post(
  "/send-otp",
  sendOtp
);

// ✅ VERIFY OTP
router.post(
  "/verify-otp",
  verifyOtp
);

// ✅ GOOGLE LOGIN
router.post(
  "/google-login",
  googleLogin
);

// ✅ LOGOUT
router.post(
  "/logout",
  logout
);

// ======================================================
// 🔐 PROTECTED ROUTES
// ======================================================

// ✅ REQUEST ORGANIZER ACCESS
router.post(
  "/request-organizer",
  auth,
  requestOrganizer
);

// ✅ GET CURRENT USER
// router.get(
//   "/me",
//   auth,
//   getMe
// );

module.exports = router;