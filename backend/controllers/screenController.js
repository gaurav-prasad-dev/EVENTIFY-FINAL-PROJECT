const Screen = require("../models/Screen");
const Venue = require("../models/Venue");

// Helper to generate standard seat layout
const generateDefaultSeats = (total = 60) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
  const seatsPerRow = 10;
  const seats = [];
  let count = 0;
  for (let r of rows) {
    for (let i = 1; i <= seatsPerRow && count < total; i++) {
      seats.push({
        seatNumber: `${r}${i}`,
        row: r,
        category: r === "A" ? "Premium" : "Standard",
      });
      count++;
    }
  }
  return seats;
};

exports.createScreen = async (req, res) => {
  try {
    const { name, venue, totalSeats = 60, seatLayout, sections, features } = req.body;

    const venueExists = await Venue.findById(venue);

    if (!venueExists) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const seatsCount = Number(totalSeats) || 60;
    const finalSeatLayout =
      Array.isArray(seatLayout) && seatLayout.length > 0
        ? seatLayout
        : generateDefaultSeats(seatsCount);

    const screen = await Screen.create({
      name: name.trim(),
      venue,
      totalSeats: seatsCount,
      seatLayout: finalSeatLayout,
      sections: sections || [
        { name: "Standard", capacity: seatsCount - 10 > 0 ? seatsCount - 10 : seatsCount },
        { name: "Premium", capacity: Math.min(10, seatsCount) },
      ],
      features: features || ["Premium"],
    });

    const populatedScreen = await Screen.findById(screen._id).populate({
      path: "venue",
      populate: { path: "city" },
    });

    return res.status(201).json({
      success: true,
      message: "Screen created successfully",
      screen: populatedScreen,
      data: populatedScreen,
    });
  } catch (error) {
    console.log("CREATE SCREEN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getScreenByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    const screens = await Screen.find({ venue: venueId })
      .populate({
        path: "venue",
        populate: { path: "city" },
      })
      .select("-seatLayout");

    return res.status(200).json({
      success: true,
      screens,
      data: screens,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching screens",
    });
  }
};

exports.getScreenById = async (req, res) => {
  try {
    const { id } = req.params;

    const screen = await Screen.findById(id).populate({
      path: "venue",
      populate: { path: "city" },
    });

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    return res.status(200).json({
      success: true,
      screen,
      data: screen,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET ALL SCREENS
// ==============================
exports.getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find()
      .populate({
        path: "venue",
        populate: { path: "city" },
      })
      .select("-seatLayout")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: screens.length,
      data: screens,
    });
  } catch (error) {
    console.log("GET ALL SCREENS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching screens",
    });
  }
};
