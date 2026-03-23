const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,

    },
   

    firstName:{
        type:String,
        trim:true,
    },
    lastName:{
        type:String,
       trim:true,
    },
    dob:{
        type:Date,
    
    },
    gender:{
        type:String,
        enum:["Male","Female","Others"], 
        
    },
    profileImage:{
        type:String,
    },
    isProfileComplete:{
        type:Boolean,
        
    }

   

},{timestamps: true});

module.exports = mongoose.model("Profile",profileSchema);