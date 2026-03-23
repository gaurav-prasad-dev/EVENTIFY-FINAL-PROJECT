const express = require("express");

const router = express.Router();

const { scanTicket,downloadTicket } = require("../controllers/ticketController");

router.post("/scan-ticket", scanTicket);
router.get("/download/:bookingId", downloadTicket);



module.exports = router;