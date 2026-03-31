// ============================================================
// 📘 LESSON: SEPARATING ROUTES INTO THEIR OWN FILE
//
// As your app grows, putting EVERYTHING in index.js becomes
// messy. So we put our expense-related routes in a separate
// file called a "router".
//
// Think of it like a restaurant menu:
//   index.js     = The restaurant itself
//   routes/      = The different menu sections (appetizers, mains)
//   expenses.js  = The "Expenses" section of the menu
//
// EXPRESS ROUTER:
// express.Router() creates a mini-app that handles routes.
// We define all /api/expenses routes here, then "mount" this
// router in index.js with: app.use('/api/expenses', expenseRoutes)
// ============================================================

import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

// ============================================================
// 📘 LESSON: ASYNC/AWAIT (The Most Important JS Concept)
//
// Database queries take TIME (milliseconds, but still).
// JavaScript is SINGLE-THREADED — it can only do one thing
// at a time. If we "waited" synchronously, the entire server
// would freeze for every user.
//
// async/await solves this:
//   - "async" marks a function as asynchronous
//   - "await" pauses ONLY this function (not the whole server)
//     until the database responds
//
// Under the hood, await is syntactic sugar for Promises.
// pool.query() returns a Promise. await "unwraps" it.
// ============================================================

// ============================================================
// 📘 LESSON: TRY/CATCH (Error Handling)
//
// What if the database is down? What if the SQL is wrong?
// Without try/catch, your entire server CRASHES.
//
// try { ... }   → "Try this code"
// catch (err)   → "If it fails, run THIS instead"
//
// We send back a 500 status code (Server Error) so the
// client knows something went wrong on OUR side.
// ============================================================

// ──────────────────────────────────────────────────────────────
// 1. GET /api/expenses — Get ALL expenses
// ──────────────────────────────────────────────────────────────
// 📘 This is the simplest query: SELECT everything.
//
// pool.query() returns an ARRAY with 2 items:
//   [rows, fields]
// We only care about "rows" (the actual data).
// We use DESTRUCTURING: const [rows] = ... to grab just the first item.
// ──────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM expenses ORDER BY date DESC'
    );
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
  }
});

// ──────────────────────────────────────────────────────────────
// 2. GET /api/expenses/:id — Get ONE expense by ID
// ──────────────────────────────────────────────────────────────
// 📘 LESSON: ROUTE PARAMETERS
//
// ":id" is a PLACEHOLDER. If someone visits /api/expenses/5,
// then req.params.id = "5".
//
// We use a PARAMETERIZED QUERY with "?" placeholder.
// WHY? To prevent SQL INJECTION attacks!
// BAD:  `SELECT * FROM expenses WHERE id = ${id}`  ← HACKABLE!
// GOOD: `SELECT * FROM expenses WHERE id = ?`      ← SAFE!
// ──────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE id = ?',
      [id]
    );

    // If no rows found, the expense doesn't exist
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Expense with id ${id} not found`
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching expense:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch expense' });
  }
});

// ──────────────────────────────────────────────────────────────
// 3. POST /api/expenses — Create a NEW expense
// ──────────────────────────────────────────────────────────────
// 📘 LESSON: req.body
//
// When a client sends data (from a form or fetch()), it arrives
// in req.body. This ONLY works because we added
// app.use(express.json()) in index.js (the middleware).
//
// We VALIDATE the data before saving — never trust the client!
// ──────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    // Basic validation
    if (!title || !amount || !date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, amount, and date'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO expenses (title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)',
      // 📘 NOTE: The "||" (OR) operator provides DEFAULT VALUES:
      //   category || 'General' means:
      //     - If client sent a category (e.g., "Food") → use "Food"
      //     - If client didn't send one (undefined)   → use "General"
      //   notes || null means:
      //     - If client sent notes → use them
      //     - If not → store null (SQL's way of saying "empty/no value")
      //     - We use null instead of undefined because SQL doesn't
      //       understand undefined — it's a JavaScript-only concept.
      [title, amount, category || 'General', date, notes || null]
    );

    // 📘 NOTE: What mysql2 returns after different queries:
    //
    // After INSERT → result = {
    //   affectedRows: 1,
    //   insertId: 7,       ← The AUTO_INCREMENT id MySQL assigned
    //   serverStatus: 2,
    //   warningCount: 0
    // }
    //
    // After UPDATE → result = { affectedRows: 1, insertId: 0, ... }
    // After DELETE → result = { affectedRows: 1, insertId: 0, ... }
    // After SELECT → You get [rows] instead, not result.
    //
    // insertId comes from mysql2 (NOT Express). MySQL generates it
    // because of AUTO_INCREMENT in schema.sql.
    // 📘 NOTE: WHY DO WE SEND A RESPONSE?
    // The client is STILL WAITING after sending the POST request.
    // If we don't respond, the client hangs forever (timeout error).
    // We send back the created data so the client knows:
    //   1. It worked (success: true)
    //   2. The ID that MySQL auto-generated (result.insertId)
    //      → Client needs this ID to edit/delete this expense later
    //
    // 📘 NOTE: WHY status(201) instead of just 200?
    //   200 = "OK" (general success — "here's data you asked for")
    //   201 = "Created" (something NEW was born in the database)
    // Using the correct code is a professional convention. Your React
    // frontend can check: if (response.status === 201) { refresh list }
    res.status(201).json({
      success: true,
      message: 'Expense created!',
      data: { id: result.insertId, title, amount, category, date, notes }
    });
  } catch (error) {
    // 📘 NOTE: The catch block has TWO jobs:
    //   1. console.error() → Logs the REAL error for YOU (the developer)
    //      so you can debug it in your terminal
    //   2. res.status(500) → Sends a GENERIC error to the client.
    //      We don't expose internal details (like SQL errors) to
    //      the client — that's a security risk!
    //
    // 500 = "Internal Server Error" — means "it's OUR fault, not yours"
    console.error('Error creating expense:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create expense' });
  }
});

// ──────────────────────────────────────────────────────────────
// 4. PUT /api/expenses/:id — Update an expense
// ──────────────────────────────────────────────────────────────
// 📘 LESSON: PUT vs PATCH
//
// PUT    = Replace the ENTIRE resource (send ALL fields)
// PATCH  = Update ONLY specific fields
//
// We're using PUT here for simplicity — the client sends
// all fields, and we overwrite them.
//
// result.affectedRows tells us if the UPDATE actually changed
// anything. If 0, the ID doesn't exist.
// ──────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, amount, and date'
      });
    }

    const [result] = await pool.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, notes = ? WHERE id = ?',
      [title, amount, category || 'General', date, notes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: `Expense with id ${id} not found`
      });
    }

    res.json({
      success: true,
      message: 'Expense updated!',
      // 📘 NOTE: Why Number(id)?
      // req.params.id comes from the URL, so it's always a STRING.
      // e.g., /api/expenses/5 → id = "5" (string, not number)
      // Number(id) converts it to 5 (number) so the response JSON
      // is clean and consistent (id should be a number, not "5").
      data: { id: Number(id), title, amount, category, date, notes }
    });
  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update expense' });
  }
});

// ──────────────────────────────────────────────────────────────
// 5. DELETE /api/expenses/:id — Delete an expense
// ──────────────────────────────────────────────────────────────
// 📘 LESSON: HTTP STATUS CODES (The ones you'll use most)
//
// 200 → OK (general success)
// 201 → Created (after POST)
// 400 → Bad Request (client sent bad/missing data)
// 404 → Not Found (resource doesn't exist)
// 500 → Internal Server Error (OUR code broke)
// ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'DELETE FROM expenses WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: `Expense with id ${id} not found`
      });
    }

    res.json({
      success: true,
      message: `Expense with id ${id} deleted`
    });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete expense' });
  }
});

export default router;
