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
 * STARTUP ROUTES,handles pitches n approvals & listings
 */

/**
 * @route POST /api/startups/create
 * Startup creates a new pitch
 */
router.post("/create", authMiddleware, async (req, res, next) => {
  console.log("➡️ POST /api/startups/create");
  next();
}, createPitch);

/**
 * @route GET /api/startups/my-
 * Startup fetches their own pitches
 * */
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
 *Investors fetch all approved startups
 */
router.get("/all", async (req, res, next) => {
  console.log("➡️ GET /api/startups/all");
  next();
}, getApprovedStartups);

/*ADMIN-ONLY ROUTES*/

/**
 * @route GET /api/startups/pending/list
 *Admin fetches all pending pitches
 */
router.get("/pending/list", authMiddleware, adminOnly, async (req, res, next) => {
  console.log("➡️ GET /api/startups/pending/list");
  next();
}, getPending);

/**
 * @route POST /api/startups/pending/:id/approve
 * Admin approves or rejects a startup pitch
 */
router.post("/pending/:id/approve", authMiddleware, adminOnly, async (req, res, next) => {
  console.log(`➡️ POST /api/startups/pending/${req.params.id}/approve`);
  next();
}, updateStatus);

/**
 * @route PUT /api/startups/update/:id
 * Update startup pitch details
 */
router.put("/update/:id", authMiddleware, async (req, res) => {
  const { name, pitch_text, money_requested, equity_offered } = req.body;
  const startupId = req.params.id;

  try {
    // Check if startup exists and user owns it (or is admin)
    const [[startup]] = await db.query("SELECT * FROM startups WHERE id = ?", [startupId]);
    if (!startup) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }

    if (req.user.role !== "admin" && startup.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Update startup details
    await db.query(
      "UPDATE startups SET name = ?, pitch_text = ?, money_requested = ?, equity_offered = ? WHERE id = ?",
      [name || startup.name, pitch_text || startup.pitch_text, money_requested || startup.money_requested, equity_offered || startup.equity_offered, startupId]
    );

    return res.json({ success: true, message: "Startup updated successfully" });
  } catch (err) {
    console.error("❌ Update startup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route PUT /api/startups/status/:id
 * Update startup status (admin only)
 */
router.put("/status/:id", authMiddleware, adminOnly, async (req, res) => {
  const { status } = req.body;
  const startupId = req.params.id;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const [[startup]] = await db.query("SELECT * FROM startups WHERE id = ?", [startupId]);
    if (!startup) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }

    await db.query("UPDATE startups SET status = ? WHERE id = ?", [status, startupId]);
    return res.json({ success: true, message: `Startup status updated to ${status}` });
  } catch (err) {
    console.error("❌ Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route DELETE /api/startups/delete/:id
 * Delete startup pitch
 */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const startupId = req.params.id;

  try {
    const [[startup]] = await db.query("SELECT * FROM startups WHERE id = ?", [startupId]);
    if (!startup) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }

    // Only startup owner or admin can delete
    if (req.user.role !== "admin" && startup.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Delete related offers first
    await db.query("DELETE FROM offers WHERE startup_id = ?", [startupId]);
    
    // Delete startup
    await db.query("DELETE FROM startups WHERE id = ?", [startupId]);

    return res.json({ success: true, message: "Startup deleted successfully" });
  } catch (err) {
    console.error("❌ Delete startup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route GET /api/startups/:id
 *Fetch startup by ID
 * matches any /:id
 */
router.get("/:id", async (req, res, next) => {
  console.log(`➡️ GET /api/startups/${req.params.id}`);
  next();
}, getStartupById);

export default router;
