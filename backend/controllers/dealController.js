const db = require("../db");

exports.listDeals = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM deals");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};
