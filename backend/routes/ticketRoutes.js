// routes/ticket.js

const express = require("express");
const router = express.Router();

const {
  scanTicket,
  downloadTicket,
} = require("../controllers/ticketController");

const {
  auth,
  isAdmin,
} = require("../middlewares/auth");

// ======================================================
// 🎟️ SCAN QR TICKET
// ======================================================
router.post(
  "/scan-ticket",
  auth,
  isAdmin,
  scanTicket
);

// ======================================================
// 📄 DOWNLOAD PDF TICKET
// ======================================================
router.get(
  "/download/:bookingId",
  auth,
  downloadTicket
);

module.exports = router;