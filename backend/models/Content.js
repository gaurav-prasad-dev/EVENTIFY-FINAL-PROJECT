const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    // ===================== BASIC INFO =====================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["movie", "event"], // ✅ FIXED (case consistency)
      required: true,
    },

    // ===================== TMDB SUPPORT =====================
    // Used only when type === "movie"
    tmdbId: {
      type: Number,
      sparse: true,
      index: true,
    },

    // ===================== DETAILS =====================
    description: {
      type: String,
    },

    duration: {
      type: Number, // in minutes
    },

    languages: [
      {
        type: String,
      },
    ],

    genres: [
      {
        type: String,
      },
    ],

    releaseDate: {
      type: Date,
    },

    // ===================== MEDIA =====================
    poster: {
      type: String,
    },

    trailerUrl: {
      type: String,
    },

    // ===================== RELATION =====================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ===================== STATUS =====================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ===================== INDEX FOR SEARCH =====================
contentSchema.index({ title: "text", genres: "text" });

module.exports = mongoose.model("Content", contentSchema);