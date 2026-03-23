const crypto = require("crypto");
const Booking = require("../models/BookingSchema");
const Show = require("../models/Show");
const redisClient = require("../config/redis");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const razorpay = require("../config/razorpay");

exports.createPaymentOrder = async(req,res) =>{

    try{

        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);


        if(!booking){
        return res.status(404).json({
            success:false,
            message:"Booking not found"
        });
    }

    const options = {
        amount: booking.totalAmount*100,
        currency: "INR",
        receipt: booking._id.toString(),
        notes:{
bookingId: booking._id.toString()
}
    };

    const order = await razorpay.orders.create(options);

     return res.status(200).json({
        success:true,
        order
    });


    }catch(error){
        
         return res.status(500).json({
        success:false,
        message:"Payment order creation failed"
    });
    }
}

exports.razorpayWebhook = async (req, res) => {
  try {

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)   // raw body
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }
    
    const parsedBody = JSON.parse(req.body);

    const event = parsedBody.event;
    const payload = parsedBody.payload;

  
    if (event === "payment.captured") {

      const payment = payload.payment.entity;

      const bookingId = payment.notes.bookingId;

      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // ⭐ Idempotency check
      if (booking.paymentStatus === "Success") {
        return res.status(200).json({
          success: true,
          message: "Booking already confirmed",
        });
      }

      const show = await Show.findById(booking.show);

    show.bookedSeats = [
  ...new Set([...show.bookedSeats, ...booking.seats])
];
      await show.save();

      // remove redis lock
      for (const seat of booking.seats) {
        const key = `show:${booking.show}:seat:${seat}`;
        await redisClient.del(key);
      }

      // generate QR token
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

      booking.qrCode = qrCode;
      booking.paymentStatus = "Success";
      booking.bookingStatus = "Confirmed";

      await booking.save();
    
    
    global.io.to(booking.show.toString()).emit("seatbooked",{
      seats: booking.seats
    });
  }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};