import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPending = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/startups/pending/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPending(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Error fetching pending pitches:", err);
        setPending([]);
      } finally {
        setLoading(false);
      }
    };
    loadPending();
  }, []);

  const updateStatus = async (id, action) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/startups/pending/${id}/approve`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistically update UI
      setPending((prev) => prev.filter((p) => p.id !== id));
      alert(`✅ Pitch ${action}!`);
    } catch (err) {
      console.error("⚠️ Update status error:", err);
      alert("Error updating pitch status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <p className="muted">Loading pending pitches...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1>Admin Dashboard</h1>
      <h2 className="section-title">Pending Startup Pitches</h2>

      {pending.length === 0 ? (
        <p className="muted">No pending pitches right now.</p>
      ) : (
        <div className="card-grid">
          {pending.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p>{p.pitch_text}</p>
              <div className="meta-row">
                <span>₹ {p.money_requested}</span>
                <div className="btn-row">
                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(p.id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(p.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
