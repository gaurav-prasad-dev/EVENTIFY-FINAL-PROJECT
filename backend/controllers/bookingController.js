
const Booking = require("../models/BookingSchema");
const Show = require("../models/Show");
const redisClient = require("../config/redis");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const QRCode = require("qrcode");

const jwt = require("jsonwebtoken");

exports.lockSeats = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED
    const { showId, seats } = req.body;

    const lockDuration = 300;
    const lockedSeats = [];

    for (const seat of seats) {
      const key = `show:${showId}:seat:${seat}`;

      const result = await redisClient.set(key, userId, {
        EX: lockDuration,
        NX: true,
      });

      if (!result) {
        // rollback
        for (const s of lockedSeats) {
          await redisClient.del(`show:${showId}:seat:${s}`);
        }

        return res.status(400).json({
          success: false,
          message: `Seat ${seat} already locked`,
        });
      }

      lockedSeats.push(seat);
    }

    // 🔥 SOCKET
    global.io.to(showId).emit("seat_locked", { seats: lockedSeats });

    return res.status(200).json({
      success: true,
      lockedSeats,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Seat locking failed",
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { showId, seats } = req.body;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // ✅ LOCK VALIDATION
    for (const seat of seats) {
      const key = `show:${showId}:seat:${seat}`;

      const lockOwner = await redisClient.get(key);

      if (!lockOwner) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat} not locked`,
        });
      }

      if (lockOwner !== userId) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat} locked by another user`,
        });
      }
    }

    // ✅ ALREADY BOOKED CHECK
    const alreadyBooked = seats.some((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "Some seats already booked",
      });
    }

    const totalAmount = seats.length * show.basePrice;

    const booking = await Booking.create({
      bookingId: crypto.randomBytes(6).toString("hex"),
      user: userId,
      show: showId,
      seats,
       totalAmount,
      bookingStatus: "Reserved",
      paymentStatus: "Pending",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
    });
  }
};



exports.getMyBookings = async(req,res)=>{
    try{

        const userId = req.user.id;

        const bookings = await Booking.find({ user:userId })
        .populate("show");

         return res.status(200).json({
    success:true,
    bookings
   });

    }catch(error){
       console.log("❌ ERROR IN createBooking:", error); // 🔥 ADD THIS


         return res.status(500).json({
    success:false,
    message:"Error fetching bookings"
   });

   
    }
}

exports.getSeatLayout = async(req,res) =>{
  try{

    const { showId } = req.params;

    const show = await Show.findById(showId);

    const rows = ["A","B","C","D"];
    const seats = [];

    for(let row of rows){
      for(let i = 1;i<=10;i++){
        const seatId = `${row}${i}`;

        const key = `show:${showId}:seat:${seatId}`;
        const lock = await redisClient.get(key);

        let status = "AVAILABLE";

        if(show.bookedSeats.includes(seatId)){
          status = "Booked";

        }else if(lock){
          status = "LOCKED";
        }

        seats.push({
          id: seatId,
          row,
          number: i,
          status,
        })
      }
    }
    return res.json({ seats });


  }catch(error){

    console.log(error);

  }
}

exports.confirmBooking = async(req,res) => {
    try{

        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }

        if (booking.bookingStatus === "Confirmed") {
            return res.status(400).json({
                success: false,
                message: "Booking already confirmed"
            });
        }

        if (booking.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Booking expired"
            });
        }

        const show = await Show.findById(booking.show);

        // ✅ Add seats to DB
        show.bookedSeats = [
            ...new Set([...show.bookedSeats, ...booking.seats])
        ];
        await show.save();

        // ✅ Remove Redis locks
        for(const seat of booking.seats){
            const key = `show:${booking.show}:seat:${seat}`;
            await redisClient.del(key);
        }

        // ✅ Update booking
        booking.bookingStatus = "Confirmed";
        booking.paymentStatus = "Success";
        await booking.save();

        // 🔥🔥 ADD THIS HERE 🔥🔥
        global.io.to(booking.show.toString()).emit("seat_booked", {
            seats: booking.seats
        });

        return res.status(200).json({
            success:true,
            message:"Booking confirmed"
        });

    }catch(error){
        console.log("❌ ERROR IN confirmBooking:", error);

        return res.status(500).json({
            success:false,
            message:"Error confirming booking"
        });
    }
}

exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("show");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.log("GET BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching booking",
    });
  }
};

