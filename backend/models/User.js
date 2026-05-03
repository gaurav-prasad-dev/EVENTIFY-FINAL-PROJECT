const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        sparse:true,
        lowercase:true,
        trim:true,
    },
    phone:{
        type:String,
        unique:true,
        sparse:true,
        trim:true,
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,
    },
   role:{
    type:String,
    enum:["user","admin","organizer"],
    default:"user",
   },
   isApproved: {
    type:Boolean,
    default: false,
   }// for approval from admin to become organizer
   ,
   isBlocked: {
  type: Boolean,
  default: false,
},
   isActive:{
    type:Boolean,
    default:true,
   }
},{timestamps: true});



module.exports = mongoose.model("User",userSchema);