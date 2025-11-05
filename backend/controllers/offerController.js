import db from "../db.js";

/**
 *Investor makes a new offer to a startup
 * @route POST /api/offers/make
 */
export async function makeOffer(req, res) {
  const { startup_id, amount_offered, equity_requested } = req.body;

  if (!startup_id || !amount_offered) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: startup_id or amount_offered.",
    });
  }

  try {
    console.log(`💰 New offer: investor ${req.user.id} → startup ${startup_id}`);

    await db.query(
      `INSERT INTO offers (investor_id, startup_id, amount_offered, equity_requested, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [req.user.id, startup_id, amount_offered, equity_requested || null]
    );

    return res
      .status(201)
      .json({ success: true, message: "✅ Offer created successfully." });
  } catch (err) {
    console.error("❌ Offer creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating offer.",
      error: err.message,
    });
  }
}

/**
 *Get all offers for a specific startup (for startup users)
 * @route GET /api/offers/startup/:startupId
 */
export async function getOffersForStartup(req, res) {
  try {
    const startupId = req.params.startupId;

    const [rows] = await db.query(
      `SELECT o.*, u.name AS investor_name
       FROM offers o
       JOIN users u ON o.investor_id = u.id
       WHERE o.startup_id = ?
       ORDER BY o.id DESC`,
      [startupId]
    );

    console.log(`📦 Loaded ${rows.length} offers for startup ${startupId}`);
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching offers for startup:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching offers.",
      error: err.message,
    });
  }
}

/**
 *Get all offers made by investor(for investordashboard)
 * @route GET /api/offers/investor
 */
export async function getOffersForInvestor(req, res) {
  try {
    const investorId = req.user.id;

    const [rows] = await db.query(
      `SELECT o.*, s.name AS startup_name, s.pitch_text
       FROM offers o
       JOIN startups s ON o.startup_id = s.id
       WHERE o.investor_id = ?
       ORDER BY o.id DESC`,
      [investorId]
    );

    console.log(`📊 Loaded ${rows.length} offers for investor ${investorId}`);
    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching investor offers:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching investor offers.",
      error: err.message,
    });
  }
}

/**
 *Startup accepts an offer — creates a deal + updates status
 * @route POST /api/offers/accept/:offerId
 */
export async function acceptOffer(req, res) {
  const offerId = req.params.offerId;

  try {
    console.log(`⚙️ Processing offer acceptance for offer ID ${offerId}`);

    const [[offer]] = await db.query("SELECT * FROM offers WHERE id = ?", [offerId]);

    if (!offer) {
      console.warn("⚠️ Offer not found:", offerId);
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    if (offer.status === "accepted") {
      console.warn("⚠️ Offer already accepted:", offerId);
      return res.status(400).json({ success: false, message: "Offer already accepted." });
    }

    //Fetch related startup to confirm ownership
    const [[startup]] = await db.query("SELECT * FROM startups WHERE id = ?", [offer.startup_id]);

    if (!startup) {
      console.warn("⚠️ Startup not found for offer:", offer.startup_id);
      return res.status(404).json({ success: false, message: "Startup not found." });
    }

    if (req.user.role !== "startup") {
      console.warn("🚫 Non-startup tried to accept an offer:", req.user);
      return res.status(403).json({ success: false, message: "Only startup users can accept offers." });
    }

    if (startup.user_id !== req.user.id) {
      console.warn(`🚫 Unauthorized startup user ${req.user.id} tried to accept offer for startup ${startup.id}`);
      return res.status(403).json({ success: false, message: "You do not own this startup." });
    }

    //Update offer status
    const [updateRes] = await db.query("UPDATE offers SET status='accepted' WHERE id=?", [offerId]);
    console.log("🟢 Offer marked as accepted:", updateRes);

    //Create deal record
    try {
      const [dealRes] = await db.query(
        "INSERT INTO deals (startup_id, investor_id, amount_final, equity_final) VALUES (?, ?, ?, ?)",
        [offer.startup_id, offer.investor_id, offer.amount_offered, offer.equity_requested]
      );
      console.log("💼 Deal created successfully:", dealRes);
    } catch (dealErr) {
      console.error("🔥 Failed inserting deal:", dealErr);
      return res.status(500).json({
        success: false,
        message: "Failed to create deal record.",
        error: dealErr.message,
      });
    }

    // Auto-reject all other pending offers for the same startup
    await db.query(
      "UPDATE offers SET status='rejected' WHERE startup_id=? AND id<>? AND status='pending'",
      [offer.startup_id, offerId]
    );

    console.log("🧹 Cleaned up other pending offers for startup:", offer.startup_id);

    return res.json({
      success: true,
      message: "✅ Offer accepted, deal created, and other offers rejected.",
    });
  } catch (err) {
    console.error("🔥 Offer acceptance error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while accepting offer.",
      error: err.message,
    });
  }
}

/**
 *Startup rejects an offer
 * @route POST /api/offers/reject/:offerId
 */
export async function rejectOffer(req, res) {
  const offerId = req.params.offerId;

  try {
    console.log(`🚫 Rejecting offer ID ${offerId}`);

    const [[offer]] = await db.query("SELECT * FROM offers WHERE id = ?", [offerId]);

    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found." });
    }

    if (offer.status === "accepted") {
      return res.status(400).json({ success: false, message: "Cannot reject an already accepted offer." });
    }

    await db.query("UPDATE offers SET status='rejected' WHERE id=?", [offerId]);
    console.log(`❌ Offer ${offerId} rejected by startup ${req.user.id}`);

    return res.json({ success: true, message: "Offer rejected successfully." });
  } catch (err) {
    console.error("🔥 Offer rejection error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting offer.",
      error: err.message,
    });
  }
}
