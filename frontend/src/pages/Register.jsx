import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toastify import

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("startup");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validation with instant feedback
    if (!name || !email || !password) {
      toast.warn("⚠️ Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.info("🔒 Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("🎉 Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("❌ Registration Error:", err);

      if (err.response && err.response.data?.message) {
        toast.error(`🚫 ${err.response.data.message}`);
      } else {
        toast.error("Server error during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="app-title">FundFusion PitchHub</h1>
        <h2 className="auth-heading">Register</h2>

        <form onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <select
            className="auth-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="startup">Startup</option>
            <option value="investor">Investor</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
