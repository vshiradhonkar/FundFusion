const db = require("../db");

exports.listDeals = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM deals");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

exports.getDealsForStartup = async (req, res) => {
  try {
    const startupId = req.params.startupId;
    const [rows] = await db.query("SELECT * FROM deals WHERE startup_id = ?", [startupId]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};
