const Venue = require("../models/Venue");
const City = require("../models/City");

// ==============================
// 1. CREATE VENUE
// ==============================
exports.createVenue = async (req, res) => {
  try {
    const {
      name,
      city,
      type,
      street,
      area,
      landmark,
      pincode,
      amenities,
    } = req.body;

    // ✅ validate city
    const cityExists = await City.findById(city);
    if (!cityExists) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // ✅ prevent duplicate venue (important)
    const existingVenue = await Venue.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      city,
    });

    if (existingVenue) {
      return res.status(400).json({
        success: false,
        message: "Venue already exists in this city",
      });
    }

    const venue = await Venue.create({
      name,
      city,
      type,
      street,
      area,
      landmark,
      pincode,
      amenities,
    });

    return res.status(201).json({
      success: true,
      message: "Venue created successfully",
      data: venue,
    });

  } catch (error) {
    console.log("CREATE VENUE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating venue",
    });
  }
};

// ==============================
// 2. GET VENUES BY CITY
// ==============================
exports.getVenueByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const venues = await Venue.find({
      city: cityId,
      isActive: true,
    }).populate("city"); // ✅ useful for frontend

    return res.status(200).json({
      success: true,
      data: venues,
    });

  } catch (error) {
    console.log("GET VENUES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching venues",
    });
  }
};

// ==============================
// 3. GET VENUE BY ID
// ==============================
exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id).populate("city");

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: venue,
    });

  } catch (error) {
    console.log("GET VENUE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching venue",
    });
  }
};