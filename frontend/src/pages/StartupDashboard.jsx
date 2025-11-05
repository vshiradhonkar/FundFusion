import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const StartupDashboard = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPitches = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("⚠️ Session expired. Please log in again.");
        return;
      }

      try {
        //fetch user's pitches
        const res = await axios.get(
          "http://localhost:5000/api/startups/my-pitches",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPitches(Array.isArray(res.data) ? res.data : []);

        //no pitches thn show info toast 1s
        if (res.data.length === 0) {
          toast.info("You haven’t created any pitches yet. Start one now!");
        }
      } catch (err) {
        console.error("❌ Error fetching pitches:", err);
        toast.error("Failed to load your pitches. Please try again later.");
        setPitches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Startup Dashboard</h1>
        <p className="muted">Loading your pitches...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dash-header">
        <h1>Startup Dashboard</h1>
        <a className="primary-btn" href="/create-pitch">
          Create Pitch
        </a>
      </div>

      <h2 className="section-title">My Pitches</h2>

      {pitches.length === 0 ? (
        <p className="muted">No pitches found. Create one!</p>
      ) : (
        <div className="card-grid">
          {pitches.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p>{p.pitch_text}</p>
              <div className="meta-row">
                <span>💰 ₹ {p.money_requested}</span>
                <span
                  className={`badge ${p.status || "pending"}`}
                  style={{
                    textTransform: "capitalize",
                    background:
                      p.status === "approved"
                        ? "#4caf50"
                        : p.status === "rejected"
                        ? "#f44336"
                        : "#ff9800",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  {p.status || "pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StartupDashboard;
