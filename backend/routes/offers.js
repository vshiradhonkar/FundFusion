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

/**
 * @route DELETE /api/offers/delete/:id
 * Delete an offer
 */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const offerId = req.params.id;

  try {
    const [[offer]] = await db.query("SELECT * FROM offers WHERE id = ?", [offerId]);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    // Only investor who made the offer or admin can delete
    if (req.user.role !== "admin" && offer.investor_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Only allow deletion of pending offers
    if (offer.status !== "pending") {
      return res.status(400).json({ success: false, message: "Cannot delete accepted/rejected offers" });
    }

    await db.query("DELETE FROM offers WHERE id = ?", [offerId]);
    return res.json({ success: true, message: "Offer deleted successfully" });
  } catch (err) {
    console.error("❌ Delete offer error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
