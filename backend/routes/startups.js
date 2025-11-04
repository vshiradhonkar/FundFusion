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
 * @route POST /api/startups/create
 * @desc Startup creates a pitch
 */
router.post("/create", authMiddleware, createPitch);

/**
 * @route GET /api/startups/all
 * @desc Investors fetch all approved startups
 */
router.get("/all", getApprovedStartups);

/**
 * @route GET /api/startups/my-pitches
 * @desc Startup fetches their own submitted pitches
 * 🧠 NOTE: must come BEFORE /:id to prevent route conflicts
 */
router.get("/my-pitches", authMiddleware, async (req, res) => {
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
 * @route GET /api/startups/:id
 * @desc Fetch a startup by ID
 */
router.get("/:id", getStartupById);

/**
 * @route GET /api/startups/pending/list
 * @desc Admin fetches all pending startup pitches
 */
router.get("/pending/list", authMiddleware, adminOnly, getPending);

/**
 * @route POST /api/startups/pending/:id/approve
 * @desc Admin approves or rejects a startup pitch
 */
router.post("/pending/:id/approve", authMiddleware, adminOnly, updateStatus);

export default router;
