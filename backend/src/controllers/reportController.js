import Scan from "../models/Scan.js";
import { generatePDF } from "../services/reportService.js";
import fs from "fs";

export const downloadReport = async (req, res) => {
  try {
const scan = await Scan.findOne({
  _id: req.params.id,
  user: req.user._id
});

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    const filePath = await generatePDF(scan.toObject());

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: "Report file not found" });
    }

    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
