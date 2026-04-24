const Show = require("../models/Show");
const Content = require("../models/Content");
const Screen = require("../models/Screen");
const City = require("../models/City");
const mongoose = require("mongoose");



// exports.createShow = async(req,res) => {

//     try{

//         const { content, screen, dates, showTimes, basePrice } = req.body;

//         const contentExist = await Content.findById(content);

        
//          if (!contentExist) {
//       return res.status(404).json({
//         success: false,
//         message: "Content not found"
//       });
//     }

//     const createdShows = [];

//     for(let screenId of screen){

//       const screenExist = await Screen.findById(screenId);

//       if(!screenExist) continue;

//       for(let date of dates){

//         const showDate = new Date(date);

//         for(let time of showTimes){

//           //prevent duplicates
//           const alreadyExists = await Show.findOne({
//             content,
//             screen: screenId,
//             showDate,
//             startTime: time.startTime
//           });

//           if(alreadyExists) continue;

//           const show = await Show.create({
//             content,
//             screen: screenId,
//             showDate,
//             startTime: time.startTime,
//             endTime: time.endTime,
//             basePrice,
//           })

//           createdShows.push(show);

//         }

//       }
//     }

//      return res.status(201).json({
//       success: true,
//       message: "Multiple shows created successfully",
//       count: createdShows.length,
//       data: createdShows,
//     });

    

    
  

   
   

//     }catch(error){

//          return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//     }
// }

// exports.createShow = async (req, res) => {
//   try {
//     let { movieId, screen,  showTimes, basePrice } = req.body;

//     // ✅ HANDLE SINGLE VALUE
//     const screensArray = Array.isArray(screen) ? screen : [screen];
//     // const datesArray = Array.isArray(dates) ? dates : [dates];
//     const timesArray = Array.isArray(showTimes) ? showTimes : [showTimes];

//     const createdShows = [];

//     for (let screenId of screensArray) {

//       const screenData = await Screen.findById(screenId).populate({
//         path:"venue",
//         populate:{ path: "city"},
//       });

//       if(!screenData)continue;

//       const cityName = screenData.venue.city.name;
//       for (let date of datesArray) {
//         const showDate = new Date(date);
        
// showDate.setHours(0, 0, 0, 0);  // 🔥 FIX

//         for (let time of timesArray) {
//           const show = await Show.create({
//             movieId,
//             screen: screenId,
//             city: cityName,
//             showDate,
//             startTime: time.startTime,
//             endTime: time.endTime,
//             basePrice,
//           });

//           createdShows.push(show);
//         }
//       }
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Shows created",
//       count: createdShows.length,
//       data: createdShows,
//     });

//   } catch (error) {
//     console.log("🔥 ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// getshowsmain api


exports.createShow = async (req, res) => {
  try {
    let { movieId, screen, showTimes, basePrice } = req.body;

    const screensArray = Array.isArray(screen) ? screen : [screen];
    const timesArray = Array.isArray(showTimes) ? showTimes : [showTimes];

    const createdShows = [];

    for (let screenId of screensArray) {

      const screenData = await Screen.findById(screenId).populate({
        path: "venue",
        populate: { path: "city" },
      });

      if (!screenData) continue;

      const cityName = screenData.venue.city.name;

      // 🔥 AUTO GENERATE NEXT 5 DAYS
      for (let i = 0; i < 5; i++) {
        const showDate = new Date();
        showDate.setDate(showDate.getDate() + i);
        showDate.setHours(0, 0, 0, 0);

        for (let time of timesArray) {

          // ✅ prevent duplicates
          const exists = await Show.findOne({
            movieId,
            screen: screenId,
            showDate,
            startTime: time.startTime,
          });

          if (exists) continue;

          const show = await Show.create({
            movieId,
            screen: screenId,
            city: cityName,
            showDate,
            startTime: time.startTime,
            endTime: time.endTime,
            basePrice,
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
    console.log("🔥 ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// exports.getShows = async(req,res) =>{
//   try{

//     const { movieId, city, date} = req.query;

//      if (!movieId || !city || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "movieId, city, date required",
//       });
//     }

//    const selectedDate = new Date(date + "T00:00:00");

//     const start = new Date(selectedDate);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(selectedDate);
//     end.setHours(23, 59, 59, 999);

//     const shows = await Show.find({
//       movieId: Number(movieId),
      
//       showDate: { $gte: start, $lte: end},
//       status:"Active",

//     }).populate({
//       path: "screen",
//       populate: {path: "venue",
//         populate: {path: "city"},
//       },

//     });
//     console.log("START:", start);
// console.log("END:", end);
// console.log("DB DATE:", shows[0]?.showDate);

//     const filteredShows = shows.filter(
//       (s) => s.screen?.venue?.city?.name?.toLowerCase() === city.toLowerCase()
//     );



//     const grouped ={};

//     filteredShows.forEach((show) =>{
//       const venue = show.screen.venue;
//  const venueId = venue._id.toString();
//       if(!grouped[venue._id]){
//         grouped[venue._id] = {
//           theatreName: venue.name,
//           shows: [],
//         }
//       }

//       grouped[venueId].shows.push({
//         time: show.startTime,
//         showId: show._id,
//       })
//     })

//      return res.status(200).json({
//       success: true,
//       data: Object.values(grouped),
//     });

//   }catch(error){
// console.log(error);
//     res.status(500).json({ success: false });

//   }
// }



// exports.getShowByContent = async(req,res) => {
//     try{

//         const { contentId } = req.params;

//         const shows = await Show.find({
//             content: contentId,
//             status:"Active",
//         })
//         .populate("screen")
//         .populate("content")

//          return res.status(200).json({
//       success: true,
//       shows,
//     });


//     }catch(error){

        
//    return res.status(500).json({
//       success: false,
//       message: "Error fetching shows"
//     });

//     }
// }


exports.getShows = async (req, res) => {
  try {
    const { movieId, city, date } = req.query;

    if (!movieId || !city || !date) {
      return res.status(400).json({
        success: false,
        message: "movieId, city, date required",
      });
    }

    const selectedDate = new Date(date + "T00:00:00");

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const shows = await Show.find({
      movieId: Number(movieId),
      
      city: { $regex: new RegExp(`^${city}$`, "i") },
       showDate: { $gte: start, $lte: end },
      status: "Active",
    }).populate({
      path: "screen",
      populate: {
        path: "venue",
        populate: { path: "city" },
      },
    });

    const grouped = {};

    shows.forEach((show) => {
      const venue = show.screen?.venue;
      const screen = show.screen;
      if (!venue || !screen) return;

      const venueId = venue._id.toString();
      const screenId = screen._id.toString();


      if (!grouped[venueId]) {
        grouped[venueId] = {
          theatreName: venue.name,
          screens: {},
        };
      }


  if (!grouped[venueId].screens[screenId]) {
    grouped[venueId].screens[screenId] = {
      screenName: screen.name,
      shows: [],
    };
  }

      grouped[venueId].screens[screenId].shows.push({
        time: show.startTime,
        showId: show._id,
      });
    });

    return res.status(200).json({
      success: true,
      data: Object.values(grouped).map((venue) => ({
  theatreName: venue.theatreName,
  screens: Object.values(venue.screens),
}))
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

exports.getShowById = async(req,res) => {
    try{

        const { id } = req.params;

        const show = await Show.findById(id)
        
        .populate({
            path:"screen",
            populate:{
                path:"venue"
            }
        });


         if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: show,
    });




    }catch(error){

         return res.status(500).json({
      success: false,
      message: "Error fetching show"
    });

    }
}

exports.getAllShows = async (req, res) => {
  try {

    const { city,date } = req.query;

    let shows;
    if(city){
       const venues = await Venue.find({ city });
       if (venues.length === 0) {
    return res.status(200).json({
      success: true,
      shows: [],
    });
  }
       
       const venueIds = venues.map(v => v._id);

       shows = await Show.find({
         venue: { $in: venueIds }
       })
       .populate("content")
       .populate({
        path:"venue",
        populate: { path: "city"}
       });

      
    }else{
      shows = await Show.find()
      .populate("content")
      .populate({
        path: "venue",
        populate: { path: "city"}
      })
    }

    res.status(200).json({
      success: true,
      shows,
    });


  }catch(error){

    res.status(500).json({
      success: false,
      message: "Error fetching shows",
    });

  }
  
};

// exports.getAllEvents = async(req,res) =>{
//   try{

//     const shows = await Show.find()
//  .populate("content");
//      const events = shows.filter(
//       (show) => show.content?.type === "Event"
//      );
//     //  const eventContents = events.map(show => show.content);
// res.status(200).json({ success: true, data: events});
//   }catch(error){
//     console.error("Error fetching events:", err);
//     res.status(500).json({ success: false, message: "Server Error" });

//   }
// }


// exports.getShowsByDate = async (req, res) => {
//   try {
//     const { date, contentId } = req.query;

//     // Validate inputs
//     if (!date || !contentId) {
//       return res.status(400).json({ success: false, message: "Missing date or contentId" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(contentId)) {
//       return res.status(400).json({ success: false, message: "Invalid contentId" });
//     }

//     // Parse date
//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate)) {
//       return res.status(400).json({ success: false, message: "Invalid date" });
//     }

//     // Create a date range for the entire day in local timezone
//     const start = new Date(parsedDate);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(parsedDate);
//     end.setHours(23, 59, 59, 999);

//     // Query shows for this content on that date and status Active
//     const shows = await Show.find({
//       content: contentId,
//       showDate: { $gte: start, $lte: end },
//       status: "Active",
//     })
//       .populate("content")  // Include movie/event info
//       .populate("screen");  // Include screen info

//     return res.status(200).json({
//       success: true,
//       data: shows,
//     });
//   } catch (error) {
//     console.error("🔥 ERROR IN getShowsByDate:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// exports.getShowsByCity = async(req,res) => {
//   try{

//     const {city} = req.query;

//     //find venue inn that city
     
//     const venues = await Venue.find({ city });

//     const venueIds = venues.map(v => v._id);

//     //find shows in those events

//     const shows = await Show.find({
//       venue: {$in: venueIds}
//     })
//     .populate("content")
//     .populate({
//       path:"venue",
//       populate: {path: "city"}
//     });
//      res.status(200).json({
//       success: true,
//       shows,
//     });




//   }catch(error){

//       res.status(500).json({
//       success: false,
//       message: "Error fetching shows",
//     });

//   }
// }
