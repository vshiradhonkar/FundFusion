import db from "../db.js";

/**
 * @desc Investor makes a new offer to a startup
 * @route POST /api/offers/make
 */
export async function makeOffer(req, res) {
  const { startup_id, amount_offered, equity_requested } = req.body;

  if (!startup_id || !amount_offered) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await db.query(
      "INSERT INTO offers (investor_id, startup_id, amount_offered, equity_requested, status) VALUES (?, ?, ?, ?, 'pending')",
      [req.user.id, startup_id, amount_offered, equity_requested || null]
    );

    return res.status(201).json({ success: true, message: "Offer created successfully" });
  } catch (err) {
    console.error("❌ Offer creation error:", err);
    return res.status(500).json({ success: false, message: "Server error while creating offer" });
  }
}

/**
 * @desc Get all offers for a specific startup (used by startup users)
 * @route GET /api/offers/startup/:startupId
 */
export async function getOffersForStartup(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM offers WHERE startup_id=? ORDER BY id DESC",
      [req.params.startupId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching offers for startup:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching offers" });
  }
}

/**
 * @desc Accept an offer and create a deal
 * @route POST /api/offers/accept/:offerId
 */
export async function acceptOffer(req, res) {
  const offerId = req.params.offerId;

  try {
    const [[offer]] = await db.query("SELECT * FROM offers WHERE id=?", [offerId]);

    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    if (offer.status === "accepted") {
      return res.status(400).json({ success: false, message: "Offer already accepted" });
    }

    // Update offer status
    await db.query("UPDATE offers SET status='accepted' WHERE id=?", [offerId]);

    // Insert into deals table
    await db.query(
      "INSERT INTO deals (startup_id, investor_id, amount_final, equity_final) VALUES (?,?,?,?)",
      [
        offer.startup_id,
        offer.investor_id,
        offer.amount_offered,
        offer.equity_requested,
      ]
    );

    return res.json({ success: true, message: "Offer accepted and deal created" });
  } catch (err) {
    console.error("⚠️ Offer acceptance error:", err);
    return res.status(500).json({ success: false, message: "Server error while accepting offer" });
  }
}
