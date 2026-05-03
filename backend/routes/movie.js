// ======================================================
// 📁 routes/movieRoutes.js
// ======================================================

const express = require("express");
const router = express.Router();

const {
  getHomeData,
  search,
  getMovieDetails,
  getVideos,
  getAllGenres,
} = require("../controllers/movie");

// ======================================================
// 🎬 MOVIE ROUTES
// ======================================================

// ✅ HOME DATA
router.get(
  "/home",
  getHomeData
);

// ✅ SEARCH MOVIES
router.get(
  "/search",
  search
);

// ✅ GET ALL GENRES
router.get(
  "/genres",
  getAllGenres
);

// ✅ GET MOVIE VIDEOS / TRAILERS
router.get(
  "/:id/videos",
  getVideos
);

// ✅ GET MOVIE DETAILS
router.get(
  "/:id",
  getMovieDetails
);

module.exports = router;