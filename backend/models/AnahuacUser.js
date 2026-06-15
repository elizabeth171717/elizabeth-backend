const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
     // 🔐 EMAIL VERIFICATION FIELDS
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String, // store as string to avoid number mismatch
    },

    verificationCodeExpires: {
      type: Number, // timestamp
    },

    // 🔑 PASSWORD RESET FIELDS
resetPasswordToken: {
  type: String,
},

resetPasswordExpires: {
  type: Date,
},
  },
  { timestamps: true }
);

module.exports = userSchema;
