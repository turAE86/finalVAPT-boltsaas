// backend/src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization) {
      console.log("Authorization header found:", req.headers.authorization.substring(0, 20) + "...");
      
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.substring(7); // Remove "Bearer " prefix
        console.log("Token extracted from Bearer header");
      } else {
        console.log("Authorization header does not start with Bearer");
        return res.status(401).json({ error: "Not authorized, invalid token format" });
      }
    } else {
      console.log("No authorization header found");
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    // Verify token
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ error: "Server configuration error" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified successfully, user ID:", decoded.id);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      console.error("User not found for ID:", decoded.id);
      return res.status(401).json({ error: "User not found" });
    }

    // Check if verified (optional - can be skipped for some routes)
    if (!user.isVerified) {
      console.warn("User email not verified:", user.email);
      return res.status(403).json({ error: "Account not verified. Please verify your email." });
    }

    // Attach user to request
    req.user = user;
    console.log("Authentication successful for user:", user.email);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Authentication error" });
  }
};

export default protect;