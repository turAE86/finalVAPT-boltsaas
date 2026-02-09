// frontend/src/pages/OAuthSuccess.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          console.error("No token found in URL");
          setError("Authentication failed: No token received");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Store token in localStorage
        localStorage.setItem("token", token);

        // Create an API instance with the token
        const authApi = api.create ? api : api;
        
        // Wait a bit for token to be available
        await new Promise(resolve => setTimeout(resolve, 100));

        // Fetch user data from backend with the token
        const userResponse = await authApi.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = {
          id: userResponse.data._id,
          name: userResponse.data.name,
          email: userResponse.data.email,
          scanCredits: userResponse.data.scanCredits,
          scannerAgreementAccepted: userResponse.data.scannerAgreementAccepted
        };

        // Update auth context
        authLogin({
          token: token,
          user: userData
        });

        // Redirect to home
        console.log("OAuth successful, redirecting to home");
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth Error:", err);
        setError(err.response?.data?.error || "Failed to complete login. Please try again.");
        
        // Fallback: still try to login with just the token
        setTimeout(() => {
          authLogin({ token: localStorage.getItem("token") });
          navigate("/", { replace: true });
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, [navigate, authLogin]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col items-center justify-center">
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
      
      <div className="relative z-10 text-center">
        {error ? (
          <div className="bg-red-500/15 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400 font-semibold mb-2">Authentication Error</p>
            <p className="text-red-300 text-sm">{error}</p>
            <p className="text-slate-400 text-xs mt-3">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Completing Login</h2>
            <p className="text-slate-300 text-sm">Setting up your account...</p>
          </div>
        )}
      </div>
    </div>
  );
}