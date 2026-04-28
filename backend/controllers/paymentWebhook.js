const crypto = require("crypto");
const Booking = require("../models/BookingSchema");
const Show = require("../models/Show");
const redisClient = require("../config/redis");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const razorpay = require("../config/razorpay");


// ==============================
// 1. CREATE PAYMENT ORDER
// ==============================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }  


    // 🚨 ADD THIS BLOCK
    if (booking.expiresAt < new Date()) {
      booking.bookingStatus = "Cancelled";
      await booking.save();

      return res.status(400).json({
        success: false,
        message: "Booking expired",
      });
    }

    // prevent duplicate payment attempts
    if (booking.paymentStatus === "Success") {
      return res.status(400).json({
        success: false,
        message: "Booking already paid",
      });
    }

    const options = {
      amount: booking.totalAmount * 100, // paise
      currency: "INR",
      receipt: booking._id.toString(),
      notes: {
        bookingId: booking._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save orderId
    booking.orderId = order.id;
    await booking.save();

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (err) {
  console.error("🔥 FULL ORDER ERROR:", err); // 👈 IMPORTANT

  return res.status(500).json({
    success: false,
    message: err.message, // 👈 send real error
  });
}
};


exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // 🔐 STEP 1: Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 🔍 STEP 2: Get booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ STEP 3: Prevent duplicate
    if (booking.paymentStatus === "Success") {
      return res.status(200).json({
        success: true,
        message: "Already verified",
      });
    }

    // ✅ STEP 4: Mark seats booked
    await Show.findByIdAndUpdate(
      booking.show,
      {
        $addToSet: {
          bookedSeats: { $each: booking.seats },
        },
      }
    );

    // 🔓 STEP 5: Remove Redis locks
    const keys = booking.seats.map(
      (seat) => `show:${booking.show}:seat:${seat}`
    );
    await redisClient.del(...keys);

    // 🎟 STEP 6: Generate QR
    const token = jwt.sign(
      {
        bookingId: booking._id,
        showId: booking.show,
        seats: booking.seats,
      },
      process.env.QR_SECRET,
      { expiresIn: "24h" }
    );

    const qrCode = await QRCode.toDataURL(token);

    // ✅ STEP 7: Update booking
    booking.qrCode = qrCode;
    booking.paymentStatus = "Success";
    booking.bookingStatus = "Confirmed";
    booking.paymentId = razorpay_payment_id;
    booking.orderId = razorpay_order_id;

    await booking.save();

    // 🔥 STEP 8: SOCKET UPDATE
    global.io.to(booking.show.toString()).emit("seat_booked", {
      seats: booking.seats,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
     console.log("❌ VERIFY ERROR MESSAGE:", error.message);


    return res.status(500).json({
      success: false,
      message:  error.message || "Verification failed",

    });
  }
};



// ==============================
// 2. RAZORPAY WEBHOOK
// ==============================
// exports.razorpayWebhook = async (req, res) => {
 
//   try {
//     const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     const signature = req.headers["x-razorpay-signature"];

//     // ✅ IMPORTANT: use rawBody
//     const expectedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(req.rawBody)
//       .digest("hex");

//     if (expectedSignature !== signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid webhook signature",
//       });
//     }

//      console.log("🔥 WEBHOOK HIT");
//     const parsedBody = JSON.parse(req.rawBody.toString());

//     const event = parsedBody.event;
//     const payload = parsedBody.payload;

//     // ==========================
//     // PAYMENT SUCCESS
//     // ==========================
//     if (event === "payment.captured") {

//       const payment = payload.payment.entity;
//       const bookingId = payment.notes?.bookingId;

//       const booking = await Booking.findById(bookingId);

//       if (!booking) {
//         return res.status(404).json({
//           success: false,
//           message: "Booking not found",
//         });
//       }

//       // ✅ Idempotency check
//       if (booking.paymentStatus === "Success") {
//         return res.status(200).json({
//           success: true,
//           message: "Already processed",
//         });
//       }

//       // ✅ Mark seats as booked
//       await Show.findByIdAndUpdate(
//         booking.show,
//         {
//           $addToSet: {
//             bookedSeats: { $each: booking.seats },
//           },
//         }
//       );

//       // ✅ Remove Redis locks
//       const keys = booking.seats.map(
//         (seat) => `show:${booking.show}:seat:${seat}`
//       );
//       await redisClient.del(...keys);

//       // ✅ Generate QR
//       const token = jwt.sign(
//         {
//           bookingId: booking._id,
//           showId: booking.show,
//           seats: booking.seats,
//         },
//         process.env.QR_SECRET,
//         { expiresIn: "24h" }
//       );

//       const qrCode = await QRCode.toDataURL(token);

//       // ✅ Update booking
//       booking.qrCode = qrCode;
//       booking.paymentStatus = "Success";
//       booking.bookingStatus = "Confirmed";
//       booking.paymentId = payment.id;
//       booking.orderId = payment.order_id;

//       await booking.save();

//       // ✅ Emit socket event
//       global.io.to(booking.show.toString()).emit("seat_booked", {
//         seats: booking.seats,
//       });
//     }


//     // ==========================
//     // PAYMENT FAILED
//     // ==========================
//     if (event === "payment.failed") {

//       const payment = payload.payment.entity;
//       const bookingId = payment.notes?.bookingId;

//       const booking = await Booking.findById(bookingId);

//       if (booking) {
//         booking.paymentStatus = "Failed";
//         booking.bookingStatus = "Cancelled";

//         await booking.save();

//         // 🔓 Release seats
//         const keys = booking.seats.map(
//           (seat) => `show:${booking.show}:seat:${seat}`
//         );
//         await redisClient.del(...keys);

//         global.io.to(booking.show.toString()).emit("seat_locked", {
//           seats: booking.seats,
//         });
//       }
//     }

//     return res.status(200).json({ success: true });

//   } catch (error) {
//     console.log("❌ ERROR IN webhook:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Webhook processing failed",
//     });
//   }
// };
