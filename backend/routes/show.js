const express = require("express");
const router = express.Router();

const {
 
  
  getShowById,
  getShowsByContent
} = require("../controllers/showController");

const {
  auth,
  isOrganizer,
  isAdmin,
} = require("../middlewares/auth");


// =======================================================
// 🎭 PUBLIC ROUTES (USER SIDE)
// =======================================================

// router.get("/:contentId", getShowsByContent);

// // GET SINGLE SHOW DETAILS
// router.get("/:id", getShowById);

// ✅ FIX — use distinct paths
router.get("/by-content/:contentId", getShowsByContent);
router.get("/:id", getShowById);


// =======================================================
// 🔐 ORGANIZER ROUTES
// =======================================================

// CREATE SHOW (organizer only)



module.exports = router;