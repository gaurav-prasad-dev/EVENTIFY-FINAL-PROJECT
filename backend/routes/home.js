
const express = require("express");
const router = express.Router();

const { getHomeData } = require("../controllers/movie");




router.get("/home", getHomeData);

module.exports = router;