import 'dotenv/config';
import express from "express";
import cors from "cors";
import passport from "passport";
import contactRoutes from "./routes/contactRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", scanRoutes);
app.use("/api", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);
app.use(passport.initialize());
app.use("/api/auth", googleAuthRoutes);
app.use("/api", contactRoutes);
app.use("/api/auth", otpRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is healthy 🚀" });
});

export default app;
