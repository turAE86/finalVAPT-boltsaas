// backend/src/services/reportService.js
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = (scan) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary file to store the scan data
      const tempDir = os.tmpdir();
      const tempFile = path.join(tempDir, `scan-${Date.now()}.json`);
      
      // Write scan data to temporary file
      fs.writeFileSync(tempFile, JSON.stringify(scan, null, 2));
      console.log("✓ Temp file created:", tempFile);

      // Get the backend directory path
      const backendDir = path.resolve(__dirname, "..");
      const projectRoot = path.resolve(__dirname, "../..");
      
      console.log("✓ Project root:", projectRoot);

      // Ensure reports directory exists
      const reportsDir = path.join(projectRoot, "scanner", "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
        console.log("✓ Created reports directory:", reportsDir);
      }

      // Use python3 or python depending on system
      const pythonCmd = process.platform === "win32" ? "python" : "python3";

      // Execute Python script with temp file path
      const command = `${pythonCmd} ../scanner/generate_pdf.py "${tempFile}"`;
      console.log("→ Executing command:", command);

      exec(
        command,
        { cwd: projectRoot, maxBuffer: 10 * 1024 * 1024, shell: true },
        (error, stdout, stderr) => {
          console.log("→ Python stderr:", stderr);
          console.log("→ Python stdout:", stdout);

          // Clean up temp file
          fs.unlink(tempFile, (err) => {
            if (err) console.error("✗ Failed to delete temp file:", err);
          });

          if (error) {
            console.error("✗ PDF Generation Error:", error.message);
            console.error("✗ Exit code:", error.code);
            return reject(new Error(`Failed to generate PDF: ${stderr || error.message}`));
          }

          const filePath = stdout.trim();
          console.log("✓ File path returned:", filePath);

          if (!filePath) {
            return reject(new Error("No file path returned from PDF generator"));
          }

          // Check if file exists
          if (!fs.existsSync(filePath)) {
            console.error("✗ Generated file does not exist:", filePath);
            return reject(new Error(`Generated file does not exist: ${filePath}`));
          }

          console.log("✓ PDF file generated successfully:", filePath);
          resolve(filePath);
        }
      );
    } catch (err) {
      console.error("✗ Sync error in generatePDF:", err);
      reject(err);
    }
  });
};