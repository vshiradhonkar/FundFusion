import express from "express";
import {
  makeOffer,
  getOffersForStartup,
  acceptOffer,
  rejectOffer,
} from "../controllers/offerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import db from "../db.js";

const router = express.Router();

/**
 * Offer Routes
 * Handles investor offer creation, startup offer management,
 * and retrieval for both sides.
 */

// Investor creates new offer for startup
router.post("/make", authMiddleware, (req, res, next) => {
  console.log("➡️ POST /api/offers/make");
  next();
}, makeOffer);

//offers for  specific startup(startup view)
router.get("/startup/:startupId", authMiddleware, (req, res, next) => {
  console.log("➡️ GET /api/offers/startup/" + req.params.startupId);
  // Only allow startup users to view offers
  if (req.user.role !== "startup") {
    return res.status(403).json({ success: false, message: "Access denied. Only startups can view offers." });
  }
  next();
}, getOffersForStartup);

// all offers made by investor
router.get("/investor", authMiddleware, (req, res, next) => {
  console.log("➡️ GET /api/offers/investor");
  // Only allow investor users to view their offers
  if (req.user.role !== "investor") {
    return res.status(403).json({ success: false, message: "Access denied. Only investors can view offers." });
  }
  next();
}, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, s.name AS startup_name, s.pitch_text
       FROM offers o
       JOIN startups s ON o.startup_id = s.id
       WHERE o.investor_id = ?
       ORDER BY o.id DESC`,
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching investor offers:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

//Startup accepts an offer — creates a deal
router.post("/accept/:offerId", authMiddleware, (req, res, next) => {
  console.log("➡️ POST /api/offers/accept/" + req.params.offerId);
  next();
}, acceptOffer);

//Startup rejects an offer
router.post("/reject/:offerId", authMiddleware, (req, res, next) => {
  console.log("➡️ POST /api/offers/reject/" + req.params.offerId);
  next();
}, rejectOffer);

export default router;
