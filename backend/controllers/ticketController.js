const Booking = require("../models/BookingSchema");
const jwt = require("jsonwebtoken");

const PDFDocument = require("pdfkit");
// exports.scanTicket = async(req,res) =>{
//     try{

//         const { token } = req.body;

//         const decoded = jwt.verify(token,process.env.QR_SECRET);

//         const bookingId = decoded.bookingId;

        

//         const booking = await Booking.findById(bookingId)
//         .populate({
//             path:"show",
//             populate:{
//                 path:"content"
//             }
//         });




// if(!booking){
//  return res.status(404).json({
//   success:false,
//   message:"Ticket not found"
//  });
// }

// if(booking.bookingStatus !== "Confirmed"){
//  return res.status(400).json({
//   success:false,
//   message:"Ticket not valid"
//  });
// }

// if(booking.ticketUsed){
//  return res.status(400).json({
//   success:false,
//   message:"Ticket already used"
//  });
// }


// booking.ticketUsed = true;
// await booking.save();

// return res.status(200).json({
//  success:true,
//  message:"Entry allowed",
//  booking
// });

//     }catch(error){

//         return res.status(400).json({
//  success:false,
//  message:"Invalid qr ticket"
// });
        

//     }
// }

exports.scanTicket = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.QR_SECRET);
    const bookingId = decoded.bookingId;

    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
        bookingStatus: "Confirmed",
        ticketUsed: false
      },
      { ticketUsed: true },
      { new: true }
    ).populate({
      path: "show",
      populate: { path: "content" }
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already used ticket"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entry allowed",
      booking
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid QR ticket"
    });
  }
};






exports.downloadTicket = async(req,res)=>{
    try{

        const { bookingId } = req.params;


        const booking = await Booking.findById(bookingId)
      .populate({
  path: "show",
  populate: [
    { path: "content" },
    {
      path: "screen",
      populate: {
        path: "venue"
      }
    }
  ]
});


           if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

      if (booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Ticket not confirmed yet"
      });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=ticket-${booking._id}.pdf`
    );


    doc.pipe(res);

    doc.fontSize(22).text("Movie Ticket", { align: "center"});
        doc.moveDown();

        doc.fontSize(14).text(`Booking ID: ${booking._id}`);
        doc.text(`Movie/Event: ${booking.show.content.title}`);
        doc.text(`Venue: ${booking.show.screen.venue.name}`);
        doc.text(`Seats: ${booking.seats.join(", ")}`);
        doc.text(`Total Paid: ₹${booking.totalAmount}  `);


        doc.moveDown();
        doc.text("QR Code");

        if (!booking.qrCode) {
  return res.status(400).json({
    success: false,
    message: "QR Code not available"
  });
}
        const qrBuffer = Buffer.from(qrBase64, "base64");

        doc.image(qrBuffer,{
            fit:[200,200],
            align:"center"
        });

        doc.end();
        
    
    }catch(error){

        return res.status(500).json({
            success:false,
            message:"Ticket Download failed"
        });
        
        

    }
}







// //OTP login
// Google login
// Profile system
// Cities
// Venues
// Content (movie/event)
// Shows
// Seat locking (Redis)
// Booking system
// Payment with :contentReference[oaicite:1]{index=1}
// Booking expiry
// QR ticket generation
// Secure JWT QR ticket
// Ticket scanning