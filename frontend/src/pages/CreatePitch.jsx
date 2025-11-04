import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ import toast
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // basic validation
    if (!form.name || !form.pitch_text || !form.money_requested) {
      toast.warn("⚠️ Please fill all required fields!");
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

        <textarea
          name="pitch_text"
          placeholder="Pitch Description"
          value={form.pitch_text}
          onChange={handleChange}
          required
        />

        <input
          name="money_requested"
          type="number"
          placeholder="Money Requested (₹)"
          value={form.money_requested}
          onChange={handleChange}
          required
        />

        <input
          name="equity_offered"
          type="number"
          placeholder="Equity Offered (%)"
          value={form.equity_offered}
          onChange={handleChange}
        />

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
