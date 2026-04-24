const express = require('express');
const router = express.Router();

const {
    createScreen, getScreenByVenue, getScreenById
} = require("../controllers/screenController");

 const { auth, isAdmin } = require("../middlewares/auth");
  


router.post("/create", createScreen);//  auth,isAdmin, add later
router.get("/venue/:venueId", getScreenByVenue);
router.get("/:id", getScreenById);


module.exports = router;

