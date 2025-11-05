import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/**
 * Database Connection
 * -------------------
 * Creates a MySQL connection pool with detailed logging and
 * auto-reconnection behavior for better resilience.
 */

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "fundfusion",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Test the connection immediately on startup.
 * Logs success or failure in the console.
 */
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully:", process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:");
    console.error("   Host:", process.env.DB_HOST);
    console.error("   Database:", process.env.DB_NAME);
    console.error("   Error:", err.message);
    process.exit(1); // Exit to avoid silent app hangs
  }
})();

/**
 * Graceful shutdown for pool when process exits.
 */
process.on("SIGINT", async () => {
  try {
    console.log("🔻 Closing MySQL connection pool...");
    await pool.end();
    console.log("✅ MySQL pool closed. Exiting...");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing MySQL pool:", err.message);
    process.exit(1);
  }
});

export default pool;
