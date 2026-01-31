import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SeverityChart({ scans }) {
  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };

  scans.forEach((scan) => {
    scan.findings?.forEach((f) => {
      if (counts[f.severity] !== undefined) {
        counts[f.severity]++;
      }
    });
  });

  const data = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [counts.LOW, counts.MEDIUM, counts.HIGH]
      }
    ]
  };

  return (
    <div style={{ width: "300px", marginBottom: "30px" }}>
      <h3>Severity Overview</h3>
      <Pie data={data} />
    </div>
  );
}
