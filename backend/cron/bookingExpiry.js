const cron = require("node-cron");
const Booking = require("../models/BookingSchema");
const redisClient = require("../config/redis");

cron.schedule("*/1 * * * *", async () => {
  console.log("Checking expired bookings...");

  const now = new Date();

  const expiredBookings = await Booking.find({
    bookingStatus: "Reserved",
    paymentStatus: "Pending",
    expiresAt: { $lt: now }
  });

  for (const booking of expiredBookings) {
    try {
      // safety check
      if (booking.bookingStatus !== "Reserved") continue;

      // remove redis locks (optimized)
      const keys = booking.seats.map(
        seat => `show:${booking.show}:seat:${seat}`
      );

      await redisClient.del(keys);

      // update booking
      booking.bookingStatus = "Cancelled";
      await booking.save();

      // notify frontend
      global.io.to(booking.show.toString()).emit("seat_unlocked", {
        seats: booking.seats
      });

      console.log(`Booking ${booking._id} cancelled due to expiry`);

    } catch (err) {
      console.log("Error processing booking:", booking._id, err);
    }
  }
});