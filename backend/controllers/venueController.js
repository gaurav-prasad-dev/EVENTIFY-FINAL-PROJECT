// controllers/venueController.js

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

    // ==============================
    // VALIDATION
    // ==============================
    if (
      !name ||
      !city 
     
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // ✅ CITY EXISTS
    const cityExists = await City.findById(city);

    if (!cityExists) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // ✅ PREVENT DUPLICATE VENUES
    const existingVenue = await Venue.findOne({
      name: {
        $regex: new RegExp(`^${name}$`, "i"),
      },
      city,
    });

    if (existingVenue) {
      return res.status(400).json({
        success: false,
        message: "Venue already exists in this city",
      });
    }

    // ==============================
    // CREATE VENUE
    // ==============================
    const venue = await Venue.create({
      name: name.trim(),
      city: cityExists._id,
      type,
      street: street.trim()||"",
      area: area.trim()||"",
      landmark: landmark || "",
      pincode,
      amenities: amenities || [],

      // 🔥 ORGANIZER INFO
      createdBy: req.user.id,

      // 🔥 APPROVAL FLOW
      status: "pending",

      // 🔥 ACTIVE FLAG
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Venue submitted for admin approval",
      data: venue,
    });

  } catch (error) {
    console.log("CREATE VENUE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error creating venue",
    });
  }
};

// ==============================
// 2. GET VENUES BY CITY
// ==============================
exports.getVenueByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    // ✅ VALIDATE CITY
    const cityExists = await City.findById(cityId);

    if (!cityExists) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // ✅ FETCH VENUES
    const venues = await Venue.find({
      city: cityId,
      isActive: true,
      status: "approved",
    }).populate("city");

    return res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });

  } catch (error) {
    console.log("GET VENUES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching venues",
    });
  }
};

// ==============================
// 3. GET VENUE BY ID
// ==============================
exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id)
      .populate("city")
      .populate("createdBy", "name email");

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
      message: error.message || "Error fetching venue",
    });
  }
};

// ==============================
// 4. GET APPROVED VENUES
// ==============================
exports.getApprovedVenues = async (req, res) => {
  try {
    const venues = await Venue.find({
      status: "approved",
      isActive: true,
    }).populate("city");

    return res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });

  } catch (error) {
    console.log(
      "GET APPROVED VENUES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Error fetching approved venues",
    });
  }
};