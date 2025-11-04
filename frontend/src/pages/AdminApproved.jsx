import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toastify import
import "./Dashboard.css";

const AdminApproved = () => {
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApproved = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/startups/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApproved(Array.isArray(res.data) ? res.data : []);

        if (res.data.length === 0) {
          toast.info("No approved startups found yet.");
        } else {
          toast.success("✅ Approved startups loaded successfully!");
        }
      } catch (err) {
        console.error("❌ Error fetching approved startups:", err);
        toast.error("Failed to load approved startups. Please try again.");
        setApproved([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApproved();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Approved Pitches</h1>
        <p className="muted">Loading approved startups...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1>Approved Startup Pitches</h1>

      {approved.length === 0 ? (
        <p className="muted">No approved startups found.</p>
      ) : (
        <div className="card-grid">
          {approved.map((s) => (
            <div key={s.id} className="card">
              <h3>{s.name}</h3>
              <p>{s.pitch_text}</p>
              <div className="meta-row">
                <span>💰 ₹ {s.money_requested}</span>
                <span>Equity Offered: {s.equity_offered || "N/A"}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApproved;
