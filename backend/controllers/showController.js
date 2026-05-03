// controllers/showController.js
const mongoose = require("mongoose");
const Show = require("../models/Show");
const Screen = require("../models/Screen");
const City = require("../models/City");
const Content = require("../models/Content");
const { TrustProductsChannelEndpointAssignmentContextImpl } = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsChannelEndpointAssignment");

// =======================================================
// CREATE SINGLE SHOW
// =======================================================
exports.createSingleShow = async (req, res) => {
  try {
    const {
      content,
      screenId,
      date,
      startTime,
      endTime,
      basePrice,
      features,
      publishedStatus,
    } = req.body;

    // ================= VALIDATION =================
    if (!content || !screenId || !date || !startTime || !endTime || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ================= CONTENT VALIDATION =================
    const contentExists = await Content.findById(content);

    if (!contentExists) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // ================= SCREEN =================
    const screenData = await Screen.findById(screenId).populate({
      path: "venue",
      populate: { path: "city" },
    });

    if (!screenData) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    if (screenData.venue.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Venue not approved by admin",
      });
    }


const cityId = new mongoose.Types.ObjectId(req.body.city);
    // ================= DATE/TIME =================
    const showDate = new Date(date);
    showDate.setHours(0, 0, 0, 0);

    const start = new Date(date);
    const [sh, sm] = startTime.split(":");
    start.setHours(+sh, +sm, 0, 0);

    const end = new Date(date);
    const [eh, em] = endTime.split(":");
    end.setHours(+eh, +em, 0, 0);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // ================= OVERLAP CHECK =================
   const overlappingShow = await Show.findOne({
  screen: screenId,
  showDate,
  startTime,
  status: "Active",
});

    if (overlappingShow) {
      return res.status(400).json({
        success: false,
        message: "Another show already exists during this time",
      });
    }

    // ================= CREATE SHOW =================
    const show = await Show.create({
      content,
      screen: screenId,
      city: cityId,
      showDate,
      startTime,
      endTime,
      basePrice,
      features: features || screenData.features || [],
      organizerId: req.user._id,
      publishedStatus:   publishedStatus || "draft",
       approvalStatus: "approved", // optional (if admin flow skipped)
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Show created successfully",
      data: show,
    });

  } catch (error) {
    console.log("CREATE SHOW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================================
// GET SHOWS
// =======================================================
// exports.getShows = async (req, res) => {
//   try {
//     const { city, date } = req.query;

//     if (!city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "city and date required",
//       });
//     }

//     const selectedDate = new Date(date);
//     selectedDate.setHours(0, 0, 0, 0);

//     const start = new Date(selectedDate);
//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     const cityDoc = await City.findOne({
//       name: { $regex: new RegExp(`^${city}$`, "i") },
//     });

//     console.log("CITY FROM FRONTEND:", city);
// console.log("CITY DOC FOUND:", cityDoc);

//     if (!cityDoc) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//       });
//     }

//     const shows = await Show.find({
//       city: cityDoc._id,
//       showDate: { $gte: start, $lte: end },
//       status: "Active",
//       // approvalStatus: "approved",
//       //  publishedStatus: "published",
//     })
//       .populate({
//         path: "screen",
//         select: "name venue",
//         populate: {
//           path: "venue",
//           select: "name city",
//           populate: {
//             path: "city",
//             select: "name",
//           },
//         },
//       })
//       .populate({
//         path: "content",
//         select: "title poster type",
//       })
//       .sort({ startTime: 1 });

//     const grouped = {};

//     shows.forEach((show) => {
//       const venue = show.screen?.venue;
//       const screen = show.screen;

//       if (!venue || !screen) return;

//       const venueId = venue._id.toString();

//       if (!grouped[venueId]) {
//         grouped[venueId] = {
//           theatreId: venue._id,
//           theatreName: venue.name,
//           city: venue.city?.name,
//           shows: [],
//         };
//       }

//       grouped[venueId].shows.push({
//         showId: show._id,
//         screenName: screen.name,
//         startTime: show.startTime,
//         endTime: show.endTime,
//         date: show.showDate,
//         basePrice: show.basePrice,
//         features: show.features || [],
//         content: show.content, // 🔥 now unified
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       count: shows.length,
//       data: Object.values(grouped),
//     });

//     const all = await Show.find({});

//   } catch (error) {
//     console.log("GET SHOWS ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.getShows = async (req, res) => {
//   try {
//     const { movieId, city, date } = req.query;

//     if (!movieId || !city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "movieId, city, date required",
//       });
//     }

//     // 📅 Date range
//     const selectedDate = new Date(date);
//     selectedDate.setHours(0, 0, 0, 0);

//     const start = new Date(selectedDate);
//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     // 🏙️ City lookup
//     const cityDoc = await City.findOne({
//       name: { $regex: new RegExp(`^${city}$`, "i") },
//     });

//     if (!cityDoc) {
//       return res.json({
//         success: true,
//         data: [],
//       });
//     }

//     // 🎬 Fetch shows


//     const shows = await Show.find({
//       city: cityDoc._id,
//       showDate: { $gte: start, $lte: end },
//       status: "Active",
//     })
//       .populate({
//         path: "screen",
//         populate: {
//           path: "venue",
//           populate: { path: "city" },
//         },
//       })
//       .sort({ startTime: 1 });

//       console.log("CITY DOC:", cityDoc);
// console.log("DATE RANGE:", start, end);
// console.log("SHOWS FOUND:", shows.length);

//     // 🧠 GROUP (OLD FORMAT)
//     const grouped = {};

//     shows.forEach((show) => {
//       const venue = show.screen?.venue;
//       const screen = show.screen;

//       if (!venue || !screen) return;

//       const venueId = venue._id.toString();

//       if (!grouped[venueId]) {
//         grouped[venueId] = {
//           theatreName: venue.name,
//           shows: [],
//         };
//       }

//       grouped[venueId].shows.push({
//         showId: show._id,
//         time: show.startTime,   // IMPORTANT
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       data: Object.values(grouped),
//     });

//   } catch (error) {
//     console.log("GET SHOWS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shows",
//     });
//   }
// };

// exports.getShows = async (req, res) => {
//   try {
//     const { movieId, city, date } = req.query;

//     if (!movieId || !city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "movieId, city, date required",
//       });
//     }

//     // 📅 Normalize date
//     const selectedDate = new Date(date);
//     selectedDate.setHours(0, 0, 0, 0);

//     const start = new Date(selectedDate);
//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     // 🏙️ City (IMPORTANT FIX)
//     const cityDoc = await City.findOne({
//       name: { $regex: new RegExp(`^${city}$`, "i") },
//     });

//     if (!cityDoc) {
//       return res.json({ success: true, data: [] });
//     }

//     // 🎬 FIXED QUERY (IMPORTANT)
//     const shows = await Show.find({
//       city: cityDoc._id,        // MUST BE OBJECTID
//       showDate: { $gte: start, $lte: end },
//       status: "Active",
//       approvalStatus: "approved",
//     })
//       .populate({
//         path: "screen",
//         populate: {
//           path: "venue",
//           populate: { path: "city" },
//         },
//       })
//       .sort({ startTime: 1 });

//     // 🧠 GROUPING (same as old working UI)
//     const grouped = {};

//     shows.forEach((show) => {
//       const venue = show.screen?.venue;
//       const screen = show.screen;

//       if (!venue || !screen) return;

//       const venueId = venue._id.toString();

//       if (!grouped[venueId]) {
//         grouped[venueId] = {
//           theatreName: venue.name,
//           shows: [],
//         };
//       }

//       grouped[venueId].shows.push({
//         showId: String(show._id),
//         time: show.startTime,
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       data: Object.values(grouped),
//     });

//   } catch (error) {
//     console.log("GET SHOWS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shows",
//     });
//   }
// };

// exports.getShows = async (req, res) => {
//   try {
//     const { contentId, city, date } = req.query;

//     if (!contentId || !city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "movieId, city, date required",
//       });
//     }

//     // 🔥 FIX 1: SAFE DATE HANDLING (no timezone shift)
//     const [year, month, day] = date.split("-");
//     const start = new Date(year, month - 1, day, 0, 0, 0);
//     const end = new Date(year, month - 1, day, 23, 59, 59);

//     // 🔥 FIX 2: CITY
//     const cityDoc = await City.findOne({
//       name: { $regex: new RegExp(`^${city}$`, "i") },
//     });

//     if (!cityDoc) {
//       return res.json({ success: true, data: [] });
//     }

//     // 🔥 FIX 3: INCLUDE CONTENT FILTER (IMPORTANT)
//     const shows = await Show.find({
//       content: contentId,   // 👈 THIS WAS MISSING
//       city: cityDoc._id,
//       showDate: { $gte: start, $lte: end },
//       status: "Active",
//       approvalStatus: "approved",
//     })
//       .populate({
//         path: "screen",
//         populate: {
//           path: "venue",
//         },
//       })
//       .sort({ startTime: 1 });

//     console.log("FOUND SHOWS:", shows.length);

//     // GROUPING
//     const grouped = {};

//     shows.forEach((show) => {
//       const venue = show.screen?.venue;
//       const screen = show.screen;

//       if (!venue || !screen) return;

//       const venueId = venue._id.toString();

//       if (!grouped[venueId]) {
//         grouped[venueId] = {
//           theatreName: venue.name,
//           shows: [],
//         };
//       }

//       grouped[venueId].shows.push({
//         showId: String(show._id),
//         time: show.startTime,
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       data: Object.values(grouped),
//     });

//     console.log({
//   movieId,
//   city,
//   date,
//   cityDoc: cityDoc?._id,
//   start,
//   end
// });
    

//   } catch (error) {
//     console.log("GET SHOWS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shows",
//     });
//   }
// };

// exports.getShows = async (req, res) => {
//   try {
//     const { contentId, city, date } = req.query;

//     if (!contentId || !city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "contentId, city, date required",
//       });
//     }

//     const selectedDate = new Date(date);
//     selectedDate.setHours(0, 0, 0, 0);

//     const start = new Date(selectedDate);
//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     // 🏙️ city lookup
//     const cityDoc = await City.findOne({
//       name: { $regex: new RegExp(`^${city}$`, "i") },
//     });

//     if (!cityDoc) {
//       return res.json({ success: true, data: [] });
//     }

//     // 🎬 MAIN QUERY (FIXED)
//     const shows = await Show.find({
//       content: contentId,        // ✅ correct
//       city: cityDoc._id,
//       showDate: { $gte: start, $lte: end },
//       status: "Active",
//     })
//       .populate({
//         path: "screen",
//         populate: {
//           path: "venue",
//           populate: { path: "city" },
//         },
//       })
//       .sort({ startTime: 1 });

//     // 🧠 group by theatre
//     const grouped = {};

//     shows.forEach((show) => {
//       const venue = show.screen?.venue;
//       const screen = show.screen;

//       if (!venue || !screen) return;

//       const venueId = venue._id.toString();

//       if (!grouped[venueId]) {
//         grouped[venueId] = {
//           theatreName: venue.name,
//           shows: [],
//         };
//       }

//       grouped[venueId].shows.push({
//         showId: show._id,
//         time: show.startTime,
//         screenName: screen.name,
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       data: Object.values(grouped),
//     });

//   } catch (error) {
//     console.log("GET SHOWS ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// =======================================================
// GET SHOW BY ID
// =======================================================
exports.getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findOne({
      _id: req.params.id,
      approvalStatus: "approved",
    })
      .populate({
        path: "screen",
        select: "name totalSeats seatLayout venue",
        populate: {
          path: "venue",
          select: "name address city",
        },
      })
      .populate({
        path: "content",
        select: "title poster description type",
      });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: show,
    });

  } catch (error) {
    console.log("GET SHOW BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getShowsByContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { date, cityId } = req.query;

    console.log("QUERY:", {
  contentId,
  date,
  cityId,
});

const start = new Date(`${date}T00:00:00.000+05:30`);
const end = new Date(`${date}T23:59:59.999+05:30`);
console.log("START:", start);
console.log("END:", end);
    const shows = await Show.aggregate([
      {
        $match: {
          content: new mongoose.Types.ObjectId(contentId),
          city:  new mongoose.Types.ObjectId(cityId),
        showDate: { $gte: start, $lte: end }, // ✅ FIXED
          status: "Active",
          approvalStatus: "approved",
          publishedStatus: "published",
        },
      },

      // 🎬 JOIN SCREEN
      {
        $lookup: {
          from: "screens",
          localField: "screen",
          foreignField: "_id",
          as: "screen",
        },
      },
      { $unwind: "$screen" },

      // 🏢 JOIN VENUE
      {
        $lookup: {
          from: "venues",
          localField: "screen.venue",
          foreignField: "_id",
          as: "venue",
        },
      },
      { $unwind: "$venue" },

      // 🎯 GROUP BY VENUE
      {
        $group: {
          _id: "$venue._id",
          venueName: { $first: "$venue.name" },
          shows: {
            $push: {
              showId: "$_id",
              startTime: "$startTime",
              endTime: "$endTime",
              screenFeatures: "$screen.features",
            },
          },
        },
      },

      {
        $sort: { venueName: 1 },
      },
    ]);

    console.log("FOUND SHOWS:", shows);

    res.json({
      success: true,
      data: shows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};