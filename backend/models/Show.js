const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    // ===================== CORE RELATION =====================
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
      index: true,
    },

    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // ===================== LOCATION =====================
   city: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "City"
},

    // ===================== TIMING =====================
    showDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String, // FIXED: store "10:30" instead of Date
      required: true,
    },

    endTime: {
      type: String, // FIXED
      required: true,
    },

    timeCategory: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night"],
    },

    // ===================== FEATURES =====================
    features: {
      type: [String],
      default: ["2D"],
      enum: [
        "2D",
        "3D",
        "IMAX",
        "4DX",
        "Dolby Atmos",
        "Dolby Vision",
        "AC",
        "Recliner",
      ],
    },

    // ===================== PRICING =====================
    pricing: [
      {
        category: String,
        price: Number,
      },
    ],

    // ===================== BOOKINGS =====================
    bookedSeats: [
      {
        type: String,
      },
    ],

    // ===================== STATUS =====================
    status: {
      type: String,
      enum: ["Active", "Cancelled", "Completed"],
      default: "Active",
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    publishedStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // ===================== ANALYTICS =====================
    totalRevenue: {
      type: Number,
      default: 0,
    },

    ticketsSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ===================== PERFORMANCE INDEXES =====================
showSchema.index({ city: 1, showDate: 1 });
showSchema.index({ content: 1, showDate: 1 });

module.exports = mongoose.model("Show", showSchema);