// controllers/ticketController.js

const Booking = require("../models/BookingSchema");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");

// ======================================================
// 🎟️ SCAN QR TICKET
// ======================================================
exports.scanTicket = async (req, res) => {
  try {
    const { token } = req.body;

    // ✅ VALIDATION
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "QR token is required",
      });
    }

    // ✅ VERIFY JWT
    const decoded = jwt.verify(
      token,
      process.env.QR_SECRET
    );

    const bookingId = decoded.bookingId;

    // ✅ FIND + UPDATE (ATOMIC)
    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
        bookingStatus: "Confirmed",
        paymentStatus: "Success",
        ticketUsed: false,
      },
      {
        $set: {
          ticketUsed: true,
          scannedAt: new Date(),
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path: "show",
        populate: [
          { path: "contentId" },
          {
            path: "screen",
            populate: {
              path: "venue",
            },
          },
        ],
      })
      .populate("user", "name email");

    // ✅ INVALID / USED
    if (!booking) {
      return res.status(400).json({
        success: false,
        message:
          "Ticket invalid, already used, or booking not confirmed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entry allowed",
      data: booking,
    });

  } catch (error) {
    console.log("SCAN TICKET ERROR:", error);

    // JWT EXPIRED
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "QR ticket expired",
      });
    }

    // JWT INVALID
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid QR ticket",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error scanning ticket",
    });
  }
};

// ======================================================
// 📄 DOWNLOAD PDF TICKET
// ======================================================
exports.downloadTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // ✅ VALIDATION
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID required",
      });
    }

    // ✅ FETCH BOOKING
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: [
          { path: "contentId" },
          {
            path: "screen",
            populate: {
              path: "venue",
            },
          },
        ],
      })
      .populate("user", "name email");

    // ✅ NOT FOUND
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ SECURITY CHECK
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ BOOKING STATUS CHECK
    if (
      booking.bookingStatus !== "Confirmed" ||
      booking.paymentStatus !== "Success"
    ) {
      return res.status(400).json({
        success: false,
        message: "Ticket not confirmed yet",
      });
    }

    // ✅ QR CHECK
    if (!booking.qrCode) {
      return res.status(400).json({
        success: false,
        message: "QR Code not available",
      });
    }

    // ======================================================
    // 📄 PDF DOCUMENT
    // ======================================================
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket-${booking._id}.pdf`
    );

    doc.pipe(res);

    // ======================================================
    // 🎬 HEADER
    // ======================================================
    doc
      .fontSize(26)
      .text("EVENTIFY", {
        align: "center",
      });

    doc.moveDown(0.5);

    const ticketTitle =
      booking.show.contentType === "event"
        ? "EVENT TICKET"
        : "MOVIE TICKET";

    doc
      .fontSize(20)
      .text(ticketTitle, {
        align: "center",
      });

    doc.moveDown(2);

    // ======================================================
    // 🎟️ BOOKING DETAILS
    // ======================================================
    doc.fontSize(14);

    const contentName =
      booking.show.contentId?.title ||
      booking.show.contentId?.name ||
      "Movie";

    doc.text(`Booking ID: ${booking._id}`);
    doc.text(`Customer: ${booking.user.name}`);
    doc.text(`Email: ${booking.user.email}`);
    doc.text(`Movie/Event: ${contentName}`);
    doc.text(
      `Venue: ${booking.show.screen?.venue?.name || "N/A"}`
    );
    doc.text(
      `Screen: ${booking.show.screen?.name || "N/A"}`
    );
    doc.text(`Seats: ${booking.seats.join(", ")}`);
    doc.text(`Total Paid: ₹${booking.totalAmount}`);

    doc.text(
      `Show Time: ${new Date(
        booking.show.startTime
      ).toLocaleString("en-IN")}`
    );

    doc.moveDown(2);

    // ======================================================
    // 🔳 QR CODE
    // ======================================================
    doc
      .fontSize(16)
      .text("ENTRY QR CODE", {
        align: "center",
      });

    doc.moveDown();

    const base64Data = booking.qrCode.replace(
      /^data:image\/png;base64,/,
      ""
    );

    const qrBuffer = Buffer.from(
      base64Data,
      "base64"
    );

    doc.image(qrBuffer, {
      fit: [180, 180],
      align: "center",
      valign: "center",
    });

    doc.moveDown(2);

    // ======================================================
    // 📝 FOOTER
    // ======================================================
    doc
      .fontSize(10)
      .text(
        "Please carry a valid government ID proof along with this ticket.",
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        "This QR code is valid for one-time entry only.",
        {
          align: "center",
        }
      );

    doc.end();

  } catch (error) {
    console.log(
      "DOWNLOAD TICKET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Ticket download failed",
    });
  }
};