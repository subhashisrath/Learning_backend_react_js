// ============================================================
// 📘 LESSON: This is your FIRST Express server.
//
// WHAT IS EXPRESS?
// Express is a "framework" — it's a library that gives you
// pre-built tools to handle HTTP requests (GET, POST, etc.)
// Without Express, you'd have to write 50+ lines just to
// read a URL. Express does that in 1 line.
//
// WHAT IS "import"?
// "import" is the modern way (ES Modules) to bring in code
// from other files/packages. The older way was "require()".
// We enabled this by putting "type": "module" in package.json.
// ============================================================

// Step 1: Import the packages we installed via npm
import express from 'express';    // The web framework
import dotenv from 'dotenv';     // Reads .env file into process.env
import cors from 'cors';        // Allows cross-origin requests (React ↔ Express)
import pool from './db/db.js'; // Our MySQL connection pool
import expenseRoutes from './routes/expenses.js';  // Our expense routes

// Step 2: Load environment variables from .env file
// WHY? We NEVER hardcode passwords or secrets in code.
// The .env file is like a private config that stays on YOUR machine.
dotenv.config();

// Step 3: Create the Express "app"
// Think of this as creating a new waiter at a restaurant.
// The waiter (app) will listen for customer orders (HTTP requests)
// and serve them food (HTTP responses).
const app = express();

// ============================================================
// 📘 LESSON: CORS (Cross-Origin Resource Sharing)
//
// WHAT IS CORS?
// When your React app (http://localhost:5173) tries to fetch data
// from your Express API (http://localhost:3000), the BROWSER blocks
// it by default! This is a security feature called "Same-Origin Policy."
//
// WHY DOES THE BROWSER BLOCK IT?
// Imagine you're logged into your bank. A malicious website could
// try to fetch your bank data using JavaScript. The browser prevents
// this by blocking requests to a DIFFERENT origin (different domain/port).
//
// HOW DOES CORS FIX IT?
// cors() middleware tells Express to include special headers in its
// responses like: "Access-Control-Allow-Origin: *"
// This tells the browser: "It's OK, I allow requests from other origins."
//
// WHEN DO YOU NEED CORS?
// Only when frontend and backend are on DIFFERENT origins:
//   ✅ localhost:5173 → localhost:3000  (different port = different origin)
//   ❌ localhost:3000 → localhost:3000  (same origin = no CORS needed)
//
// In production, you'd often configure it to allow only YOUR domain:
//   cors({ origin: 'https://myapp.com' })
// But for development, cors() with no args allows everything.
// ============================================================
app.use(cors());

// Step 4: Tell Express to understand JSON
// When a client sends data (like a new expense), it comes as JSON.
// This line tells Express: "Hey, parse that JSON for me automatically."
// This is called MIDDLEWARE — code that runs BETWEEN request and response.
app.use(express.json());

// Step 5: Define the PORT
// A port is like an apartment number in a building (your computer).
// Your server "lives" at this port number.
// process.env.PORT reads from .env, or defaults to 3000.
//
// 📘 NOTE: The "||" (OR) operator here is a DEFAULT VALUE pattern:
//   - If process.env.PORT has a value → use that value
//   - If process.env.PORT is undefined → use 3000 as fallback
// This is the same pattern we use in expenses.js:
//   category || 'General'  → use category if sent, else 'General'
//   notes || null           → use notes if sent, else null
const PORT = process.env.PORT || 3000;

// ============================================================
// 📘 LESSON: ROUTES
//
// A "route" is a URL pattern + an HTTP method.
// When someone visits http://localhost:3000/, they're making
// a GET request to the "/" route.
//
// The callback function receives two objects:
//   req (request)  → info about what the client sent
//   res (response) → tools to send something back
// ============================================================

// Route 1: The "Hello World" — GET /
//
// 📘 NOTE: WHY HAVE THIS ROUTE?
// This is NOT required for the app to work. It's a "welcome" route.
// Think of it like a reception desk in a building:
//   - WITHOUT it → visitor walks in and sees nothing ("Cannot GET /")
//   - WITH it    → visitor sees a directory of all available floors/services
//
// In the real world, try visiting https://api.github.com/ in your
// browser — GitHub does the EXACT same thing: shows a JSON listing
// of all their API endpoints.
//
// It also serves as a quick health check — if this responds,
// you know the server is alive.
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Expense Tracker API is running!',
    version: '1.0.0',
    endpoints: {
      getAllExpenses: 'GET /api/expenses',
      createExpense: 'POST /api/expenses',
      getOneExpense: 'GET /api/expenses/:id',
      updateExpense: 'PUT /api/expenses/:id',
      deleteExpense: 'DELETE /api/expenses/:id'
    }
  });
});

// ============================================================
// 📘 LESSON: MOUNTING A ROUTER
//
// app.use('/api/expenses', expenseRoutes) means:
// "Any request starting with /api/expenses should be
//  handled by the routes defined in expenses.js"
//
// Inside expenses.js, router.get('/') actually handles
// GET /api/expenses (the prefix is added automatically).
// ============================================================
app.use('/api/expenses', expenseRoutes);

// ============================================================
// 📘 LESSON: app.listen()
//
// This is what STARTS the server. Without this line, nothing
// happens. It tells Node: "Keep this process alive and listen
// for incoming HTTP requests on this port."
//
// The callback runs once the server is ready.
// ============================================================

app.listen(PORT, async () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Try opening this URL in your browser!\n`);

  // Test the database connection on startup
  // 📘 NOTE: 'SELECT 1' is the lightest possible SQL query.
  // It doesn't touch any table — it just asks MySQL "are you alive?"
  // If this succeeds, we know: MySQL is running + credentials are correct.
  // If it fails, the catch block tells us immediately on startup.
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL database connected successfully!');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('   Check your .env credentials and ensure MySQL is running.');
  }
});
