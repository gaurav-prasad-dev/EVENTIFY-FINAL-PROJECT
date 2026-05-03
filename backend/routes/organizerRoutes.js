// ======================================================
// 📁 routes/organizerRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

// ======================================================
// 🎮 CONTROLLERS
// ======================================================

const {
  // ================= SHOWS =================
  getMyShows,
  deleteMyShow,
  updateMyShow,
  publishShow,

  // ================= DASHBOARD =================
  getOrganizerDashboard,
  getRevenuePerShow,

  // ================= BOOKINGS =================
  getOrganizerRecentBookings,

  // ================= UPCOMING SHOWS =================
  getOrganizerUpcomingShows,

  // ================= VENUES =================
  getMyVenues,
  updateMyVenue,

} = require("../controllers/organizerController");
const { createSingleShow } = require("../controllers/showController");
const {
  createVenue
} = require("../controllers/venueController");

// ======================================================
// 🔐 MIDDLEWARES
// ======================================================

const {
  auth,
  isOrganizer,
} = require("../middlewares/auth");

// ======================================================
// 🎬 SHOW MANAGEMENT
// ======================================================

// ✅ GET ALL MY SHOWS

// ✅ CREATE SHOW (organizer only)
router.post(
  "/shows/create",
  auth,
  isOrganizer,
  createSingleShow
);

router.get(
  "/shows",
  auth,
  isOrganizer,
  getMyShows
);

// ✅ GET UPCOMING SHOWS
router.get(
  "/shows/upcoming",
  auth,
  isOrganizer,
  getOrganizerUpcomingShows
);

// ✅ UPDATE SHOW
router.put(
  "/shows/:id",
  auth,
  isOrganizer,
  updateMyShow
);

// ✅ DELETE SHOW
router.delete(
  "/shows/:id",
  auth,
  isOrganizer,
  deleteMyShow
);

// ✅ PUBLISH SHOW
router.patch(
  "/shows/:id/publish",
  auth,
  isOrganizer,
  publishShow
);

// ======================================================
// 📊 DASHBOARD & ANALYTICS
// ======================================================

// ✅ ORGANIZER DASHBOARD
router.get(
  "/dashboard",
  auth,
  isOrganizer,
  getOrganizerDashboard
);

// ✅ REVENUE ANALYTICS
router.get(
  "/analytics/revenue",
  auth,
  isOrganizer,
  getRevenuePerShow
);

// ======================================================
// 🧾 BOOKINGS
// ======================================================

// ✅ GET RECENT BOOKINGS
router.get(
  "/bookings/recent",
  auth,
  isOrganizer,
  getOrganizerRecentBookings
);

// ======================================================
// 🏢 VENUE MANAGEMENT
// ======================================================

// ✅ GET MY VENUES
router.post(
  "/venues/create",
  auth,
  isOrganizer,
  createVenue
);

router.get(
  "/venues",
  auth,
  isOrganizer,
  getMyVenues
);

// ✅ UPDATE MY VENUE
router.put(
  "/venues/:id",
  auth,
  isOrganizer,
  updateMyVenue
);


module.exports = router;