const Show = require("../models/Show");
const Booking = require("../models/BookingSchema");

// ==============================
// 🔧 HELPERS
// ==============================
const getOrganizerId = (req) => req.user?.id;

const isValidOwnership = (show, userId) =>
  show.organizerId.toString() === userId;

// optional helper (fix missing function)
const getTimeCategory = (date) => {
  const hour = new Date(date).getHours();
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
};

// ==============================
// 🎬 GET MY SHOWS
// ==============================
exports.getMyShows = async (req, res) => {
  try {
    const organizerId = getOrganizerId(req);
console.log("ORG ID:", organizerId);
    const shows = await Show.find({ organizerId })
    .populate("content")
    .populate({
        path: "screen",
        populate: {
          path: "venue",
          populate: { path: "city" },
        },
      })
      .sort({ showDate: -1, startTime: -1 });

    return res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    console.log("GET MY SHOWS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your shows",
    });
  }
};

// ==============================
// 🗑 DELETE SHOW (OWNER ONLY)
// ==============================
exports.deleteMyShow = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = getOrganizerId(req);

    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    if (!isValidOwnership(show, organizerId)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own shows",
      });
    }

    await show.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    console.log("DELETE SHOW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting show",
    });
  }
};

// ==============================
// ✏️ UPDATE SHOW
// ==============================

exports.updateMyShow = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      startTime,
      endTime,
      features,
      pricing,
      publishedStatus,
    } = req.body;

    const organizerId = getOrganizerId(req);

    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    if (!isValidOwnership(show, organizerId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ FIXED
    if (startTime) {
      show.startTime = startTime;

      const hour = Number(startTime.split(":")[0]);

      if (hour < 12) {
        show.timeCategory = "morning";
      } else if (hour < 17) {
        show.timeCategory = "afternoon";
      } else if (hour < 21) {
        show.timeCategory = "evening";
      } else {
        show.timeCategory = "night";
      }
    }

    // ✅ FIXED
    if (endTime) {
      show.endTime = endTime;
    }

    if (features) {
      show.features = features;
    }

    if (pricing) {
      show.pricing = pricing;
    }

    // ✅ NEW
    if (publishedStatus) {
      show.publishedStatus = publishedStatus;
    }

    await show.save();

    return res.status(200).json({
      success: true,
      message: "Show updated successfully",
      data: show,
    });

  } catch (error) {
    console.log("UPDATE SHOW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating show",
    });
  }
};

// ==============================
// ✏️ UPDATE SHOW
// ==============================

// ==============================
// 📊 ORGANIZER DASHBOARD
// ==============================
exports.getOrganizerDashboard = async (req, res) => {
  try {
    const organizerId = getOrganizerId(req);

    const shows = await Show.find({ organizerId }).select("_id showDate");
    const showIds = shows.map((s) => s._id);

    const bookings = await Booking.find({
      show: { $in: showIds },
      paymentStatus: "Success",
    }).select("totalAmount show createdAt");

    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    const now = new Date();
    const activeShows = shows.filter(
      (s) => new Date(s.showDate) >= now
    );

    return res.status(200).json({
      success: true,
      data: {
        totalShows: shows.length,
        activeShows: activeShows.length,
        totalBookings: bookings.length,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log("ORGANIZER DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
    });
  }
};

// ==============================
// 🧾 RECENT BOOKINGS
// ==============================
exports.getOrganizerRecentBookings = async (req, res) => {
  try {
    const organizerId = getOrganizerId(req);

    const shows = await Show.find({ organizerId }).select("_id");
    const showIds = shows.map((s) => s._id);

    const bookings = await Booking.find({
      show: { $in: showIds },
    })
      .populate("user", "name email")
      .populate("show")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.log("RECENT BOOKINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching recent bookings",
    });
  }
};

// ==============================
// 📅 UPCOMING SHOWS
// ==============================
exports.getOrganizerUpcomingShows = async (req, res) => {
  try {
    const organizerId = getOrganizerId(req);
    const now = new Date();

    const shows = await Show.find({
      organizerId,
      showDate: { $gte: now },
    })
      .populate({
        path: "screen",
        populate: {
          path: "venue",
          populate: { path: "city" },
        },
      })
      .sort({ showDate: 1 });

    return res.status(200).json({
      success: true,
      data: shows,
    });
  } catch (error) {
    console.log("UPCOMING SHOWS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching upcoming shows",
    });
  }
};

exports.getMyVenues = async (req, res) => {
  try {
    const venues = await Venue.find({
      createdBy: req.user.id,
    }).populate("city");

    res.json({ success: true, data: venues });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.updateMyVenue = async (req, res) => {
  const venue = await Venue.findById(req.params.id);

  if (!venue) return res.status(404).json({ success: false });

  if (venue.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ success: false });
  }

  Object.assign(venue, req.body);
  venue.status = "pending"; // 🔥 re-approval required

  await venue.save();

  res.json({ success: true, data: venue });
};

exports.publishShow = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    if (show.organizerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    show.publishedStatus = "published";

    await show.save();

    return res.status(200).json({
      success: true,
      message: "Show published successfully",
      data: show,
    });

  } catch (error) {
    console.log("PUBLISH SHOW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error publishing show",
    });
  }
};


exports.getRevenuePerShow = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const shows = await Show.find({
      organizerId,
    }).populate("screen");

    const data = [];

    for (const show of shows) {

      const bookings = await Booking.find({
        show: show._id,
        paymentStatus: "Success",
      });

      const revenue = bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      );

      const ticketsSold = bookings.reduce(
        (sum, booking) => sum + booking.seats.length,
        0
      );

      const occupancy =
        show.screen.totalSeats > 0
          ? (
              (ticketsSold / show.screen.totalSeats) *
              100
            ).toFixed(2)
          : 0;

      data.push({
        showId: show._id,
        date: show.showDate,
        revenue,
        ticketsSold,
        occupancy,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.log("REVENUE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching revenue analytics",
    });
  }
};