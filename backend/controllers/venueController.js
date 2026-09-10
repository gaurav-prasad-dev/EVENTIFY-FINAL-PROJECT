// controllers/venueController.js

const Venue = require("../models/Venue");
const City = require("../models/City");
const Screen = require("../models/Screen");

// Helper to generate default seat layout
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

// ==============================
// 1. CREATE VENUE
// ==============================
exports.createVenue = async (req, res) => {
  try {
    const {
      name,
      city,
      type = "Theatre",
      street,
      area,
      landmark,
      pincode,
      amenities,
      screens,
      screenCount,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================
    if (!name || !city) {
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
        $regex: new RegExp(`^${name.trim()}$`, "i"),
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
      street: street?.trim() || "",
      area: area?.trim() || "",
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

    // ==============================
    // CREATE SCREENS FOR VENUE
    // ==============================
    let screensToCreate = [];

    if (Array.isArray(screens) && screens.length > 0) {
      screensToCreate = screens.map((s, index) => {
        const seats = Number(s.totalSeats) || 60;
        return {
          name: (s.name && s.name.trim()) || `Screen ${index + 1} - Audi ${index + 1}`,
          venue: venue._id,
          totalSeats: seats,
          seatLayout: generateDefaultSeats(seats),
          features: Array.isArray(s.features) && s.features.length > 0 ? s.features : ["Premium"],
          sections: [
            { name: "Standard", capacity: seats - 10 > 0 ? seats - 10 : seats },
            { name: "Premium", capacity: Math.min(10, seats) },
          ],
        };
      });
    } else {
      // Default fallback: provision at least 1 or 2 screens
      const count = Math.max(1, Number(screenCount) || (type === "Theatre" ? 2 : 1));
      for (let i = 1; i <= count; i++) {
        const seats = 60;
        screensToCreate.push({
          name: `Screen ${i} - Audi ${i}${i === 1 ? " (Dolby Atmos)" : ""}`,
          venue: venue._id,
          totalSeats: seats,
          seatLayout: generateDefaultSeats(seats),
          features: i === 1 ? ["Premium"] : ["Recliner"],
          sections: [
            { name: "Standard", capacity: 50 },
            { name: "Premium", capacity: 10 },
          ],
        });
      }
    }

    const createdScreens = await Screen.insertMany(screensToCreate);

    return res.status(201).json({
      success: true,
      message: `Venue and ${createdScreens.length} screen(s) created successfully`,
      data: {
        venue,
        screens: createdScreens,
      },
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