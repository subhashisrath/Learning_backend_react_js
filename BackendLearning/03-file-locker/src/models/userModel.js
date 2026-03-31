import pool from "../config/db.js";

// ============================================================
// 📘 WHAT IS A MODEL?
//
// A model is the "database layer" — it ONLY talks to the database.
// It doesn't know about HTTP, requests, or responses.
//
// Think of it like a librarian:
//   - You ask the librarian: "Find me a book by this author" (findByEmail)
//   - You ask the librarian: "Add this new book to the shelf" (create)
//   - The librarian doesn't care WHY you want it — that's the controller's job
//
// 📘 WHY SEPARATE MODELS FROM CONTROLLERS?
//
// In Project 2, SQL queries were inside the route handlers.
// That works for small apps, but gets messy fast:
//
//   ❌ Before (Project 2):
//     router.post("/register", async (req, res) => {
//       const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
//       // 50 more lines of mixed SQL + HTTP logic...
//     });
//
//   ✅ Now (Project 3 — MVC):
//     // userModel.js → ONLY SQL queries
//     // authController.js → ONLY business logic + HTTP responses
//     // authRoutes.js → ONLY route definitions
//
// BENEFITS:
//   1. Each file has ONE job (Single Responsibility)
//   2. Easy to reuse — need findByEmail() elsewhere? Just import the model
//   3. Easy to test — test SQL queries WITHOUT running a server
//   4. Easy to read — each file is shorter and focused
// ============================================================

// Find a user by their email address
// Returns: the user row if found, or undefined if not found
const findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0]; // returns the first match (or undefined if no match)
};

// Create a new user in the database
// Returns: the result object (contains insertId — the new user's ID)
const create = async (username, email, hashedPassword) => {
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return result;
};

export default { findByEmail, create };
