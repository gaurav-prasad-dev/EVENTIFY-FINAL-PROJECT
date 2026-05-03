// ======================================================
// 📁 routes/profileRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// 🎮 CONTROLLERS
// ======================================================

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// ======================================================
// 🔐 MIDDLEWARE
// ======================================================

const { auth } = require("../middlewares/auth");

// ======================================================
// 👤 PROFILE ROUTES
// ======================================================

// ✅ GET MY PROFILE
router.get(
  "/me",
  auth,
  getProfile
);

// ✅ UPDATE PROFILE
router.put(
  "/update",
  auth,
  updateProfile
);

module.exports = router;