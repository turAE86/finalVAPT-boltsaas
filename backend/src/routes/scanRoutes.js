import express from "express";
import { startScan, getScans } from "../controllers/scanController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/scan", protect, startScan);
router.get("/scans", protect, getScans);


export default router;
