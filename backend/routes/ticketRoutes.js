const express = require("express");

const router = express.Router();

const { scanTicket,downloadTicket } = require("../controllers/ticketController");

  const { auth, isAdmin } = require("../middlewares/auth");
   
router.post("/scan-ticket",auth, isAdmin,scanTicket);
router.get("/download/:bookingId",auth, downloadTicket);



module.exports = router;