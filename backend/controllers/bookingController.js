const Booking = require("../models/BookingSchema");
const Show = require("../models/Show");
const redisClient = require("../config/redis");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const QRCode = require("qrcode");

const jwt = require("jsonwebtoken");

exports.lockSeats = async(req,res) =>{
    try{

        const userId = req.user.id;
        const { showId, seats } = req.body;


        const lockDuration = 300; // 5 min

        for(const seat of seats){

            const key = `show:${showId}:seat:${seat}`;

            const result = await redisClient.set(
                key,
                userId,
                {
                    EX:lockDuration,
                    NX: true

                }
            )

                 if(!result){

                    for(const s of lockedSeats){
                        await redisClient.del(`show:${showId}:seat:${s}`);
                    }
            return res.status(400).json({
                success:false,
                message:`Seat ${seat} already locked`
            });
        }

        lockedSeats.push(seat);


    }

    
    global.io.to(showId).emit("seatLocked", {
  seats
    })
           
              return res.status(200).json({
        success:true,
        message:"Seats locked for 5 minutes"
    });

  

        
    }catch(error){

          return res.status(500).json({
        success:false,
        message:"Seat locking failed"
    });

    }
}


exports.createBooking = async(req,res) => {
    try{

        const userId = req.user.id;
        const { showId, seats } = req.body;


        const show = await Show.findById(showId);

        if(!show){
            return res.status(404).json({
      success:false,
      message:"Show not found"
     });

        }


        for(const seat of seats){

            const lockKey = `show:${showId}:seat:${seat}`;
            const lockOwner = await redisClient.get(lockKey);


      if (lockOwner !== userId) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat} not locked by this user`
        });
      }
        }

        const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat));
   if(alreadyBooked){
     return res.status(400).json({
      success:false,
      message:"Some seats already booked"
     });
    }

    const totalAmount = seats.length * show.basePrice;

    const booking = await Booking.create({
        user:userId,
        show:showId,
        seats,
        totalAmount,
        bookingStatus:"Reserved",
        paymentStatus:"Pending",
        expiresAt: new Date(Date.now() + 5*60*1000)

    });

    return res.status(201).json({
    success:true,
    booking
   });


    }catch(error){

        return res.status(500).json({
    success:false,
    message:"Error creating booking"
   });



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

  
    // avoid duplicates
    show.bookedSeats = [
      ...new Set([...show.bookedSeats, ...booking.seats])
    ];
   await show.save();

   for(const seat of booking.seats){

    const key = `show:${booking.show}:seat:${seat}`;

    await redisClient.del(key);

   }

   booking.bookingStatus = "Confirmed";
   booking.paymentStatus = "Success";

   await booking.save();

     return res.status(200).json({
     success:true,
     message:"Booking confirmed"
   });
    

    }catch(error){

           return res.status(500).json({
    success:false,
    message:"Error confirming booking"
   });


    }
}


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

         return res.status(500).json({
    success:false,
    message:"Error fetching bookings"
   });

   
    }
}




// exports.createPaymentOrder = async(req,res) =>{

//     try{

//         const { bookingId } = req.body;

//         const booking = await Booking.findById(bookingId);


//         if(!booking){
//         return res.status(404).json({
//             success:false,
//             message:"Booking not found"
//         });
//     }

//     const options = {
//         amount: booking.totalAmount*100,
//         currency: "INR",
//         receipt: booking._id.toString(),
//         notes:{
// bookingId: booking._id.toString()
// }
//     };

//     const order = await razorpay.orders.create(options);

//      return res.status(200).json({
//         success:true,
//         order
//     });


//     }catch(error){
        
//          return res.status(500).json({
//         success:false,
//         message:"Payment order creation failed"
//     });
//     }
// }


//because we are using web hook
// exports.verifyPayment = async(req,res) => {
//     try{

//         const{
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//             bookingId,
//         } = req.body;


//         const body = razorpay_order_id + "|" + razorpay_payment_id;


//         const expectedSignature = crypto
//         .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
//         .update(body)
//         .digest("hex");

//            if(expectedSignature !== razorpay_signature){
//         return res.status(400).json({
//             success:false,
//             message:"Payment verification failed"
//         });
//     }

//     const booking = await Booking.findById(bookingId)

//      if(!booking){
//         return res.status(404).json({
//             success:false,
//             message:"Booking not found"
//         });
//     }

//     const show = await Show.findById(booking.show);

//     //add seats permanently
//     show.bookedSeats.push(...bookin.seats);
//     await show.save();

//     // remove redis lock
//     for(const seat of booking.seats){
//         const key = `show:${booking.show}:seat:${seat}`;
//         await redisClient.del(key);
//     }

//     //generate qr ticket plain one

//     // const qrData = {
//     //     bookingId: booking._id,
//     //     showId: booking.show,
//     //     seats: booking.seats
//     // }

//     // const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

//     // booking.qrCode = qrCode;

//     // generate qr encrypted one

//     const token = jwt.sign(
//         {
//             bookingId: booking._id,
//             showId: booking.show,
//             seats: booking.seats,
//         },
//         process.env.QR_SECRET,
//         {
//             expiresIn:"24h"
//         }
//     );

//     const qrCode = await QRCode.toDataURL(token);

//     booking.qrCode = qrCode;


//     booking.paymentStatus = "Success";
//     booking.bookingStatus = "Confirmed";

//     await booking.save();

//      return res.status(200).json({
//         success:true,
//         message:"Payment successful and booking confirmed"
//     });



//     }catch(error){

//          return res.status(500).json({
//         success:false,
//         message:"Payment verification error"
//     });
        
//     }
// }





// we are using here atomiv locking in redis

// 6️⃣ What You Should Use in Your Project

// Use this combination:

// Redis connection
// Seat locking (SET NX)
// Create booking (check lock owner)
// Confirm booking (remove Redis lock)

// That is the correct production flow.

// User selects seats
        // ↓
// lockSeats API
//         ↓
// Seats locked in Redis
//         ↓
// createBooking API
//         ↓
// Booking created (Reserved)
//         ↓
// createPaymentOrder
//         ↓
// User pays via :contentReference[oaicite:1]{index=1}
//         ↓
// verifyPayment API
//         ↓
// Seats added to show.bookedSeats
//         ↓
// Redis locks removed
//         ↓
// Booking confirmed







// we are also using node-cron for automatic expiry of seat lock if payment not done etc


