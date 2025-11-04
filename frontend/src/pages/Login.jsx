import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toastify import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // basic validation
    if (!email || !password) {
      toast.warn("⚠️ Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const role = (res.data.role || "").toLowerCase();
      const token = res.data.token;

      if (!token) {
        toast.error("❌ No token received from server. Try again later.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // role-based redirect
      switch (role) {
        case "startup":
          toast.success("🚀 Welcome back, Startup!");
          navigate("/startup-dashboard");
          break;
        case "investor":
          toast.success("💼 Welcome back, Investor!");
          navigate("/investor-dashboard");
          break;
        case "admin":
          toast.success("🛠️ Welcome Admin — managing innovation!");
          navigate("/admin-dashboard");
          break;
        default:
          toast.error("Unknown user role. Please contact support.");
          break;
      }
    } catch (err) {
      console.error("❌ Login Error:", err);

      if (err.response?.status === 401) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error("Server error during login. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="app-title">FundFusion PitchHub</h1>
        <h2 className="auth-heading">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
