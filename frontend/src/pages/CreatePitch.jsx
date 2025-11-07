import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const CreatePitch = () => {
  const [form, setForm] = useState({
    name: "",
    pitch_text: "",
    money_requested: "",
    equity_offered: "",
    pitch_video_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const numericRegex = /^\d+$/;
    
    switch (name) {
      case 'name':
        return value && !nameRegex.test(value) ? 'Name can only contain letters and spaces' : '';
      case 'money_requested':
        return value && !numericRegex.test(value) ? 'Money requested must be numeric only' : '';
      case 'equity_offered':
        return value && !numericRegex.test(value) ? 'Equity offered must be numeric only' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    
    if (!form.name || !form.pitch_text || !form.money_requested) {
      toast.warn("⚠️ Please fill all required fields!");
      return;
    }

    // Check for validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      toast.error("❌ Please fix validation errors before submitting.");
      return;
    }

    if (isNaN(form.money_requested) || form.money_requested <= 0) {
      toast.error("💰 Money requested must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/startups/create",
        {
          name: form.name,
          pitch_text: form.pitch_text,
          money_requested: form.money_requested,
          equity_offered: form.equity_offered || null,
          pitch_video_url: form.pitch_video_url || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "🎉 Pitch submitted! Awaiting admin approval.");
        setForm({
          name: "",
          pitch_text: "",
          money_requested: "",
          equity_offered: "",
          pitch_video_url: "",
        });
      } else {
        toast.error(res.data.message || "❌ Could not submit pitch. Please try again.");
      }
    } catch (err) {
      console.error("❌ Pitch submission error:", err);
      toast.error("Server error while submitting pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <h1>Create Pitch</h1>

      <form className="pitch-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Startup Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.name}</div>}

        <textarea
          name="pitch_text"
          placeholder="Pitch Description"
          value={form.pitch_text}
          onChange={handleChange}
          required
        />

        <input
          name="money_requested"
          type="text"
          placeholder="Money Requested (₹)"
          value={form.money_requested}
          onChange={handleChange}
          required
        />
        {errors.money_requested && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.money_requested}</div>}

        <input
          name="equity_offered"
          type="text"
          placeholder="Equity Offered (%)"
          value={form.equity_offered}
          onChange={handleChange}
        />
        {errors.equity_offered && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '0.25rem'}}>{errors.equity_offered}</div>}

        <input
          name="pitch_video_url"
          placeholder="Pitch Video URL (optional)"
          value={form.pitch_video_url}
          onChange={handleChange}
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Pitch"}
        </button>
      </form>
    </div>
  );
};

export default CreatePitch;
