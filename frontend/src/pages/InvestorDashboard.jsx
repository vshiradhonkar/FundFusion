import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const InvestorDashboard = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      const token = localStorage.getItem("token");
      try {
        //fetch approved startups
        const res = await axios.get("http://localhost:5000/api/startups/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStartups(Array.isArray(res.data) ? res.data : []);

        if (res.data.length === 0) {
          toast.info("No approved startups found yet — check back soon!");
        }
      } catch (err) {
        console.error("❌ Error fetching approved startups:", err);
        toast.error("Failed to load startups. Please try again later.");
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const makeOffer = async (startupId) => {
    const token = localStorage.getItem("token");

    const amount_offered = prompt("💰 Enter your offer amount (₹):");
    if (!amount_offered || isNaN(amount_offered) || amount_offered <= 0) {
      toast.warn("Please enter a valid positive number for the offer amount.");
      return;
    }

    const equity_requested =
      prompt("📊 Enter the equity percentage you're requesting (optional):") ||
      null;

    try {
      await axios.post(
        "http://localhost:5000/api/offers/make",
        { startup_id: startupId, amount_offered, equity_requested },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Offer sent successfully!");
    } catch (err) {
      console.error("⚠️ Error sending offer:", err);
      toast.error("Failed to send offer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Investor Dashboard</h1>
        <p className="muted">Loading approved startups...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1>Investor Dashboard</h1>
      <h2 className="section-title">Approved Startups</h2>

      {startups.length === 0 ? (
        <p className="muted">No approved startups available yet.</p>
      ) : (
        <div className="card-grid">
          {startups.map((s) => (
            <div key={s.id} className="card">
              <h3>{s.name}</h3>
              <p>{s.pitch_text}</p>
              <div className="meta-row">
                <span>💸 ₹ {s.money_requested}</span>
                <button
                  className="primary-btn"
                  onClick={() => makeOffer(s.id)}
                >
                  Make Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;
