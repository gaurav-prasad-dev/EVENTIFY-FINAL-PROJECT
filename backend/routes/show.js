const express = require("express");
const router = express.Router();


const{
    createShow, getShowByContent, getShowById
} = require("../controllers/showController");
const { route } = require("./auth");

 const { auth, isAdmin } = require("../middlewares/auth");
  

router.post("/create",auth,isAdmin, createShow);
router.get("/content/:contentId", getShowByContent);
router.get("/:id", getShowById);

module.exports = router;
