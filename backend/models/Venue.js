const mongoose = require("mongoose");


const venueSchema = new mongoose.Schema({


    name:{
        type:String,
        required:true,
        trim:true,
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"City",
        required:true,
    },
    type:{
          type: String,
    enum: ["Theatre", "Auditorium", "Stadium", "OpenGround"],
    required: true,
    },
    street: { type: String, trim: true },
    area: { type: String, trim: true },
    landmark: { type: String, trim: true },
    pincode: { type: String, trim: true },

   // ✅ ADD THIS (for filters like Recliner etc.)
  amenities: [
    {
      type: String,
      enum: ["Recliner", "Wheelchair", "Premium", "Dolby", "IMAX"],
    },
  ],


  // ✅ ADD THIS (IMPORTANT for logo)
  logo: {
    type: String, // "/logos/cinepolis.png" OR cloud URL
  },

  // ✅ ADD THIS (OPTIONAL but useful)
  distance: {
    type: String, // "1.6 km"
  },
    
    status:{
      type: String,
      enum: ["pending","approved","rejected"],
      default:"pending",
    },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
isActive:{
        type:Boolean,
        default:true,
    },

},{timestamps: true});



module.exports = mongoose.model("Venue", venueSchema);