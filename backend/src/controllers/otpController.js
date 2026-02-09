import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpiry: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // In your OTP verification (likely in otpController.js)
// When creating/verifying user, make sure to return:
res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    scanCredits: user.scanCredits,
    scannerAgreementAccepted: user.scannerAgreementAccepted
  }
});

};
