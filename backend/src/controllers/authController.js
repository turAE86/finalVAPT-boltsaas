import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/otp.js";
import { sendEmail } from "../services/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<h3>Your OTP is: ${otp}</h3>`
    });

    res.status(201).json({
      message: "OTP sent to email. Please verify."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email not verified. Please verify OTP."
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
