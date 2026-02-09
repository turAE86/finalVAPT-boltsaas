import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(form);
      authLogin(res.data);
      navigate('/scanner');
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/verify-otp', { state: { email: form.email } });
      } else {
        setError(err.response?.data?.error || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

// Update in frontend/src/pages/Login.jsx - just the Google login function
const handleGoogleLogin = () => {
  try {
    window.location.href = 'http://localhost:5000/api/auth/google';
  } catch (err) {
    console.error('Google login error:', err);
    alert('Failed to initiate Google login. Please try again.');
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
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-400">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500/70 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
                />
              </div>

              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-rose-400 hover:text-rose-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/50 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-slate-400 text-sm mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-rose-400 hover:text-rose-300 transition-colors font-medium"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;