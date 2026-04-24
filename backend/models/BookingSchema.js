const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    show:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Show",
            required:true,
    },
    seats:[{
        type:String,
        required:true,
    }],
    totalAmount:{
        type:Number,
        required:true,
    },
    paymentStatus:{
        type:String,
           enum: ["Pending", "Success", "Failed"],
           default:"Pending",

    },

    bookingStatus:{
        type:String,
        enum: ["Reserved", "Confirmed", "Cancelled"],
    default: "Reserved",
    },

    bookingId:{
        type:String,
        unique:true,
        required:true,
    },
    expiresAt:{
        type:Date,
        default: () => new Date(Date.now() + 5*60*1000)

    },
    qrCode:{
        type:String
    },
    ticketUsed:{
        type:Boolean,
        default:false,
    }
    
},{timestamps:true});

module.exports = mongoose.model("Booking", bookingSchema);