const express = require("express");
const router = express.Router();


const { search , getMovieDetails, getVideos, getAllGenres,} = require("../controllers/movie");




router.get("/search", search);
router.get("/genres", getAllGenres);
router.get("/:id/videos", getVideos);
router.get("/:id", getMovieDetails);


module.exports = router;