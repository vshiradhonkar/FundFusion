import db from "../db.js";

/**
 *Startup creates a new pitch
 * @route POST /api/startups/create
 */
export async function createPitch(req, res) {
  const { name, pitch_text, money_requested, equity_offered } = req.body;

  if (!name || !pitch_text || !money_requested) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
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
 *Get all approved startups (visible to investors)
 * @route GET /api/startups/all
 */
export async function getApprovedStartups(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name AS founder_name, u.email AS founder_email,
              CASE WHEN d.id IS NOT NULL THEN true ELSE false END AS hasDeal
       FROM startups s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN deals d ON s.id = d.startup_id
       WHERE s.status = 'approved'
       ORDER BY s.id DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching approved startups:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching startups" });
  }
}

/**
 *Get single startup by ID
 * @route GET /api/startups/:id
 */
export async function getStartupById(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name AS founder_name, u.email AS founder_email
       FROM startups s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Startup not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("⚠️ Error fetching startup by ID:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error while fetching startup" });
  }
}

/**
 * Get all pending startup pitches (for admin)
 * @route GET /api/startups/pending/list
 */
export async function getPending(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name AS founder_name, u.email AS founder_email
       FROM startups s
       JOIN users u ON s.user_id = u.id
       WHERE s.status='pending'
       ORDER BY s.id DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("⚠️ Error fetching pending startups:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error while fetching pending" });
  }
}

/**
 * Update startup status (approve/reject) by Admin
 * @route POST /api/startups/pending/:id/approve
 */
export async function updateStatus(req, res) {
  const { action } = req.body;
  const validActions = ["approve", "reject"];

  if (!validActions.includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action" });
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  try {
    //Confirm startup exists
    const [[startup]] = await db.query("SELECT * FROM startups WHERE id = ?", [
      req.params.id,
    ]);
    if (!startup) {
      return res
        .status(404)
        .json({ success: false, message: "Startup not found" });
    }

    //Update startup status
    await db.query("UPDATE startups SET status = ? WHERE id = ?", [
      newStatus,
      req.params.id,
    ]);

    //Auto-log admin decision in a lightweight audit table (optional)
    try {
      await db.query(
        `INSERT INTO startup_audit (startup_id, admin_id, action_taken, timestamp)
         VALUES (?, ?, ?, NOW())`,
        [req.params.id, req.user.id, newStatus]
      );
    } catch (auditErr) {
      console.warn("⚠️ Audit table not available, skipping audit log:", auditErr.message);
    }

    //If approved, notify investor route
    if (newStatus === "approved") {
      console.log(`✅ Startup ${startup.name} approved by admin.`);
    }

    return res.json({
      success: true,
      message: `Pitch ${newStatus} successfully`,
      status: newStatus,
    });
  } catch (err) {
    console.error("⚠️ Error updating startup status:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating startup status",
    });
  }
}
