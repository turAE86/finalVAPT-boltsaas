import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/auth/forgot-password", { email });
    setMessage("If the email exists, a reset link has been sent.");
  };

  return (
    <div className="auth-box">
      <h2>Forgot Password</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Send Reset Link</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
