import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOffers = async () => {
      if (!token) {
        toast.warn("⚠️ Session expired. Please log in again.");
        return;
      }

      setLoading(true);

      try {
        let res;

        if (role === "investor") {
          //fetch ofers made by investor
          res = await axios.get("http://localhost:5000/api/offers/investor", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (role === "startup") {
          //fetch startup ID dynamically
          const pitchRes = await axios.get(
            "http://localhost:5000/api/startups/my-pitches",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!pitchRes.data.length) {
            toast.info("You haven’t submitted any startup pitches yet.");
            setOffers([]);
            setLoading(false);
            return;
          }

          const startupId = pitchRes.data[0].id;
          console.log("📦 Fetched Startup ID:", startupId);

          // fetch ofers received 4 startup
          res = await axios.get(
            `http://localhost:5000/api/offers/startup/${startupId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          toast.error("Invalid user role.");
          return;
        }

        setOffers(Array.isArray(res.data) ? res.data : []);

        if (!res.data.length) {
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

    fetchOffers();
  }, [role, token]);

  const handleResponse = async (offerId, action) => {
    try {
      await axios.post(
        `http://localhost:5000/api/offers/accept/${offerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOffers((prev) => prev.filter((o) => o.id !== offerId));

      if (action === "accepted") {
        toast.success("✅ Offer accepted successfully!");
      } else {
        toast.info("🚫 Offer rejected.");
      }
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
      <h1>{role === "investor" ? "My Offers" : "Received Offers"}</h1>

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
              <p>Status: {o.status}</p>

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
