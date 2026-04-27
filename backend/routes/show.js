const express = require("express");
const router = express.Router();


const{
    createShow,  getShowById, getShows, 
} = require("../controllers/showController");
const { route } = require("./auth");

 const { auth, isAdmin } = require("../middlewares/auth");
  

router.post("/create",createShow);//auth,is admin later
router.get("/", getShows);

router.get("/:id", getShowById);




module.exports = router;
