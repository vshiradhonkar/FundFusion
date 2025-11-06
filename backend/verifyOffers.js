import db from "./db.js";

const verifyOffersTable = async () => {
  try {
    console.log("🔍 Checking offers table structure...");
    
    // Check table structure
    const [columns] = await db.query("DESCRIBE offers");
    console.log("📋 Offers table columns:", columns.map(col => `${col.Field} (${col.Type})`));
    
    // Check recent offers
    const [offers] = await db.query("SELECT id, investor_id, startup_id, status, created_at FROM offers ORDER BY id DESC LIMIT 5");
    console.log("📊 Recent offers:", offers);
    
    // Test update query
    if (offers.length > 0) {
      const testOfferId = offers[0].id;
      console.log(`🧪 Testing update on offer ID ${testOfferId}...`);
      
      const [result] = await db.query("UPDATE offers SET status = status WHERE id = ?", [testOfferId]);
      console.log("✅ Update test result:", { affectedRows: result.affectedRows, changedRows: result.changedRows });
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
};

verifyOffersTable();