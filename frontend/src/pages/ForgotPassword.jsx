import { useState } from "react";
import api from "../services/api";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/api/auth/forgot-password", { email });
      setMessage("If the email exists, a reset link has been sent.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0B1120] text-slate-200 pt-28 pb-20 flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}
          ></div>
        </div>
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
              <p className="text-slate-400">Enter your email to receive a reset link.</p>
            </div>
            <form onSubmit={submit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            {message && (
              <div className="p-3 bg-green-500/15 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                {message}
              </div>
            )}
            <div className="text-center mt-6">
              <a
                href="/login"
                className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}