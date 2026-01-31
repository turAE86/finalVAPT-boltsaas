import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

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
  (req, res) => {
    const token = createToken(req.user._id);

    // redirect to frontend with token
    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );
  }
);

export default router;
