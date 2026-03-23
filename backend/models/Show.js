const mongoose = require("mongoose");


const showSchema = new mongoose.Schema({

    content:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Content",
        required:true,
    },
     screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true,
  },
    showDate:{
        type:Date,
        required:true,

    },
    startTime:{
        type:String,
        required:true,
    },
    endTime:{
        type:String,
        required:true,
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