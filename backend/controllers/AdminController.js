const User = require("../models/User");
const Show = require("../models/Show");
const City = require("../models/City");
const Booking = require("../models/BookingSchema"); // KEEP ONLY ONE
// const redisClient = require("../config/redis");
// const crypto = require("crypto");
// const { lockSeatsLua } = require("../utils/redisScripts");

const Venue = require("../models/Venue");
const Content = require("../models/Content");
const Screen = require("../models/Screen");

// ================= ADMIN =================

exports.getPendingOrganizers = async (req, res) => {
  try {
    const users = await User.find({
      role: "organizer",
      isApproved: false,
    });

    return res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching pending organizers",
    });
  }
};

exports.approveOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({
        success: false,
        message: "User is not an organizer",
      });
    }

    user.isApproved = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Organizer approved successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error approving organizer",
    });
  }
};

// REJECT ORGANIZER
exports.rejectOrganizer = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({
        success: false,
        message: "User is not organizer",
      });
    }

    user.isApproved = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Organizer rejected",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error rejecting organizer",
    });

  }
};


exports.getAllShows = async (req, res) => {
  try {
    const { city, date } = req.query;

    let query = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.showDate = { $gte: start, $lte: end };
    }

    let shows = await Show.find(query)
      .populate({
        path: "screen",
        populate: {
          path: "venue",
          populate: { path: "city" },
        },
      })
      .sort({ startTime: 1 });

    if (city) {
      shows = shows.filter((show) => {
        const venueCity = show.screen?.venue?.city?.name;
        return venueCity?.toLowerCase() === city.toLowerCase();
      });
    }

    return res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching shows",
    });
  }
};

exports.deleteAnyShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    await show.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Show deleted by admin",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting show",
    });
  }
};




exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching cities",
    });
  }
};




exports.getRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { paymentStatus: "Success" };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const bookings = await Booking.find(filter);

    let totalRevenue = 0;

    bookings.forEach(b => {
      totalRevenue += b.totalAmount;
    });

    return res.status(200).json({
      success: true,
      totalRevenue,
      totalBookings: bookings.length,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error calculating revenue",
    });
  }
};



exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrganizers = await User.countDocuments({ role: "organizer" });
    const pendingOrganizers = await User.countDocuments({
      role: "organizer",
      isApproved: false,
    });

    const totalCities = await City.countDocuments();
    const totalShows = await Show.countDocuments();

    const bookings = await Booking.find({ paymentStatus: "Success" });

    let totalRevenue = 0;
    bookings.forEach(b => totalRevenue += b.totalAmount);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrganizers,
        pendingOrganizers,
        totalCities,
        totalShows,
        totalBookings: bookings.length,
        totalRevenue,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching admin stats",
    });
  }
};

exports.getPendingVenues = async (req, res) => {
  const venues = await Venue.find({ status: "pending" })
    .populate("city")
    .populate("createdBy", "name email");

  res.json({ success: true, data: venues });
};


exports.updateVenueStatus = async (req, res) => {
  const { status } = req.body; // approved / rejected

  const venue = await Venue.findById(req.params.id);

  if (!venue) {
    return res.status(404).json({ success: false });
  }

  venue.status = status;
  await venue.save();

  res.json({
    success: true,
    message: `Venue ${status}`,
    data: venue,
  });
};

// ================= USERS =================

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error fetching users",
    });

  }
};


// BLOCK USER
exports.blockUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error blocking user",
    });

  }
};


// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error unblocking user",
    });

  }
};

exports.getAllTransactions = async (req, res) => {
  try {

    const bookings = await Booking.find({
      paymentStatus: "Success",
    })
      .populate("user", "name email")
      .populate("show")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    });

  }
};

// ================= ANALYTICS =================

exports.getRevenueTrends = async (req, res) => {
  try {

    const bookings = await Booking.find({
      paymentStatus: "Success",
    });

    const trends = {};

    bookings.forEach((booking) => {

      const date = booking.createdAt
        .toISOString()
        .split("T")[0];

      if (!trends[date]) {
        trends[date] = 0;
      }

      trends[date] += booking.totalAmount;

    });

    return res.status(200).json({
      success: true,
      data: trends,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error fetching revenue trends",
    });

  }
};

exports.getTopContent = async (req, res) => {
  try {

    const bookings = await Booking.find({
      paymentStatus: "Success",
    }).populate({
      path: "show",
      populate: {
        path: "contentId",
      },
    });

    const map = {};

    bookings.forEach((booking) => {

      const title =
        booking.show?.contentId?.title;

      if (!title) return;

      if (!map[title]) {
        map[title] = 0;
      }

      map[title] += booking.totalAmount;

    });

    return res.status(200).json({
      success: true,
      data: map,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error fetching top content",
    });

  }
};


exports.getAllVenues = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const venues = await Venue.find(filter)
      .populate("city")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const venueIds = venues.map((v) => v._id);
    const screens = await Screen.find({ venue: venueIds })
      .select("-seatLayout")
      .lean();

    const result = venues.map((v) => ({
      ...v,
      screens: screens.filter(
        (s) => s.venue?.toString() === v._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPendingVenues = async (req, res) => {
  try {
    const venues = await Venue.find({
      status: "pending",
    })
      .populate("city")
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      data: venues,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    venue.status = "approved";
    await venue.save();

    // Auto-provision default screens if venue doesn't have any
    const existingScreens = await Screen.find({ venue: venue._id });
    if (existingScreens.length === 0) {
      const rows = ["A", "B", "C", "D", "E", "F"];
      const genSeats = (count) => {
        const seats = [];
        let c = 0;
        for (let r of rows) {
          for (let i = 1; i <= 10; i++) {
            if (c >= count) break;
            seats.push({
              seatNumber: `${r}${i}`,
              row: r,
              category: r === "A" ? "Premium" : "Standard",
            });
            c++;
          }
        }
        return seats;
      };

      await Screen.create([
        {
          name: "Screen 1 - Audi 1 (Dolby Atmos)",
          venue: venue._id,
          totalSeats: 60,
          seatLayout: genSeats(60),
          features: ["Premium"],
          sections: [{ name: "Standard", capacity: 50 }, { name: "Premium", capacity: 10 }],
        },
        {
          name: "Screen 2 - Audi 2",
          venue: venue._id,
          totalSeats: 60,
          seatLayout: genSeats(60),
          features: ["Recliner"],
          sections: [{ name: "Standard", capacity: 50 }, { name: "Premium", capacity: 10 }],
        },
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Venue approved successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    venue.status = "rejected";
    await venue.save();

    return res.status(200).json({
      success: true,
      message: "Venue rejected",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// GET PENDING SHOWS
// =========================
exports.getPendingShows = async (req, res) => {
  try {
    const shows = await Show.find({
      approvalStatus: "pending",
    })
      .populate("screen")
      .populate("organizerId", "name email");

    return res.status(200).json({
      success: true,
      data: shows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// APPROVE SHOW
// =========================
exports.approveShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    show.approvalStatus = "approved";
    show.publishedStatus = "published";

    await show.save();

    return res.status(200).json({
      success: true,
      message: "Show approved successfully",
      data: show,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// REJECT SHOW
// =========================
exports.rejectShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    show.approvalStatus = "rejected";

    await show.save();

    return res.status(200).json({
      success: true,
      message: "Show rejected successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};