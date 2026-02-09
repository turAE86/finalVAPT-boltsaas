import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select(
        "-password -otp -otpExpiry -resetToken -resetTokenExpiry"
      );

      const token = createToken(req.user._id);

      // Redirect to frontend with token
      // Frontend will fetch user data via /api/auth/me endpoint
      res.redirect(
        `http://localhost:5173/oauth-success?token=${token}`
      );
    } catch (err) {
      console.error("OAuth callback error:", err);
      res.redirect(`http://localhost:5173/login?error=oauth_failed`);
    }
  }
);

export default router;