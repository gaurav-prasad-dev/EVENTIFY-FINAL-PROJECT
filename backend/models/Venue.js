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

    amenities:[{
        type:String,
    }],
    isActive:{
        type:Boolean,
        default:true,
    }

},{timestamps: true});



module.exports = mongoose.model("Venue", venueSchema);