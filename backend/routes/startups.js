import express from "express";
import {
  createPitch,
  getApprovedStartups,
  getStartupById,
  getPending,
  updateStatus,
} from "../controllers/startupController.js";

import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";
import db from "../db.js";

const router = express.Router();

/**
 * =====================================================
 * STARTUP ROUTES — Handles Pitches, Approvals & Listings
 * =====================================================
 */

/**
 * @route POST /api/startups/create
 * @desc Startup creates a new pitch
 */
router.post("/create", authMiddleware, async (req, res, next) => {
  console.log("➡️ POST /api/startups/create");
  next();
}, createPitch);

/**
 * @route GET /api/startups/my-pitches
 * @desc Startup fetches their own pitches
 * ✅ Must come BEFORE /:id to prevent conflicts
 */
router.get("/my-pitches", authMiddleware, async (req, res) => {
  console.log("➡️ GET /api/startups/my-pitches");
  try {
    const [rows] = await db.query("SELECT * FROM startups WHERE user_id=?", [req.user.id]);
    return res.json(rows);
  } catch (err) {
    console.error("⚠️ Error fetching user's pitches:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your pitches",
    });
  }
});

/**
 * @route GET /api/startups/all
 * @desc Investors fetch all approved startups
 */
router.get("/all", async (req, res, next) => {
  console.log("➡️ GET /api/startups/all");
  next();
}, getApprovedStartups);

/**
 * ===============================
 * 🧑‍⚖️ ADMIN-ONLY ROUTES
 * ===============================
 */

/**
 * @route GET /api/startups/pending/list
 * @desc Admin fetches all pending pitches
 */
router.get("/pending/list", authMiddleware, adminOnly, async (req, res, next) => {
  console.log("➡️ GET /api/startups/pending/list");
  next();
}, getPending);

/**
 * @route POST /api/startups/pending/:id/approve
 * @desc Admin approves or rejects a startup pitch
 */
router.post("/pending/:id/approve", authMiddleware, adminOnly, async (req, res, next) => {
  console.log(`➡️ POST /api/startups/pending/${req.params.id}/approve`);
  next();
}, updateStatus);

/**
 * @route GET /api/startups/:id
 * @desc Fetch startup by ID
 * ⚠️ Keep this LAST — it matches any /:id
 */
router.get("/:id", async (req, res, next) => {
  console.log(`➡️ GET /api/startups/${req.params.id}`);
  next();
}, getStartupById);

export default router;
