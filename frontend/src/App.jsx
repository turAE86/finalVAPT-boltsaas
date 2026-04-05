import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Scanner from "./pages/Scanner";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import OAuthSuccess from "./pages/OAuthSuccess";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WebAppSecurity from "./services/web-app-security";
import NetworkInfrastructure from "./services/network-infrastructure";
import CloudSecurity from "./services/cloud-secuity";
import ApiSecurity from "./services/api-security";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top with multiple methods and delays
    const scrollToTop = () => {
      // Method 1: window.scrollTo
      window.scrollTo(0, 0);

      // Method 2: Direct DOM manipulation
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      // Method 3: scrollIntoView
      document.body.scrollIntoView({ behavior: 'instant', block: 'start' });

      // Method 4: Force scroll on html element
      document.documentElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    };

    // Execute immediately
    scrollToTop();

    // Execute after very short delay
    const timer1 = setTimeout(scrollToTop, 0);

    // Execute after short delay
    const timer2 = setTimeout(scrollToTop, 10);

    // Execute after longer delay to catch any rendering issues
    const timer3 = setTimeout(scrollToTop, 50);

    // Execute after even longer delay
    const timer4 = setTimeout(scrollToTop, 100);

    // Execute after route change is fully complete
    const timer5 = setTimeout(scrollToTop, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/scanner" element={<PrivateRoute><Scanner /></PrivateRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/web-app-security" element={<WebAppSecurity />} />
        <Route path="/network-infrastructure" element={<NetworkInfrastructure />} />
        <Route path="/cloud-security" element={<CloudSecurity />} />
        <Route path="/api-security" element={<ApiSecurity />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}
