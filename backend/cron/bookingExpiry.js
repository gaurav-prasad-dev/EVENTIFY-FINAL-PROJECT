const cron = require("node-cron");
const Booking = require("../models/BookingSchema");
const redisClient = require("../config/redis");

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();

  try {
    const expiredBookings = await Booking.find({
      bookingStatus: "Reserved",
      paymentStatus: "Pending",
      expiresAt: { $lt: now },
    });

    if (expiredBookings.length === 0) return;

    console.log(`Found ${expiredBookings.length} expired bookings`);

    await Promise.all(
      expiredBookings.map(async (booking) => {
        try {
          const keys = (booking.seats || []).map(
            (seat) => `show:${booking.show}:seat:${seat}`
          );

          // Release seat locks if Redis is connected
          if (keys.length > 0 && redisClient.isOpen) {
            await redisClient.del(...keys);
          }

          // 🔒 ATOMIC UPDATE
          await Booking.updateOne(
            {
              _id: booking._id,
              bookingStatus: "Reserved",
              paymentStatus: "Pending",
            },
            { bookingStatus: "Cancelled" }
          );

          // 🔔 SOCKET
          if (global.io) {
            global.io.to(booking.show.toString()).emit("seat_unlocked", {
              seats: booking.seats,
            });
          }

        } catch (err) {
          console.log("Error processing booking:", booking._id, err);
        }
      })
    );

  } catch (err) {
    console.error("CRON ERROR:", err);
  }
});