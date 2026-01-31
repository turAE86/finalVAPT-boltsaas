import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    scanCredits: {
  type: Number,
  default: 5   // free tier = 5 scans
},

role: {
  type: String,
  enum: ["FREE", "PAID"],
  default: "FREE"
},

    password: {
  type: String,
  required: function () {
    return !this.googleId;
  }
},
googleId: {
  type: String
},

    otp: String,
    otpExpiry: Date,
    isVerified: {
      type: Boolean,
      default: false
    },
    resetToken: String,
resetTokenExpiry: Date

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
