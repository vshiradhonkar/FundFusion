import db from "./db.js";

const debugOffers = async () => {
  try {
    console.log("🔍 Debugging offer relationships...\n");
    
    // Check startups table
    const [startups] = await db.query("SELECT id, user_id, name, status FROM startups ORDER BY id DESC LIMIT 5");
    console.log("📋 Recent startups:");
    startups.forEach(s => console.log(`  ID: ${s.id}, User: ${s.user_id}, Name: ${s.name}, Status: ${s.status}`));
    
    // Check offers table
    const [offers] = await db.query("SELECT id, investor_id, startup_id, amount_offered, status FROM offers ORDER BY id DESC LIMIT 5");
    console.log("\n💰 Recent offers:");
    offers.forEach(o => console.log(`  ID: ${o.id}, Investor: ${o.investor_id}, Startup: ${o.startup_id}, Amount: ${o.amount_offered}, Status: ${o.status}`));
    
    // Check relationships
    if (offers.length > 0 && startups.length > 0) {
      console.log("\n🔗 Checking relationships:");
      for (const offer of offers) {
        const startup = startups.find(s => s.id === offer.startup_id);
        if (startup) {
          console.log(`  ✅ Offer ${offer.id} → Startup ${startup.name} (User ${startup.user_id})`);
        } else {
          console.log(`  ❌ Offer ${offer.id} → Startup ${offer.startup_id} (NOT FOUND)`);
        }
      }
    }
    
    // Test query that frontend uses
    if (startups.length > 0) {
      const testStartupId = startups[0].id;
      console.log(`\n🧪 Testing frontend query for startup ${testStartupId}:`);
      const [testOffers] = await db.query(
        `SELECT o.*, u.name AS investor_name
         FROM offers o
         JOIN users u ON o.investor_id = u.id
         WHERE o.startup_id = ?
         ORDER BY o.id DESC`,
        [testStartupId]
      );
      console.log(`  Found ${testOffers.length} offers for startup ${testStartupId}`);
      testOffers.forEach(o => console.log(`    Offer ${o.id} from ${o.investor_name}: ₹${o.amount_offered} (${o.status})`));
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
};

debugOffers();