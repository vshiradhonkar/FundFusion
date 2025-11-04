import db from "../db.js";

/**
 * @desc Create a new startup pitch
 * @route POST /api/startups/create
 */
export async function createPitch(req, res) {
  const { name, pitch_text, money_requested, equity_offered } = req.body;

  if (!name || !pitch_text || !money_requested) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    await db.query(
      `INSERT INTO startups 
       (user_id, name, pitch_text, money_requested, equity_offered, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, name, pitch_text, money_requested, equity_offered || null]
    );

    return res.status(201).json({
      success: true,
      message: "Pitch created successfully and sent for admin review",
    });
  } catch (err) {
    console.error("❌ Pitch creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating pitch",
    });
  }
}

/**
 * @desc Get all approved startups (visible to investors)
 * @route GET /api/startups/all
 */
export async function getApprovedStartups(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM startups WHERE status='approved' ORDER BY id DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching approved startups:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @desc Get single startup by ID
 * @route GET /api/startups/:id
 */
export async function getStartupById(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM startups WHERE id=?", [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("⚠️ Error fetching startup by ID:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @desc Get all pending startup pitches (for admin review)
 * @route GET /api/startups/pending/list
 */
export async function getPending(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM startups WHERE status='pending' ORDER BY id DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("⚠️ Error fetching pending startups:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * @desc Update startup pitch status (approve/reject)
 * @route POST /api/startups/pending/:id/approve
 */
export async function updateStatus(req, res) {
  const { action } = req.body;
  const validActions = ["approve", "reject"];

  if (!validActions.includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  try {
    const newStatus = action === "approve" ? "approved" : "rejected";
    const [result] = await db.query("UPDATE startups SET status=? WHERE id=?", [
      newStatus,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }

    return res.json({
      success: true,
      message: `Pitch ${newStatus} successfully`,
      status: newStatus,
    });
  } catch (err) {
    console.error("⚠️ Error updating startup status:", err);
    return res.status(500).json({ success: false, message: "Server error while updating status" });
  }
}
