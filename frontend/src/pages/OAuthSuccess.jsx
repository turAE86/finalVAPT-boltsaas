import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      auth.login({ token });
      navigate("/scan");
    }
  }, []);

  return <p>Logging you in...</p>;
}
