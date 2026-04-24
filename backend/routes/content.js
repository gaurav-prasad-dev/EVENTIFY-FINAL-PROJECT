const express = require("express");
const router = express.Router();

const {
    createContent,
    getContents,
    getContentById,
    updateContent,
   
} = require("../controllers/contentController");


  const { auth, isAdmin } = require("../middlewares/auth");
   

router.post("/create", auth, isAdmin, createContent);
router.get("/", getContents);

router.get("/:id", getContentById);
router.put("/:id",auth,isAdmin, updateContent);

module.exports = router;

