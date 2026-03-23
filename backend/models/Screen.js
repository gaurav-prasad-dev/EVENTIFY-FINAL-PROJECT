const mongoose = require("mongoose");


const screenSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    venue:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Venue",
        required:true,
    },
    
    totalSeats:{
        type:Number,
        required:true,

    },

    seatLayout:[{
        seatNumber:String,
        row:String,
        category:String,
    }],
      sections: [{
    name: String,
    capacity: Number,
  }]


},{timestamps: true});



module.exports = mongoose.model("Screen", screenSchema);