import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ============================================================
// 📘 DATABASE CONNECTION POOL
//
// Same concept from Project 2!
// A pool keeps multiple connections ready so we don't have to
// open/close a new connection for every query.
//
// Think of it like a taxi stand:
//   - Instead of calling a taxi each time (slow),
//   - There's a stand with taxis already waiting (fast).
//   - When you're done, the taxi goes back to the stand (reused).
// ============================================================

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
