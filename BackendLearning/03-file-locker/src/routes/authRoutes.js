import express from "express";
import { register, login } from "../controllers/authController.js";

// ============================================================
// 📘 WHAT ARE ROUTES IN MVC?
//
// Routes are the "traffic director" — they ONLY define:
//   "When someone hits THIS URL with THIS method, run THIS function"
//
// In Project 2, routes did EVERYTHING (validation, SQL, JWT, response).
// Now they just point URLs to controller functions:
//
//   ❌ Before (Project 2):
//     router.post("/register", async (req, res) => {
//       // 60 lines of validation + SQL + hashing + JWT + response
//     });
//
//   ✅ Now (Project 3 — MVC):
//     router.post("/register", register);
//     // That's it! The controller handles the rest.
//
// BENEFITS:
//   - Routes file is tiny and easy to scan
//   - You can see ALL endpoints at a glance
//   - Logic lives in the controller where it belongs
// ============================================================

const router = express.Router();

// POST /api/auth/register → create a new user account
router.post("/register", register);

// POST /api/auth/login → authenticate and get a token
router.post("/login", login);

export default router;
