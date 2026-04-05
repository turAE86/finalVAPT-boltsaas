import { execFile } from "child_process";
import path from "path";

const runPythonScan = (target) =>
  new Promise((resolve, reject) => {
    const enginePath = path.join(process.cwd(), "..", "scanner", "engine.py");

    const child = execFile(
      "python",
      ["-m", "scanner.engine", target],
      {
        cwd: path.join(process.cwd(), ".."),
        timeout: 600000,  // Increased to 10 minutes
        maxBuffer: 100 * 1024 * 1024  // Increased buffer to 100MB
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Scanner stderr:", stderr);
          // If it timed out, still try to parse what we got
          if (error.killed && stdout) {
            try {
              return resolve(JSON.parse(stdout));
            } catch (e) {
              return reject(new Error(`Scan timeout: ${error.message}`));
            }
          }
          return reject(new Error(`Scan failed: ${error.message}`));
        }
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject(new Error(`Invalid scanner output: ${stdout.slice(0, 500)}`));
        }
      }
    );

    // Log stderr in real-time for debugging
    if (child.stderr) {
      child.stderr.on("data", (data) => {
        console.log("[Scanner]", data.toString());
      });
    }
  });

export default runPythonScan;
