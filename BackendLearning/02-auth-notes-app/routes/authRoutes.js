import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";

const router = express.Router();

// ============================================================
// 📘 WHAT IS A TOKEN?
//
// A token is like a "movie ticket" for your API.
//   1. You go to the counter (login) and show your ID (email + password)
//   2. They give you a ticket (token)
//   3. You show the ticket to enter any screen (protected route)
//   4. No need to show your ID again — the ticket proves you paid
//   5. The ticket expires after the show (token expires after 7d)
//
// In web apps, the frontend stores this token (usually in localStorage)
// and sends it with EVERY request in the header:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
// ============================================================

// ============================================================
// 📘 WHAT IS JWT (JSON Web Token)?
//
// JWT is a SPECIFIC FORMAT for tokens. It has 3 parts separated by dots:
//
//   eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NSwiZW1haWwiOiJ0ZXN0QG1haWwuY29tIn0.abc123
//   |______ HEADER ______||_____________ PAYLOAD _____________||_ SIGNATURE _|
//
// HEADER:  { "alg": "HS256" }  → which algorithm was used to sign
// PAYLOAD: { "id": 5, "email": "test@mail.com" }  → YOUR data (not encrypted, just encoded!)
// SIGNATURE: HMAC(header + payload, SECRET_KEY)  → proves it hasn't been tampered with
//
// ⚠️  IMPORTANT: The payload is NOT secret! Anyone can decode it.
//     It's just Base64 encoded (not encrypted). Never put passwords in it.
//     The signature is what makes it secure — if someone changes the payload,
//     the signature won't match, and jwt.verify() will reject it.
//
// HOW jwt.sign() WORKS:
//   jwt.sign({ id: 5, email: "test@mail.com" }, "SECRET_KEY", { expiresIn: "7d" })
//     → Takes your data (payload)
//     → Signs it with your SECRET_KEY (from .env)
//     → Returns a token string
//
// HOW jwt.verify() WORKS (we'll use this in middleware later):
//   jwt.verify(token, "SECRET_KEY")
//     → Checks if the signature matches (not tampered)
//     → Checks if the token is expired
//     → Returns the payload { id: 5, email: "test@mail.com" }
//     → Throws an error if invalid or expired
// ============================================================

// ============================================================
// 📘 WHAT IS BCRYPT & PASSWORD HASHING?
//
// HASHING = one-way transformation. You can NEVER reverse it.
//   "mypassword123"  →  "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
//   (original)           (hash — 60 characters, always)
//
// WHY NOT JUST STORE THE PASSWORD?
//   If a hacker steals your database, they get ALL passwords.
//   With hashing, they only get hashes — useless without the original.
//
// 📘 WHAT IS A SALT?
//   Problem: Two users with password "hello123" would get the SAME hash.
//   A hacker could use a "rainbow table" (pre-computed hashes) to crack them.
//
//   Salt = random characters added BEFORE hashing:
//     "hello123" + "x7Kp2" → hash1 (unique!)
//     "hello123" + "m3Qr9" → hash2 (different!)
//
//   bcrypt.genSalt(10):
//     - Generates a random salt
//     - The "10" = salt rounds (cost factor)
//     - Each round doubles the computation time
//     - 10 rounds ≈ ~100ms (good balance: fast enough for users, slow for hackers)
//     - A hacker trying 1 billion passwords would take ~3 years at 10 rounds
//
//   The salt is stored INSIDE the hash itself:
//     "$2a$10$N9qo8uLO..."
//      ↑    ↑  ↑____________ the hash
//      ↑    ↑_______________ the salt (embedded)
//      ↑____________________ algorithm version + rounds
//
//   So bcrypt.compare() knows which salt to use automatically!
// ============================================================

// ======================== REGISTER ========================
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    // Step 1: Generate a random salt (adds randomness so same passwords → different hashes)
    const salt = await bcrypt.genSalt(10);
    // Step 2: Hash the password WITH the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Now hashedPassword = "$2a$10$..." (60 chars, contains the salt inside it)

    // Create user in database (store the HASH, never the plain password)
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [userName, email, hashedPassword],
    );

    // Create JWT token so user is auto-logged-in after registering
    // We put id + email in the payload — just enough to identify the user later
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token, // Frontend stores this and sends it with every future request
      user: {
        id: result.insertId,
        username: userName,
        email,
        // ⚠️ Notice: we NEVER send back the password (not even the hash)
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Check if user exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(200).json({
      success: true,
      msg: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
