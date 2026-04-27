const express = require("express");
const router = express.Router();

const {lockSeats,createBooking,confirmBooking,getBookingById,getSeatLayout} = require("../controllers/bookingController");
const {auth} = require("../middlewares/auth");

router.post("/lock-seats",auth,lockSeats);
router.post("/create",auth,createBooking);//add auth later

router.post("/confirm",auth,confirmBooking);

router.get("/:bookingId", getBookingById);
router.get("/seats/:showId", getSeatLayout);

// router.post("/payment/order",auth,createPaymentOrder);
// router.post("/payment/verify",auth,verifyPayment);

module.exports = router;