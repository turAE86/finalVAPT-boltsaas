import { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/api/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/scan");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  const resend = async () => {
    setError("");
    setMessage("");

    try {
      const res = await api.post("/api/auth/signup", { email });
      setMessage(res.data.message || "OTP resent");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify Email
        </h2>

        <form onSubmit={verify} className="space-y-3">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="btn">Verify OTP</button>
        </form>

        <button
          onClick={resend}
          className="mt-3 text-sm text-blue-600 underline block text-center"
        >
          Resend OTP
        </button>

        {message && <p className="text-green-600 mt-2 text-sm">{message}</p>}
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
}
