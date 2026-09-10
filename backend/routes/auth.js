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
  refreshAccessToken,
  getMe,
} = require("../controllers/Auth");

const { auth, optionalAuth } = require("../middlewares/auth");

// ======================================================
// 🔓 PUBLIC ROUTES
// ======================================================

router.post("/refresh-token", refreshAccessToken);

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

// ✅ LOGOUT (clears cookies and revokes session if authenticated)
router.post(
  "/logout",
  optionalAuth,
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
router.get(
  "/me",
  auth,
  getMe
);

module.exports = router;