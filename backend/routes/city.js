const express = require("express");
const router = express.Router();

const { createCity,getCities,deactivateCity,activateCity } = require("../controllers/cityController");
const { auth } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/auth");


router.post("/create", auth, isAdmin, createCity);
router.get("/", getCities);
router.put("/deactivate/:cityId",auth, isAdmin, deactivateCity);
router.put("/activate/:cityId",auth,isAdmin,activateCity);
module.exports = router;