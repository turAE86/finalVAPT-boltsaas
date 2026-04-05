// backend/src/controllers/reportController.js
import Scan from "../models/Scan.js";
import { generatePDF } from "../services/reportService.js";
import fs from "fs";
import path from "path";

export const downloadReport = async (req, res) => {
  let filePath = null;
  
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    // Prepare findings for PDF generation
    const findings = scan.findings || [];
    const results = scan.results || {};
    
    // Include open ports in findings if available
    if (results.open_ports && Array.isArray(results.open_ports) && results.open_ports.length > 0) {
      if (!findings.some(f => f.type === 'OPEN_PORTS')) {
        findings.unshift({
          type: 'OPEN_PORTS',
          severity: 'MEDIUM',
          owasp: 'A05:2021 – Security Misconfiguration',
          description: 'Unnecessary open ports increase attack surface',
          evidence: results.open_ports
        });
      }
    }

    try {
      const scanData = scan.toObject();
      scanData.findings = findings;
      filePath = await generatePDF(scanData);
    } catch (pdfError) {
      console.error("PDF Generation failed:", pdfError);
      return res.status(500).json({ 
        error: "Failed to generate PDF report. Please try again later.",
        details: process.env.NODE_ENV === "development" ? pdfError.message : undefined
      });
    }

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(500).json({ error: "Report file could not be generated" });
    }

    // Get filename
    const filename = `scan-report-${scan._id}.pdf`;

    // Set proper headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Send the file
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download report" });
      }
    });

    res.on("finish", () => {
      // Clean up file after sending
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting report file:", err);
      });
    });

    fileStream.pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    
    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting report file:", err);
      });
    }
    
    res.status(500).json({ 
      error: "Failed to download report",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};