import express from "express";
import { signup, login, acceptScannerAgreement, getCurrentUser } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/accept-scanner-agreement", protect, acceptScannerAgreement);
router.get("/me", protect, getCurrentUser);

export default router;