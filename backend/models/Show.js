const mongoose = require("mongoose");


const showSchema = new mongoose.Schema({

   
    movieId:{
        type:Number, // TMDB movie ID
        required:true,
    },
     screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true,
  },
  city: {
  type: String, // "Indore"
  required: true,
},
    showDate:{
        type:Date,
        required:true,

    },
    startTime:{
        type: Date,
        required:true,
    },
    endTime:{
        type:Date,
        required:true,
    },
    // ✅ ADD THIS (for filters)
  timeCategory: {
    type: String,
    enum: ["morning", "afternoon", "evening", "night"],
  },
   // ✅ ADD THIS (for filters like recliner etc.)
//   features: [
//     {
//       type: String,
//       enum: ["Recliner", "Wheelchair", "Premium"],
//     },
//   ],

features: {
  type: [String],
  enum: [
    "2D",
    "3D",
    "IMAX",
    "4DX",
    "Dolby Atmos",
    "Dolby Vision",
    "AC",
    "Recliner"
  ],
  default: ["2D"]
},
    basePrice:{
        type:Number,
        required:true,
    },
    bookedSeats:[{
        type:String
    }],
    status:{
        type:String,
        enum:["Active","Cancelled","Completed"],
        default:"Active",
    }


},{timestamps:true});


module.exports = mongoose.model("Show", showSchema);