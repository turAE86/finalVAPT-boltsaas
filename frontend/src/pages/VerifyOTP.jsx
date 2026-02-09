import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      authLogin(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setMessage("");
    setResendLoading(true);

    try {
      const res = await api.post("/api/auth/resend-otp", { email });
      setMessage(res.data.message || "OTP resent to your email");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
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
              <div className="flex justify-center mb-4">
                <Shield size={40} className="text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
              <p className="text-slate-400">We've sent an OTP to {email}</p>
            </div>

            <form onSubmit={verify} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all text-center text-2xl tracking-widest"
                />
              </div>

              {message && (
                <div className="p-3 bg-green-500/15 border border-green-500/20 rounded-lg text-green-400 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-3">Didn't receive the OTP?</p>
              <button
                onClick={resend}
                disabled={resendLoading}
                className="text-rose-400 hover:text-rose-300 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Changed your mind?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
                >
                  Sign up again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}