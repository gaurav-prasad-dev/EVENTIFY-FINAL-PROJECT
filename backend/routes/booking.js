// ======================================================
// 📁 routes/bookingRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

const {
  lockSeats,
  createBooking,
  confirmBooking,
  getBookingById,
  getSeatLayout,
  getMyBookings
} = require("../controllers/bookingController");

const { auth } = require("../middlewares/auth");

// ======================================================
// 🎟️ SEAT MANAGEMENT
// ======================================================

// ✅ LOCK SEATS
router.post(
  "/lock-seats",
  auth,
  lockSeats
);

// ✅ GET SEAT LAYOUT
router.get(
  "/seats/:showId",
  auth,
  getSeatLayout
);

// ======================================================
// 📦 BOOKING MANAGEMENT
// ======================================================

// ✅ CREATE BOOKING
router.post(
  "/create",
  auth,
  createBooking
);

// ✅ CONFIRM BOOKING
router.post(
  "/confirm",
  auth,
  confirmBooking
);

// ✅ GET BOOKING DETAILS
router.get(
  "/:bookingId",
  auth,
  getBookingById
);

router.get("/my", auth, getMyBookings);

module.exports = router;