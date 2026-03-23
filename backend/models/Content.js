const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true,

    },
    type:{
        type:String,
        enum:["Movie","Event"],
        required:true,
    },
    description:{
        type:String,
    },
    duration:{
        type:Number,
    },
    languages:[{
        type:String,
    }],

    genres:[{
        type:String,
    }],
     
    releaseDate:{
        type:Date,
    },
    poster:{
        type:String,
    },
    trailerUrl:{
        type:String,
    },
    // rating:{

    // } rating and reviews later

    isActive:{
        type:Boolean,
        default:true,
    }
},{ timestamps: true});



module.exports = mongoose.model("Content", contentSchema);