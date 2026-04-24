const express = require("express");
const router = express.Router();

const { getEventData } = require("../controllers/eventController");

router.get("/home", getEventData);

module.exports = router;