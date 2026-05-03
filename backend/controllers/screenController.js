const Screen = require("../models/Screen");
const Venue = require("../models/Venue");






exports.createScreen = async (req, res) => {
  try {
    const { name, venue, totalSeats, seatLayout, sections } = req.body;

    const venueExists = await Venue.findById(venue);

    if (!venueExists) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const screen = await Screen.create({
      name,
      venue,
      totalSeats,
      seatLayout,
      sections,
    });

    return res.status(201).json({
      success: true,
      message: "Screen created successfully",
      screen,
    });

  } 
   catch (error) {
  console.log("ERROR:", error); // 🔥 MUST ADD

  return res.status(500).json({
    success: false,
    message: error.message, // 🔥 show real error
  });
}
  };




exports.getScreenByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    const screens = await Screen.find({ venue: venueId });

    return res.status(200).json({
      success: true,
      screens,
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

    const screen = await Screen.findById(id).populate("venue");

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    return res.status(200).json({
      success: true,
      screen,
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
      .populate("venue") // optional but useful
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
