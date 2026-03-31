import express from "express";
import pool from "../db/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================================
// 📘 PROTECTING ALL ROUTES IN THIS FILE
//
// router.use(authMiddleware) applies the auth middleware to
// EVERY route defined below this line.
//
// This means:
//   - Every request to /api/notes/* must have a valid JWT token
//   - The authMiddleware verifies the token and attaches req.user
//   - If no token or invalid token → 401 Unauthorized (never reaches routes)
//   - If valid → req.user = { id: 5, email: "test@mail.com" }
//
// Alternative: you could protect individual routes like:
//   router.get("/", authMiddleware, async (req, res) => { ... })
// But since ALL note routes need auth, router.use() is cleaner.
// ============================================================

router.use(authMiddleware);

// ============================================================
// 📘 OWNERSHIP — THE KEY CONCEPT IN THIS FILE
//
// Every query in this file includes: WHERE user_id = req.user.id
//
// WHY?
//   - req.user.id comes from the VERIFIED JWT token (can't be faked)
//   - This ensures users can ONLY access THEIR OWN notes
//   - Without this, User A could read/edit/delete User B's notes!
//
// THINK OF IT LIKE:
//   A filing cabinet where each drawer has a lock.
//   Your JWT token is the key — it only opens YOUR drawer.
//   You can see/add/remove papers from YOUR drawer only.
//
// AUTHORIZATION vs AUTHENTICATION:
//   Authentication = "WHO are you?" (handled by authMiddleware)
//   Authorization  = "WHAT can you do?" (handled by ownership checks here)
//
//   Example:
//     User A (id: 1) tries to delete note (id: 5, user_id: 2)
//     → Auth middleware says: "Yes, User A is logged in" ✅ (authenticated)
//     → But note belongs to User B (user_id: 2 ≠ 1) ❌ (not authorized)
//     → We should return 403 Forbidden or 404 Not Found
// ============================================================

// ======================== CREATE NOTE ========================
// POST /api/notes
//
// 📘 WHAT THIS ROUTE DOES:
//   Takes title, content, category from request body
//   Creates a new note linked to the logged-in user (req.user.id)
//
// 📘 THINGS TO HANDLE:
//   1. Extract { title, content, category } from req.body
//   2. Validate that title exists (it's NOT NULL in our schema)
//   3. INSERT INTO notes (user_id, title, content, category) VALUES (?, ?, ?, ?)
//      → user_id comes from req.user.id (NOT from req.body — never trust the client!)
//   4. Return the created note with 201 status
//
// 📘 WHY req.user.id AND NOT req.body.userId?
//   If we used req.body.userId, a hacker could send:
//     { "userId": 999, "title": "Hack!" }
//   and create notes in someone else's account!
//   req.user.id comes from the VERIFIED token — trustworthy.
//
// 📘 SQL TIP: result.insertId
//   After INSERT, MySQL gives you the auto-generated ID
//   Use it to fetch or return the newly created note
// ============================================================

router.post("/", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO notes (user_id, title, content, category) VALUES (?, ?, ?, ?)",
      [req.user.id, title, content, category],
    );

    const note = {
      id: result.insertId,
      user_id: req.user.id,
      title,
      content,
      category,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ======================== GET ALL NOTES ========================
// GET /api/notes
//
// 📘 WHAT THIS ROUTE DOES:
//   Fetches ALL notes belonging to the logged-in user
//   NOT all notes in the database — only theirs!
//
// 📘 THINGS TO HANDLE:
//   1. SELECT * FROM notes WHERE user_id = ? (req.user.id)
//   2. ORDER BY created_at DESC (newest first — better UX)
//   3. Return the array of notes
//
// 📘 WHY "WHERE user_id = ?" IS CRITICAL:
//   Without it: SELECT * FROM notes → returns EVERYONE's notes!
//   User A would see User B's private notes. Major security flaw.
//
// 📘 WHAT [rows] MEANS:
//   pool.query() returns [rows, fields]
//   We destructure to get just the rows (array of note objects)
//   rows = [] if no notes found (empty array, not an error)
// ============================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id],
    );

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ======================== GET SINGLE NOTE ========================
// GET /api/notes/:id
//
// 📘 WHAT THIS ROUTE DOES:
//   Fetches ONE specific note by its ID
//   But ONLY if it belongs to the logged-in user
//
// 📘 THINGS TO HANDLE:
//   1. Get note ID from req.params.id (comes from the URL: /api/notes/5 → id = 5)
//   2. SELECT * FROM notes WHERE id = ? AND user_id = ?
//      → Both conditions matter! Must match note ID AND ownership
//   3. If rows.length === 0 → note not found OR doesn't belong to user
//      → Return 404
//   4. Return the note (rows[0])
//
// 📘 WHY "AND user_id = ?" INSTEAD OF CHECKING AFTER?
//   Option A (what we do):
//     WHERE id = ? AND user_id = ?
//     → One query, database handles the check. Clean and secure.
//
//   Option B (less ideal):
//     WHERE id = ?  → fetch the note
//     → then check: if (note.user_id !== req.user.id) return 403
//     → This works but reveals that the note EXISTS (information leak)
//     → A hacker could probe note IDs to discover valid ones
//
//   Option A returns 404 for both "doesn't exist" and "not yours"
//   → The hacker can't tell the difference. More secure!
//
// 📘 req.params vs req.body vs req.query:
//   req.params → from URL path: /api/notes/:id → req.params.id
//   req.body   → from POST/PUT body (JSON)
//   req.query  → from URL query string: /api/notes?category=work → req.query.category
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found or doesn't belong to you",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      note: rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ======================== UPDATE NOTE ========================
// PUT /api/notes/:id
//
// 📘 WHAT THIS ROUTE DOES:
//   Updates an existing note (title, content, category)
//   But ONLY if it belongs to the logged-in user
//
// 📘 THINGS TO HANDLE:
//   1. Get note ID from req.params.id
//   2. Extract { title, content, category } from req.body
//   3. UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ? AND user_id = ?
//      → Same ownership check as GET single note
//   4. Check result.affectedRows:
//      → 0 = note not found or doesn't belong to user → 404
//      → 1 = successfully updated → return updated note
//
// 📘 result.affectedRows:
//   After UPDATE, MySQL tells you how many rows were changed
//   - 0 rows = the WHERE clause matched nothing (wrong ID or wrong user)
//   - 1 row = success
//   This is how we check ownership without a separate SELECT query
//
// 📘 WHY PUT AND NOT PATCH?
//   PUT = replace the entire resource (send ALL fields)
//   PATCH = partial update (send only changed fields)
//   We use PUT for simplicity. In production apps, PATCH is often better
//   because you don't need to re-send unchanged fields.
//
// 📘 updated_at UPDATES AUTOMATICALLY:
//   Remember in schema.sql we set:
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   So MySQL auto-updates this timestamp whenever the row changes!
// ============================================================

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, category } = req.body;
    const [result] = await pool.query(
      "UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ? AND user_id = ?",
      [title, content, category, id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found or doesn't belong to you",
      });
    }

    // Fetch the updated note to return it
    const [rows] = await pool.query(
      "SELECT * FROM notes WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ======================== DELETE NOTE ========================
// DELETE /api/notes/:id
//
// 📘 WHAT THIS ROUTE DOES:
//   Deletes a note permanently
//   But ONLY if it belongs to the logged-in user
//
// 📘 THINGS TO HANDLE:
//   1. Get note ID from req.params.id
//   2. DELETE FROM notes WHERE id = ? AND user_id = ?
//   3. Check result.affectedRows:
//      → 0 = note not found or not yours → 404
//      → 1 = successfully deleted → return success message
//
// 📘 DELETE IS PERMANENT:
//   There's no "undo" with DELETE. The row is gone forever.
//   In production apps, you might use "soft delete" instead:
//     - Add a column: is_deleted BOOLEAN DEFAULT FALSE
//     - Instead of DELETE, do: UPDATE notes SET is_deleted = TRUE WHERE ...
//     - In SELECT queries, add: WHERE is_deleted = FALSE
//     - This lets users "recover" deleted notes
//   For learning, we'll use real DELETE to keep it simple.
//
// 📘 RESPONSE FOR DELETE:
//   Convention: return 200 with a success message
//   Some APIs return 204 (No Content) with an empty body
//   Either is fine — 200 with a message is more beginner-friendly
// ============================================================

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found or doesn't belong to you",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
