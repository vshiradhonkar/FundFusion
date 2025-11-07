import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("startup");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (fieldName, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const nameRegex = /^[A-Za-z\s]+$/;
    
    switch (fieldName) {
      case 'name':
        return value && !nameRegex.test(value) ? 'Name can only contain letters and spaces' : '';
      case 'email':
        return value && !emailRegex.test(value) ? 'Invalid email format' : '';
      case 'password':
        return value && !passwordRegex.test(value) ? 'Password must be at least 8 characters with uppercase, lowercase, and number' : '';
      default:
        return '';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warn("⚠️ Please fill all required fields.");
      return;
    }

    // Check for validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      toast.error("❌ Please fix validation errors before submitting.");
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
            onChange={(e) => {
              setName(e.target.value);
              const error = validateField('name', e.target.value);
              setErrors({ ...errors, name: error });
            }}
            required
          />
          {errors.name && <div style={{color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.name}</div>}
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              const error = validateField('email', e.target.value);
              setErrors({ ...errors, email: error });
            }}
            required
          />
          {errors.email && <div style={{color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.email}</div>}
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              const error = validateField('password', e.target.value);
              setErrors({ ...errors, password: error });
            }}
            required
          />
          {errors.password && <div style={{color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.password}</div>}

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
