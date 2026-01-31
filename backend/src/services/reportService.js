import { exec } from "child_process";
import path from "path";

export const generatePDF = (scan) => {
  return new Promise((resolve, reject) => {
    const projectRoot = path.resolve("../");
    const payload = JSON.stringify(scan).replace(/"/g, '\\"');

    exec(
      `python scanner/generate_pdf.py "${payload}"`,
      { cwd: projectRoot },
      (error, stdout) => {
        if (error) return reject(error);
        resolve(stdout.trim());
      }
    );
  });
};
