// ============================================================
// 📘 LESSON: THE API SERVICE LAYER
//
// This file is the BRIDGE between your React frontend and Express backend.
// Instead of writing fetch() calls scattered across every component,
// we centralize them here. This is a BEST PRACTICE called
// "Separation of Concerns" — each file has ONE job.
//
// WHY A SEPARATE FILE?
// 1. Reusability — any component can import and use these functions
// 2. Maintainability — if the API URL changes, you update ONE file
// 3. Readability — components focus on UI, this file handles data
//
// WHAT IS fetch()?
// fetch() is a built-in browser function to make HTTP requests.
// It's how your frontend TALKS to your backend.
// Think of it like making a phone call:
//   - You dial a number (URL)
//   - You say something (request body)
//   - You wait for a reply (response)
//   - You hang up (done)
// ============================================================

// ============================================================
// 📘 LESSON: BASE URL
//
// This is the address of your Express backend.
// Your React app runs on http://localhost:5173 (Vite's default)
// Your Express API runs on http://localhost:3000
//
// We store it in a variable so if the URL changes (e.g., in production),
// you only change it in ONE place.
//
// ⚠️ COMMON MISTAKE: Don't add a trailing slash!
//   WRONG: 'http://localhost:3000/api/expenses/'
//   RIGHT: 'http://localhost:3000/api/expenses'
// ============================================================
const BASE_URL = 'http://localhost:3000/api/expenses';

// ============================================================
// 📘 LESSON: GET REQUEST — Fetching Data
//
// This function calls GET /api/expenses on your backend.
// It's the same as typing http://localhost:3000/api/expenses
// in your browser — but done programmatically from JavaScript.
//
// HOW fetch() WORKS (step by step):
// 1. fetch(url) sends an HTTP GET request (GET is the default method)
// 2. It returns a PROMISE (because the network request takes time)
// 3. We use "await" to WAIT for the response
// 4. response.json() ALSO returns a promise (parsing takes time too)
// 5. We await that too, and get our actual JavaScript object
//
// THE RESPONSE OBJECT:
//   response.ok     → true if status is 200-299
//   response.status → the HTTP status code (200, 404, 500, etc.)
//   response.json() → parses the JSON body into a JS object
// ============================================================
export const getExpenses = async () => {
  try {
    // Step 1: Make the GET request
    const response = await fetch(BASE_URL);

    // Step 2: Parse the JSON response
    // The backend sends: { success: true, count: 5, data: [...] }
    // response.json() converts that JSON string into a JS object
    const result = await response.json();

    // Step 3: Return just the data array
    // We return result.data because that's the array of expenses
    // The component doesn't need to know about "success" or "count"
    return result.data;
  } catch (error) {
    // 📘 LESSON: ERROR HANDLING IN FETCH
    //
    // fetch() only throws an error for NETWORK failures
    // (e.g., no internet, server is off, DNS failure).
    //
    // It does NOT throw for HTTP errors like 404 or 500!
    // A 500 response is still a "successful" network request.
    //
    // For now, we log the error and return an empty array
    // so the UI doesn't crash.
    console.error('Error fetching expenses:', error);
    return [];
  }
};

// ============================================================
// 📘 LESSON: POST REQUEST — Sending Data to Create Something
//
// Unlike GET, POST sends DATA to the server.
// This is how you "create" a new expense.
//
// KEY DIFFERENCES FROM GET:
//   GET  → "Give me data" (no body needed)
//   POST → "Here's data, please create something" (body required)
//
// THE FETCH OPTIONS OBJECT:
//   method  → 'POST' (default is 'GET', so we must specify)
//   headers → tells the server "I'm sending JSON data"
//   body    → the actual data, converted to a JSON STRING
//
// 📘 LESSON: JSON.stringify()
//   JavaScript objects and JSON look similar but are DIFFERENT:
//     JS Object: { name: "Lunch", amount: 250 }  ← lives in memory
//     JSON:      '{"name":"Lunch","amount":250}'  ← a TEXT string
//
//   HTTP only sends TEXT over the network (not JS objects).
//   So we MUST convert our object to a JSON string before sending.
//   JSON.stringify() does this conversion.
//
// 📘 LESSON: Content-Type Header
//   The 'Content-Type': 'application/json' header tells the server:
//   "Hey, the data I'm sending is in JSON format, please parse it."
//   Without this header, Express's express.json() middleware won't
//   know how to parse the body, and req.body will be undefined!
// ============================================================
export const createExpense = async (expense) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',                              // Tell fetch this is a POST request
      headers: { 'Content-Type': 'application/json' }, // Tell server we're sending JSON
      body: JSON.stringify(expense),                // Convert JS object → JSON string
    });

    const result = await response.json();

    // 📘 NOTE: We check response.ok to handle validation errors (400)
    // or server errors (500). Remember, fetch doesn't throw for these!
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create expense');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error; // Re-throw so the component can show an error message
  }
};

// ============================================================
// 📘 LESSON: PUT REQUEST — Updating Existing Data
//
// PUT replaces an ENTIRE resource with new data.
// Notice the URL includes the expense ID: /api/expenses/5
//
// Template literals (backticks) let us embed variables:
//   `${BASE_URL}/${id}` becomes "http://localhost:3000/api/expenses/5"
//
// The structure is almost identical to POST — the only differences:
//   1. method: 'PUT' instead of 'POST'
//   2. URL includes the ID of the expense to update
// ============================================================
export const updateExpense = async (id, expense) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update expense');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// ============================================================
// 📘 LESSON: DELETE REQUEST — Removing Data
//
// DELETE is the simplest — no body needed, just the URL with the ID.
//
// Notice we DON'T need:
//   - headers (no data to describe)
//   - body (nothing to send)
//
// We just need to tell the server WHICH expense to delete (via the ID in the URL).
// ============================================================
export const deleteExpense = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',       // Only need to specify the method
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete expense');
    }

    return result;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};
