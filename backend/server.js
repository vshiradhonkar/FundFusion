import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js"; // ✅ ensure DB connection is initialized
import authRoutes from "./routes/auth.js";
import startupsRoutes from "./routes/startups.js";
import offersRoutes from "./routes/offers.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Test DB connection immediately
try {
  await db.query("SELECT 1");
  console.log("✅ Database connected successfully");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
}

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupsRoutes);
app.use("/api/offers", offersRoutes);

// ✅ Optional: Health check route (handy for debugging)
app.get("/", (req, res) => {
  res.json({ success: true, message: "FundFusion backend is running" });
});

// ✅ Catch unknown routes for fast debugging
app.use((req, res) => {
  console.warn(`⚠️ Route not found: ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "API route not found" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
