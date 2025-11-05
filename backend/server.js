import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import startupsRoutes from "./routes/startups.js";
import offersRoutes from "./routes/offers.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// vrfy DB connectivity at start
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database connection verified.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupsRoutes);
app.use("/api/offers", offersRoutes);


app.get("/", (req, res) => {
  res.json({ success: true, message: "🚀 FundFusion backend is running fine." });
});

//404 handler
app.use((req, res, next) => {
  console.warn(`⚠️ 404: ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "API route not found." });
});

app.use((err, req, res, next) => {
  console.error("🔥 Uncaught server error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

process.on("SIGINT", async () => {
  console.log("🔻 Shutting down server...");
  try {
    await db.end();
    console.log("✅ MySQL pool closed. Bye!");
  } catch (err) {
    console.error("❌ Error closing MySQL pool:", err.message);
  }
  process.exit(0);
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`

  FundFusion Backend is Live
  http://localhost:${PORT}
  Database: ${process.env.DB_NAME}
  Frontend: ${process.env.FRONTEND_URL || "http://localhost:5173"}

`);
});
