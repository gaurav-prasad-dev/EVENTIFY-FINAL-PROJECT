// ======================================================
// 📁 routes/adminRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// MIDDLEWARES
// ======================================================

const {
  auth,
  isAdmin,
} = require("../middlewares/auth");

// ======================================================
// ADMIN CONTROLLERS
// ======================================================

const {
  // ================= ORGANIZERS =================
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,

  // ================= SHOWS =================
  getAllShows,
  deleteAnyShow,

  // ================= PENDING SHOWS =================
  getPendingShows,
  approveShow,
  rejectShow,

  // ================= CITIES =================
  getAllCities,

  // ================= REVENUE =================
  getRevenue,

  // ================= DASHBOARD =================
  getAdminStats,

  // ================= VENUES =================
  getPendingVenues,
  approveVenue,
  rejectVenue,

  // ================= USERS =================
  getAllUsers,
  blockUser,
  unblockUser,

  // ================= TRANSACTIONS =================
  getAllTransactions,

  // ================= ANALYTICS =================
  getRevenueTrends,
  getTopContent,

} = require("../controllers/adminController");

// ======================================================
// CITY CONTROLLERS
// ======================================================

const {
  createCity,
  deactivateCity,
  activateCity,
} = require("../controllers/cityController");

// ======================================================
// 👨‍💼 ORGANIZER MANAGEMENT
// ======================================================

// GET ALL PENDING ORGANIZERS
router.get(
  "/organizers/pending",
  auth,
  isAdmin,
  getPendingOrganizers
);

// APPROVE ORGANIZER
router.patch(
  "/organizers/:id/approve",
  auth,
  isAdmin,
  approveOrganizer
);

// REJECT ORGANIZER
router.patch(
  "/organizers/:id/reject",
  auth,
  isAdmin,
  rejectOrganizer
);

// ======================================================
// 🎬 SHOW MANAGEMENT
// ======================================================

// GET ALL SHOWS
router.get(
  "/shows",
  auth,
  isAdmin,
  getAllShows
);

// DELETE ANY SHOW
router.delete(
  "/shows/:id",
  auth,
  isAdmin,
  deleteAnyShow
);

// ======================================================
// 🎬 PENDING SHOW APPROVAL
// ======================================================

// GET ALL PENDING SHOWS
router.get(
  "/shows/pending",
  auth,
  isAdmin,
  getPendingShows
);

// APPROVE SHOW
router.patch(
  "/shows/:id/approve",
  auth,
  isAdmin,
  approveShow
);

// REJECT SHOW
router.patch(
  "/shows/:id/reject",
  auth,
  isAdmin,
  rejectShow
);

// ======================================================
// 🏙️ CITY MANAGEMENT
// ======================================================

// GET ALL CITIES
router.get(
  "/cities",
  auth,
  isAdmin,
  getAllCities
);

// CREATE CITY
router.post(
  "/city/create",
  auth,
  isAdmin,
  createCity
);

// DEACTIVATE CITY
router.patch(
  "/city/deactivate/:cityId",
  auth,
  isAdmin,
  deactivateCity
);

// ACTIVATE CITY
router.patch(
  "/city/activate/:cityId",
  auth,
  isAdmin,
  activateCity
);

// ======================================================
// 🏢 VENUE MANAGEMENT
// ======================================================

// GET PENDING VENUES
router.get(
  "/venues/pending",
  auth,
  isAdmin,
  getPendingVenues
);

// APPROVE VENUE
router.patch(
  "/venues/:id/approve",
  auth,
  isAdmin,
  approveVenue
);

// REJECT VENUE
router.patch(
  "/venues/:id/reject",
  auth,
  isAdmin,
  rejectVenue
);

// ======================================================
// 👥 USER MANAGEMENT
// ======================================================

// GET ALL USERS
router.get(
  "/users",
  auth,
  isAdmin,
  getAllUsers
);

// BLOCK USER
router.patch(
  "/users/:id/block",
  auth,
  isAdmin,
  blockUser
);

// UNBLOCK USER
router.patch(
  "/users/:id/unblock",
  auth,
  isAdmin,
  unblockUser
);

// ======================================================
// 💳 TRANSACTIONS
// ======================================================

// GET ALL TRANSACTIONS
router.get(
  "/transactions",
  auth,
  isAdmin,
  getAllTransactions
);

// ======================================================
// 💰 REVENUE
// ======================================================

// GET REVENUE
router.get(
  "/revenue",
  auth,
  isAdmin,
  getRevenue
);

// ======================================================
// 📈 ANALYTICS
// ======================================================

// REVENUE TRENDS
router.get(
  "/analytics/revenue-trends",
  auth,
  isAdmin,
  getRevenueTrends
);

// TOP CONTENT
router.get(
  "/analytics/top-content",
  auth,
  isAdmin,
  getTopContent
);

// ======================================================
// 📊 DASHBOARD
// ======================================================

// ADMIN STATS
router.get(
  "/stats",
  auth,
  isAdmin,
  getAdminStats
);

module.exports = router;