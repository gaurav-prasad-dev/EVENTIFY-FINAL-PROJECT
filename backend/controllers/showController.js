const Show = require("../models/Show");
const Content = require("../models/Content");
const Screen = require("../models/Screen");
const City = require("../models/City");
const Venue = require("../models/Venue");
const mongoose = require("mongoose");
const {  getAvailability } = require("../utils/availability");

const { getTimeCategory } = require("../utils/timeCategory");

exports.createShow = async (req, res) => {
  try {
    let { movieId, screen, showTimes, basePrice, features } = req.body;

    const screensArray = Array.isArray(screen) ? screen : [screen];
    const timesArray = Array.isArray(showTimes) ? showTimes : [showTimes];

    const createdShows = [];

    for (let screenId of screensArray) {

      const screenData = await Screen.findById(screenId).populate({
        path: "venue",
        populate: { path: "city" },
      });

      if (!screenData) continue;

      const cityId = screenData.venue.city._id;

      // 🔥 next 5 days
      for (let i = 0; i < 5; i++) {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + i);
        baseDate.setHours(0, 0, 0, 0);

    for (let time of timesArray) {

  const startTime = new Date(baseDate);
  const [sh, sm] = time.startTime.split(":");
  startTime.setHours(parseInt(sh), parseInt(sm), 0, 0);

  const endTime = new Date(baseDate);
  const [eh, em] = time.endTime.split(":");
  endTime.setHours(parseInt(eh), parseInt(em), 0, 0);

  const exists = await Show.findOne({
    movieId,
    screen: screenId,
    showDate: baseDate,
    startTime: {
      $gte: new Date(startTime.getTime() - 60000),
      $lte: new Date(startTime.getTime() + 60000),
    },
  });

  if (exists) continue;

  const show = await Show.create({
    movieId,
    screen: screenId,
    city: cityId,
    showDate: baseDate,
    startTime,
    endTime,
    basePrice,
    timeCategory: getTimeCategory(startTime), // ✅ FIXED
    features: features || screenData.features || [],
  });

  createdShows.push(show);
}
      }
    }

    return res.status(201).json({
      success: true,
      message: "Shows created for next 5 days",
      count: createdShows.length,
      data: createdShows,
    });

  } catch (error) {
    console.log("CREATE SHOW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.getShows = async (req, res) => {
//   try {
//     const { movieId, city, date, time, features } = req.query;

//     if (!movieId || !city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "movieId, city, date required",
//       });
//     }

//     // ✅ date range
//     const selectedDate = new Date(date + "T00:00:00");

//     const start = new Date(selectedDate);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     // ✅ query
//     const query = {
//       movieId: Number(movieId),
//       status: "Active",
//       showDate: { $gte: start, $lte: end },
//     };

//     // city filter
//     if (city) {
//       query.city = { $regex: new RegExp(`^${city}$`, "i") };
//     }

//     // time filter
//     if (time) {
//       query.timeCategory = time;
//     }

//     // feature filter
//     if (features) {
//       query.features = { $all: features.split(",") };
//     }

//     const shows = await Show.find(query)
//       .populate({
//         path: "screen",
//         populate: {
//           path: "venue",
//           populate: { path: "city" },
//         },
//       })
//       .sort({ startTime: 1 });

//     // ✅ grouping
//     const grouped = {};

//     shows.forEach((show) => {
//       const screen = show.screen;
//       const venue = screen?.venue;

//       if (!screen || !venue) return;

//       const venueId = venue._id.toString();

//       if (!grouped[venueId]) {
//         grouped[venueId] = {
//           theatreName: venue.name,
//           logo: venue.logo || null,
//           distance: venue.distance || null,
//           shows: [],
//         };
//       }

//       const totalSeats = screen.totalSeats || 0;
//       const bookedSeats = show.bookedSeats?.length || 0;

//       grouped[venueId].shows.push({
//         showId: show._id,
//         time: show.startTime
//     ? new Date(show.startTime).toISOString()
//     : null, // ✅ prevent crash
//         screenName: screen.name,

//         // ✅ USING HELPER
//         availability: getAvailability(totalSeats, bookedSeats),
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



// =======================================================
// 1. GET SHOW BY ID (FOR SEAT BOOKING PAGE)
// =======================================================
// make sure imported
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
//     const selectedDate = new Date(date + "T00:00:00");

//     const start = new Date(selectedDate);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     // 🏙️ City lookup
//     const cityDoc = await City.findOne({
//       name: { $regex: new RegExp(`^${city}$`, "i") },
//     });

//     if (!cityDoc) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//       });
//     }

//     // 🎬 Fetch shows
//     const shows = await Show.find({
//       movieId: Number(movieId),
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

//     // ✅ FINAL FORMAT (STRICT)
//     const formattedShows = shows.map((show) => ({
//       showId: String(show._id), // 🔥 IMPORTANT
//       time: show.startTime,
//       date: show.showDate,

//       theatreName: show.screen?.venue?.name || "",
//       screenName: show.screen?.name || "",

//       city: show.screen?.venue?.city?.name || "",
//     }));

//     return res.status(200).json({
//       success: true,
//       data: formattedShows,
//     });

//   } catch (error) {
//     console.log("GET SHOW ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch shows",
//     });
//   }
// };
exports.getShows = async (req, res) => {
  try {
    const { movieId, city, date } = req.query;

    if (!movieId || !city || !date) {
      return res.status(400).json({
        success: false,
        message: "movieId, city, date required",
      });
    }

    // 📅 Date range
    const selectedDate = new Date(date + "T00:00:00");

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    // 🏙️ City lookup
    const cityDoc = await City.findOne({
      name: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!cityDoc) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // 🎬 Fetch shows
    const shows = await Show.find({
      movieId: Number(movieId),
      city: cityDoc._id,
      showDate: { $gte: start, $lte: end },
      status: "Active",
    })
      .populate({
        path: "screen",
        populate: {
          path: "venue",
          populate: { path: "city" },
        },
      })
      .sort({ startTime: 1 });

    // ✅ GROUP BY THEATRE (THIS IS THE KEY FIX)
    const grouped = {};

    shows.forEach((show) => {
      const venue = show.screen?.venue;
      const screen = show.screen;

      if (!venue || !screen) return;

      const venueId = venue._id.toString();

      if (!grouped[venueId]) {
        grouped[venueId] = {
          theatreName: venue.name,
          shows: [],
        };
      }

      grouped[venueId].shows.push({
        showId: String(show._id),
        time: show.startTime,
        date: show.showDate,
        screenName: screen.name,
      });
    });

    return res.status(200).json({
      success: true,
      data: Object.values(grouped),
    });

  } catch (error) {
    console.log("GET SHOW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shows",
    });
  }
};
exports.getShowById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Incoming Show ID:", id);


    const show = await Show.findById(id).populate({
      path: "screen",
      populate: {
        path: "venue",
        // populate: { path: "city" },
      },
    });

     console.log("Fetched Show:", show);

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
      message: "error.message",
    });
  }
};


// =======================================================
// 2. GET ALL SHOWS (ADMIN / DEBUG)
// =======================================================

exports.getAllShows = async (req, res) => {
  try {
    const { city, date } = req.query;

    let query = {};

    // ✅ date filter (optional)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.showDate = { $gte: start, $lte: end };
    }

    // ✅ fetch shows with full population
    let shows = await Show.find(query)
      .populate({
        path: "screen",
        populate: {
          path: "venue",
          populate: { path: "city" },
        },
      })
      .sort({ startTime: 1 });

    // ✅ city filter (AFTER populate because city is nested)
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
    console.log("GET ALL SHOWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching shows",
    });
  }
};
