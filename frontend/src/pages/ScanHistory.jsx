import { useEffect, useState } from "react";
import api from "../services/api";
import SeverityChart from "../components/SeverityChart";

export default function ScanHistory() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    api.get("/api/scans").then((res) => {
      setScans(res.data);
    });
  }, []);

  const downloadReport = (id) => {
    window.open(`http://localhost:5000/api/report/${id}`, "_blank");
  };

  return (
  <div style={{ padding: "40px" }}>
    <h2>Scan History</h2>

    <SeverityChart scans={scans} />

    {scans.length === 0 && <p>No scans yet</p>}

    {scans.map((scan) => (
      <div
        key={scan._id}
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "15px"
        }}
      >
        <strong>Target:</strong> {scan.target}
        <br />
        <small>
          {new Date(scan.createdAt).toLocaleString()}
        </small>

        <div style={{ marginTop: "10px" }}>
          <button onClick={() => window.open(
            `http://localhost:5000/api/report/${scan._id}`,
            "_blank"
          )}>
            Download PDF
          </button>
        </div>
      </div>
    ))}
  </div>
);

}
