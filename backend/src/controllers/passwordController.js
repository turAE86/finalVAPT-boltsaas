import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If email exists, reset link sent" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click to reset password:</p><a href="${link}">${link}</a>`
  });

  res.json({ message: "Reset link sent" });
};

import bcrypt from "bcryptjs";

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

