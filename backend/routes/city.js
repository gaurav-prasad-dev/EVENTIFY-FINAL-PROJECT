// ======================================================
// 📁 routes/cityRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

const {
  
  getCities,
  
} = require("../controllers/cityController");

const { auth, isAdmin } = require("../middlewares/auth");

// ======================================================
// 🏙️ CITY ROUTES
// ======================================================

// ✅ GET ALL ACTIVE CITIES
router.get(
  "/",
  getCities
);



module.exports = router;