// routes/venue.js

const express = require("express");
const router = express.Router();

// ======================================================
// CONTROLLERS
// ======================================================
const {
 
  getVenueByCity,
  getVenueById,
  getApprovedVenues,
} = require("../controllers/venueController");

// ======================================================
// MIDDLEWARES
// ======================================================
const {
  auth,
  isOrganizer,
  isAdmin,
} = require("../middlewares/auth");

// ======================================================
// VENUE ROUTES
// ======================================================

// ✅ CREATE VENUE

// ✅ GET ALL APPROVED VENUES
router.get(
  "/approved/all",
  getApprovedVenues
);

// ✅ GET VENUES BY CITY
router.get(
  "/city/:cityId",
  getVenueByCity
);

// ✅ GET SINGLE VENUE
router.get(
  "/:id",
  getVenueById
);

module.exports = router;