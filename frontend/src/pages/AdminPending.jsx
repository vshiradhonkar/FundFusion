import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const AdminPending = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          "http://localhost:5000/api/startups/pending/list",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPending(Array.isArray(res.data) ? res.data : []);

        if (res.data.length === 0) {
          toast.info("No pending pitches found — all caught up!");
        }
      } catch (err) {
        console.error("❌ Error fetching pending startups:", err);
        toast.error("Failed to load pending pitches. Please try again.");
        setPending([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://localhost:5000/api/startups/pending/${id}/approve`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPending((prev) => prev.filter((p) => p.id !== id));

      if (action === "approve") {
        toast.success("✅ Pitch approved successfully!");
      } else {
        toast.info("🚫 Pitch rejected.");
      }
    } catch (err) {
      console.error("⚠️ Error updating pitch status:", err);
      toast.error("Failed to update pitch status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Pending Pitches</h1>
        <p className="muted">Loading pending pitches...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1>Pending Startup Pitches</h1>

      {pending.length === 0 ? (
        <p className="muted">No pending pitches right now.</p>
      ) : (
        <div className="card-grid">
          {pending.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p>{p.pitch_text}</p>
              <div className="meta-row">
                <span>💰 ₹ {p.money_requested}</span>
                <div className="btn-row">
                  <button
                    className="approve-btn"
                    onClick={() => handleAction(p.id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleAction(p.id, "reject")}
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

export default AdminPending;
