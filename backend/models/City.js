const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    state:{
        type:String,
        trim:true,

    },
    isActive:{
        type:Boolean,
        default:true,
    }

},{timestamps:true});


module.exports = mongoose.model("City", citySchema);



// 🏗️ Why Separate City Model?

// Because:

// Admin can add new cities

// You can disable cities

// Easy scaling

// Can support international expansion later