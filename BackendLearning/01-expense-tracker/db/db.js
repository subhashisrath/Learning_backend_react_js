// ============================================================
// 📘 LESSON: DATABASE CONNECTION & CONNECTION POOLING
//
// WHAT IS mysql2?
// It's a Node.js package that lets you talk to a MySQL database
// using JavaScript. We use the "promise" version so we can
// use async/await instead of ugly callbacks.
//
// WHAT IS A CONNECTION POOL?
// Imagine a restaurant with 10 phones. Instead of buying a new
// phone every time a customer calls (expensive!), you reuse
// the existing ones. A "pool" keeps a set of database
// connections open and ready to be reused.
//
// Without a pool: Open connection → Query → Close connection (slow)
// With a pool:    Grab connection → Query → Return to pool (fast)
// ============================================================

import mysql from 'mysql2/promise';  // "promise" version for async/await
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool using your .env credentials
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Usually 'localhost'
  user: process.env.DB_USER,         // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME,     // The database name
  waitForConnections: true,          // Wait if all connections are busy
  connectionLimit: 10,               // Max 10 simultaneous connections
  queueLimit: 0                      // Unlimited waiting queue
});

// ============================================================
// 📘 LESSON: EXPORT DEFAULT
//
// "export default" lets other files import this pool.
// In index.js, we'll do: import pool from './db/db.js'
// Then use: pool.query('SELECT * FROM expenses')
//
// This is the ES Module way. The old way was:
//   module.exports = pool;  (CommonJS)
// ============================================================

export default pool;
