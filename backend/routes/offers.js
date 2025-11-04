import express from "express";
import {
  makeOffer,
  getOffersForStartup,
  acceptOffer,
} from "../controllers/offerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import db from "../db.js";

const router = express.Router();

/**
 * @route POST /api/offers/make
 * @desc Investor creates a new offer for a startup
 */
router.post("/make", authMiddleware, makeOffer);

/**
 * @route GET /api/offers/startup/:startupId
 * @desc Fetch all offers for a specific startup
 */
router.get("/startup/:startupId", authMiddleware, getOffersForStartup);

/**
 * @route GET /api/offers/investor
 * @desc Fetch all offers made by the logged-in investor
 */
router.get("/investor", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM offers WHERE investor_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching investor offers:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route POST /api/offers/accept/:offerId
 * @desc Startup accepts or rejects an offer (handled by controller)
 */
router.post("/accept/:offerId", authMiddleware, acceptOffer);

export default router;
