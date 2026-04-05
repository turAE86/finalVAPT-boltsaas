// backend/src/services/reportService.js
import { execFile } from "child_process";
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

      const projectRoot = path.resolve(__dirname, "../../..");
      
      console.log("✓ Project root:", projectRoot);

      // Ensure reports directory exists
      const reportsDir = path.join(projectRoot, "scanner", "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
        console.log("✓ Created reports directory:", reportsDir);
      }

      const scriptPath = path.join(projectRoot, "scanner", "generate_pdf.py");
      const pythonCandidates = process.platform === "win32"
        ? [process.env.PYTHON_EXE, "python", "py"]
        : [process.env.PYTHON_EXE, "python3", "python"];

      const candidates = pythonCandidates.filter(Boolean);

      const runCandidate = (index) => {
        if (index >= candidates.length) {
          fs.unlink(tempFile, () => {});
          return reject(new Error("No working Python executable found for PDF generation"));
        }

        const pythonCmd = candidates[index];
        console.log("→ Executing command:", pythonCmd, scriptPath, tempFile);

        execFile(
          pythonCmd,
          [scriptPath, tempFile],
          { cwd: projectRoot, maxBuffer: 10 * 1024 * 1024 },
          (error, stdout, stderr) => {
            console.log("→ Python stderr:", stderr);
            console.log("→ Python stdout:", stdout);

            if (error) {
              console.error("✗ PDF Generation Error:", error.message);
              console.error("✗ Exit code:", error.code);

              // Try the next Python executable candidate before failing.
              if (index + 1 < candidates.length) {
                return runCandidate(index + 1);
              }

              fs.unlink(tempFile, () => {});
              return reject(new Error(`Failed to generate PDF: ${stderr || error.message}`));
            }

            const filePath = stdout.trim().split(/\r?\n/).filter(Boolean).pop();
            console.log("✓ File path returned:", filePath);

            // Clean up temp file
            fs.unlink(tempFile, (err) => {
              if (err) console.error("✗ Failed to delete temp file:", err);
            });

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
      };

      runCandidate(0);
    } catch (err) {
      console.error("✗ Sync error in generatePDF:", err);
      reject(err);
    }
  });
};