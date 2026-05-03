const Booking = require("../models/BookingSchema");
const Show = require("../models/Show");
const redisClient = require("../config/redis");
const crypto = require("crypto");
const { lockSeatsLua } = require("../utils/redisScripts");

// ==============================
// 🔥 HELPER: RELEASE SEATS
// ==============================
const releaseSeats = async (showId, seats) => {
  const pipeline = redisClient.multi();

  for (const seat of seats) {
    pipeline.del(`show:${showId}:seat:${seat}`);
  }

  await pipeline.exec();
};

// ==============================
// 1. LOCK SEATS (SAFE + CONSISTENT)
// ==============================

exports.lockSeats = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { showId, seats } = req.body;

    const ttl = 300;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // ==============================
    // 🔥 BUILD KEYS
    // ==============================
    const keys = seats.map(
      (seat) => `show:${showId}:seat:${seat}`
    );

    // ==============================
    // 🔥 LUA EXECUTION (FIXED SYNTAX)
    // ==============================
    const result = await redisClient.eval(lockSeatsLua, {
      keys,
      arguments: [userId, String(ttl)],
    });

    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: "One or more seats already locked",
      });
    }

    // ==============================
    // 🔥 USER → SEAT MAP
    // ==============================
    const userLockKey = `user:${userId}:locks:${showId}`;

    if (seats.length > 0) {
      await redisClient.sAdd(userLockKey, ...seats);
      await redisClient.expire(userLockKey, ttl);
    }

    // ==============================
    // 🔥 SOCKET EMIT
    // ==============================
    global.io.to(showId).emit("seat_locked", {
      seats,
      userId,
    });

    return res.status(200).json({
      success: true,
      lockedSeats: seats,
    });

  } catch (error) {
    console.log("LOCK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Seat locking failed",
    });
  }
};

// ==============================
// 2. CREATE BOOKING
// ==============================
// exports.createBooking = async (req, res) => {
//   try {
//     const userId = String(req.user.id);
//     const { showId, seats } = req.body;

//     const show = await Show.findById(showId);

//     if (!show ) {
//       return res.status(404).json({
//         success: false,
//         message: "Show and seat required",
//       });
//     }

//     // 🔥 VALIDATE LOCK
//     for (const seat of seats) {
//       const key = `show:${showId}:seat:${seat}`;
//       const lockOwner = await redisClient.get(key);

//       if (!lockOwner || String(lockOwner) !== userId) {
//         return res.status(400).json({
//           success: false,
//           message: `Seat ${seat} lock invalid or expired`,
//         });
//       }
//     }

//     // 🔥 CHECK DB BOOKED
//     const conflict = seats.some(seat =>
//       show.bookedSeats.includes(seat)
//     );

//     if (conflict) {
//       return res.status(400).json({
//         success: false,
//         message: "Some seats already booked",
//       });
//     }

// const pricePerSeat = show.basePrice || 150;
//     const booking = await Booking.create({
//       bookingId: crypto.randomBytes(6).toString("hex"),
//       user: userId,
//       show: showId,
//       seats,
//       totalAmount: seats.length * pricePerSeat,
//       bookingStatus: "Reserved",
//       paymentStatus: "Pending",
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });
//     // ✅ ADD THIS


//     return res.status(201).json({
//       success: true,
//       booking,
//     });

//   } catch (error) {
//     console.log("CREATE ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error creating booking",
//     });
//   }
// };

exports.createBooking = async (req, res) => {
  try {
    const userId = String(req.user?._id || req.user?.id);
    const { showId, seats } = req.body;

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking request",
      });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // 🔥 SAFE LOCK VALIDATION
    for (const seat of seats) {
      const key = `show:${showId}:seat:${seat}`;
      const lockOwner = await redisClient.get(key);

      if (!lockOwner || String(lockOwner) !== userId) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat} lock invalid or expired`,
        });
      }
    }

    // 🔥 SAFE CONFLICT CHECK (FIXED)
    const conflict = seats.some(seat =>
      (show.bookedSeats || []).includes(seat)
    );

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Some seats already booked",
      });
    }

    // 💰 SAFE PRICE
    const pricePerSeat = show.basePrice || 150;

    const booking = await Booking.create({
      bookingId: crypto.randomBytes(6).toString("hex"),
      user: userId,
      show: showId,
      seats,
      totalAmount: seats.length * pricePerSeat,
      bookingStatus: "Reserved",
      paymentStatus: "Pending",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.log("CREATE ERROR:", error); // 👈 THIS WILL SHOW EXACT LINE
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
    });
  }
};

// ==============================
// 3. GET SEAT LAYOUT (OPTIMIZED)
// ==============================
exports.getSeatLayout = async (req, res) => {
  try {
    const userId = req.user?.id ? String(req.user.id) : null;
    const { showId } = req.params;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const rows = ["A", "B", "C", "D"];
    const keys = [];
    const seatMap = [];

    for (let row of rows) {
      for (let i = 1; i <= 10; i++) {
        const seatId = `${row}${i}`;
        keys.push(`show:${showId}:seat:${seatId}`);
        seatMap.push({ seatId, row, number: i });
      }
    }

    const lockValues = await redisClient.mGet(keys);

    const seats = seatMap.map((s, i) => {
      const lockOwner = lockValues[i];

      let status = "AVAILABLE";

      if (show.bookedSeats.includes(s.seatId)) {
        status = "BOOKED";
      } else if (lockOwner) {
        if (userId && String(lockOwner) === userId) {
          status = "MY_LOCKED";
        } else {
          status = "LOCKED";
        }
      }

      return {
        id: s.seatId,
        row: s.row,
        number: s.number,
        status,
      };
    });

    return res.status(200).json({
      success: true,
      seats,
    });

  } catch (error) {
    console.log("SEAT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching seat layout",
    });
  }
};

// ==============================
// 4. CONFIRM BOOKING
// ==============================
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Already confirmed",
      });
    }

    const show = await Show.findById(booking.show);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // 🔥 expiry check
    if (booking.expiresAt < new Date()) {
      await releaseSeats(booking.show, booking.seats);

      booking.bookingStatus = "Cancelled";
      await booking.save();

      return res.status(400).json({
        success: false,
        message: "Booking expired",
      });
    }

    // 🔥 conflict check
    const conflict = booking.seats.some(seat =>
      show.bookedSeats.includes(seat)
    );

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Some seats already booked",
      });
    }

    // 🔥 book seats
    show.bookedSeats = [
      ...new Set([...show.bookedSeats, ...booking.seats]),
    ];
    await show.save();

    // 🔓 release locks
    await releaseSeats(booking.show, booking.seats);

    booking.bookingStatus = "Confirmed";
    booking.paymentStatus = "Success";
    await booking.save();

    global.io.to(booking.show.toString()).emit("seat_booked", {
      seats: booking.seats,
      userId: booking.user.toString(),
    });

    return res.status(200).json({
      success: true,
      message: "Booking confirmed",
    });

  } catch (error) {
    console.log("CONFIRM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error confirming booking",
    });
  }
};

// ==============================
// 5. GET BOOKING BY ID
// ==============================
// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId).populate("show");

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }
// if (
//   booking.bookingStatus === "Reserved" &&
//   booking.expiresAt < new Date()
// ) {
//   await Booking.updateOne(
//     { _id: booking._id },
//     { bookingStatus: "Cancelled" }
//   );

//   const keys = booking.seats.map(
//     (seat) => `show:${booking.show}:seat:${seat}`
//   );

//   await redisClient.del(...keys);

//   global.io.to(booking.show.toString()).emit("seat_unlocked", {
//     seats: booking.seats,
//   });

//   booking.bookingStatus = "Cancelled";
// }
//     return res.status(200).json({
//       success: true,
//       booking,
//        serverTime: new Date(),
//     });

//   } catch (error) {
//     console.log("GET BOOKING ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching booking",
//     });
//   }
// };

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("show");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ HANDLE POPULATED SHOW
    const showId =
      typeof booking.show === "object"
        ? booking.show._id
        : booking.show;

    // 🔥 REAL-TIME EXPIRY
    if (
      booking.bookingStatus === "Reserved" &&
      booking.expiresAt < new Date()
    ) {
      await Booking.updateOne(
        { _id: booking._id },
        { bookingStatus: "Cancelled" }
      );

      const keys = booking.seats.map(
        (seat) => `show:${showId}:seat:${seat}`
      );

      await redisClient.del(...keys);

      global.io.to(showId.toString()).emit("seat_unlocked", {
        seats: booking.seats,
      });

      booking.bookingStatus = "Cancelled";
    }

    return res.status(200).json({
      success: true,
      booking,
      serverTime: new Date(), // ✅ timer sync
    });

  } catch (error) {
    console.log("GET BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching booking",
    });
  }
};

// controllers/bookingController.js


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: [
          {
            path: "screen",
            populate: {
              path: "venue", // ✅ THIS IS CORRECT FOR YOU
            },
          },
          {
            path: "contentId", // ✅ for events
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });

  } catch (error) {
    console.log("GET MY BOOKINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};