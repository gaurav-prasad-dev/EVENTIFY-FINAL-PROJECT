const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"], 
    },
    profileImage: {
        type: String,
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

profileSchema.pre("save", function() {
    if (this.fullName && (!this.firstName || !this.lastName)) {
        const parts = this.fullName.trim().split(" ");
        this.firstName = this.firstName || parts[0];
        this.lastName = this.lastName || (parts.slice(1).join(" ") || "");
    } else if (!this.fullName && (this.firstName || this.lastName)) {
        this.fullName = `${this.firstName || ""} ${this.lastName || ""}`.trim();
    }
});

module.exports = mongoose.model("Profile", profileSchema);