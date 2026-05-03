// ======================================================
// 📁 routes/screenRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// 🎮 CONTROLLERS
// ======================================================

const {
  createScreen,
  getScreenByVenue,
  getScreenById,
  getAllScreens,
} = require("../controllers/screenController");

// ======================================================
// 🔐 MIDDLEWARES
// ======================================================

const {
  auth,
  isAdmin,
} = require("../middlewares/auth");

// ======================================================
// 🎥 SCREEN ROUTES
// ======================================================

// ✅ CREATE SCREEN
router.post(
  "/create",
  auth,
  // isAdmin,
  createScreen
);

// ✅ GET SCREENS BY VENUE
router.get(
  "/venue/:venueId",
  getScreenByVenue
);

// ✅ GET SCREEN BY ID
router.get(
  "/:id",
  getScreenById
);

router.get("/", getAllScreens);

module.exports = router;