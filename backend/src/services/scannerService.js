import { exec } from "child_process";
import path from "path";

const runPythonScan = (target) => {
  return new Promise((resolve, reject) => {
    const projectRoot = path.resolve("../"); // vapt-bolt root

    exec(
      `python -m scanner.engine ${target}`,
      { cwd: projectRoot }, // 🔑 THIS FIXES EVERYTHING
      (error, stdout, stderr) => {

        if (error) {
          console.error("Python execution error:", stderr);
          return reject(error);
        }

        if (!stdout) {
          return reject(new Error("No output from scanner"));
        }

        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed);
        } catch (err) {
          console.error("Invalid JSON from Python:", stdout);
          reject(err);
        }
      }
    );
  });
};

export default runPythonScan;
