const cron = require("node-cron");
const Booking = require("../models/BookingSchema");
const Show = require("../models/Show");
const redisClient = require("../config/redis");



cron.schedule("*/1 * * * *",async () => {
     console.log("Checking expired bookings...");

     const now = new Date();

     const expiredBookings = await Booking.find({
        bookingStatus:"Reserved",
        paymentStatus:"Pending",
        expiresAt: { $lt: now }
     });

     for(const booking of expiredBookings){

        const show = await Show.findById(booking.show);

        // remove redis lock

        for(const seat of booking.seats){
            const key = `show:${booking.show}:seat:${seat}`;
            await redisClient.del(key);
        }


        booking.bookingStatus = "Cancelled";

        await booking.save();

        console.log(`Booking ${booking._id} cancelled due to expoirt`);

     }

});


// Every 1 minute
// ↓
// Cron job runs
// ↓
// Check expired bookings
// ↓
// For each expired booking
// ↓
// Unlock Redis seats
// ↓
// Cancel booking



// 🔟 Real Systems Use Cron For Many Things

// Platforms like:

// BookMyShow

// Amazon

// Netflix

// use cron jobs for:

// expire sessions
// clear carts
// send notifications
// cleanup data
// generate reports



