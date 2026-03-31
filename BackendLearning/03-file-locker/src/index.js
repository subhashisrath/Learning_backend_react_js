import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

// Load environment variables FIRST (before anything uses them)
dotenv.config();

// ============================================================
// 📘 SERVER ENTRY POINT
//
// This file does TWO things:
//   1. Tests the database connection
//   2. Starts the Express server
//
// The app setup (middleware, routes) is in app.js.
// This file just "opens the doors" and turns on the server.
// ============================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    // Quick DB health check — if this query works, we're connected
    await pool.query("SELECT 1");
    console.log("✅ MySQL database connected successfully!");
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    console.error(
      "   Check your .env credentials and ensure MySQL is running."
    );
  }
});
