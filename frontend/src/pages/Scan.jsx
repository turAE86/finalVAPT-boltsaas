import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Scan() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const startScan = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/scan", { target });
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Scan limit reached. Please upgrade your plan.");
      } else {
        alert("Scan failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-6">VAPT Scan</h2>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl">
        <input
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example.com"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <button
          onClick={startScan}
          disabled={user?.scanCredits <= 0 || loading}
          className={`w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition ${
            user?.scanCredits <= 0 || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Scanning..." : "Start Scan"}
        </button>

        {user?.scanCredits <= 0 && (
          <p className="text-red-600 mt-2 text-sm">
            Scan limit reached. Please upgrade your plan.
          </p>
        )}
      </div>

      {result && (
        <div className="mt-8 max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Findings</h3>

          {result.findings.length === 0 && (
            <p className="text-green-600">No vulnerabilities detected 🎉</p>
          )}

          {result.findings.map((f, i) => (
            <div
              key={i}
              className={`mb-4 p-4 rounded-lg border-l-4 ${
                f.severity === "CRITICAL"
                  ? "border-red-700 bg-red-50"
                  : f.severity === "HIGH"
                  ? "border-red-500 bg-red-50"
                  : f.severity === "MEDIUM"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-green-500 bg-green-50"
              }`}
            >
              <div className="flex justify-between">
                <strong>{f.type}</strong>
                <span className="text-sm font-semibold">{f.severity}</span>
              </div>

              {f.owasp && <p className="text-sm mt-1">{f.owasp}</p>}
              <p className="text-sm text-gray-700 mt-2">{f.description}</p>

              {/* Extra technical details */}
              {f.param && (
                <div className="text-xs text-gray-600 mt-1">
                  <b>Param:</b> {f.param}
                </div>
              )}
              {f.payload && (
                <div className="text-xs text-gray-600 mt-1">
                  <b>Payload:</b> {f.payload}
                </div>
              )}
              {f.url && (
                <div className="text-xs text-gray-600 mt-1 break-all">
                  <b>URL:</b> {f.url}
                </div>
              )}
              {f.evidence && (
                <pre className="mt-2 p-2 bg-gray-100 text-xs rounded">
                  {String(f.evidence)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}