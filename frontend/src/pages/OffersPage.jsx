import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const token = localStorage.getItem("token");

  const fetchOffers = async () => {
    if (!token) {
      toast.warn("⚠️ Session expired. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (role === "investor") {
        // Fetch offers made by the investor
        res = await axios.get("http://localhost:5000/api/offers/investor", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (role === "startup") {
        // First get the startup's own pitches to find their startup ID
        const startupRes = await axios.get("http://localhost:5000/api/startups/my-pitches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (startupRes.data.length === 0) {
          toast.info("Create a pitch first to receive offers.");
          setOffers([]);
          setLoading(false);
          return;
        }

        // Get offers for the first approved startup
        const approvedStartup = startupRes.data.find(s => s.status === 'approved');
        if (!approvedStartup) {
          toast.info("Your pitch needs to be approved before you can receive offers.");
          setOffers([]);
          setLoading(false);
          return;
        }

        // Fetch offers for this startup
        res = await axios.get(`http://localhost:5000/api/offers/startup/${approvedStartup.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        toast.error("🚫 Access denied.");
        setLoading(false);
        return;
      }

      setOffers(Array.isArray(res.data) ? res.data : []);

      if (res.data.length === 0) {
        toast.info("No offers available yet.");
      }
    } catch (err) {
      console.error("❌ Offer fetch error:", err);
      toast.error("Failed to load offers. Please try again later.");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [role, token]);

  const handleResponse = async (offerId, action) => {
    try {
      const endpoint = action === "accepted" ? "accept" : "reject";
      await axios.post(
        `http://localhost:5000/api/offers/${endpoint}/${offerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove the offer from the list for startups
      setOffers((prev) => prev.filter((o) => o.id !== offerId));

      if (action === "accepted") {
        toast.success("✅ Offer accepted successfully!");
      } else {
        toast.info("🚫 Offer rejected.");
      }
      
      // Refresh the offers list to ensure consistency
      setTimeout(() => fetchOffers(), 1000);
      
    } catch (err) {
      console.error("⚠️ Offer response error:", err);
      toast.error("Error updating offer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>{role === "investor" ? "My Offers" : "Received Offers"}</h1>
        <p className="muted">Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{role === "investor" ? "My Offers" : "Received Offers"}</h1>
        {role === "investor" && (
          <button 
            className="btn" 
            onClick={fetchOffers}
            disabled={loading}
            style={{ padding: '0.5rem 1rem' }}
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        )}
      </div>

      {offers.length === 0 ? (
        <p className="muted">No offers available yet.</p>
      ) : (
        <div className="card-grid">
          {offers.map((o) => (
            <div key={o.id} className="card">
              <h3>{role === "investor" ? o.startup_name : o.investor_name}</h3>
              <p>Offered Amount: ₹{o.amount_offered || o.amount}</p>
              <p>
                Equity Requested:{" "}
                {o.equity_requested ? `${o.equity_requested}%` : "N/A"}
              </p>
              <p>Status: {role === "investor" ? (
                o.status === "accepted" ? "✅ Deal Formed" :
                o.status === "rejected" ? "❌ Offer Rejected" :
                "⏳ Pending Response"
              ) : o.status}</p>

              {role === "startup" && o.status === "pending" && (
                <div className="btn-row">
                  <button
                    className="approve-btn"
                    onClick={() => handleResponse(o.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleResponse(o.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;