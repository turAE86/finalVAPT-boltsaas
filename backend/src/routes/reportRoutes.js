import express from "express";
import { downloadReport } from "../controllers/reportController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/report/:id", protect, downloadReport);


export default router;
