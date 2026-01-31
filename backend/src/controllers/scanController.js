import Scan from "../models/Scan.js";
import runPythonScan from "../services/scannerService.js";
import { mapFindings } from "../services/owaspMapper.js";

/**
 * Start a new scan
 */
export const startScan = async (req, res) => {
  try {
    const { target } = req.body;

    if (!target) {
      return res.status(400).json({ error: "Target required" });
    }

    // BLOCK if no credits
    if (req.user.scanCredits <= 0) {
      return res.status(403).json({
        error: "Scan limit reached. Please upgrade your plan."
      });
    }

    const results = await runPythonScan(target);
    const findings = mapFindings(results);

    const scan = await Scan.create({
      user: req.user._id,
      target,
      results,
      findings
    });

    // AFTER successful scan, deduct credit
    req.user.scanCredits -= 1;
    await req.user.save();

    res.json(scan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get scan history
 */
export const getScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};