import jwt from "jsonwebtoken";

// ============================================================
// 📘 WHAT IS MIDDLEWARE?
//
// Middleware is a function that runs BETWEEN the request and the response.
// Think of it like a security guard at a building entrance:
//
//   Client Request → [MIDDLEWARE] → Route Handler → Response
//                        ↓ (if check fails)
//                   ❌ Rejected (401/403)
//
// Express runs middleware in ORDER. Each middleware can:
//   1. READ the request (req)
//   2. MODIFY the request (e.g., attach user info to req.user)
//   3. END the request (send a response and stop)
//   4. PASS to the next middleware/route using next()
//
// ============================================================
// 📘 TYPES OF MIDDLEWARE IN EXPRESS
//
// 1. APPLICATION-LEVEL → app.use(middlewareFn)
//    - Runs on EVERY request to the app
//    - Example: app.use(express.json()) → parses JSON body for ALL routes
//    - Example: app.use(cors()) → enables CORS for ALL routes
//
// 2. ROUTER-LEVEL → router.use(middlewareFn)
//    - Runs on every request to THAT specific router
//    - Example: router.use(authMiddleware) → protects all routes in that router
//
// 3. ROUTE-SPECIFIC → router.get("/path", middlewareFn, handlerFn)
//    - Runs only on THAT specific route
//    - Example: router.get("/profile", authMiddleware, getProfile)
//    - Most common way to protect individual routes
//
// 4. ERROR-HANDLING → app.use((err, req, res, next) => { ... })
//    - Has 4 parameters (err, req, res, next)
//    - Catches errors thrown in any route or middleware
//
// 5. BUILT-IN →
//    - express.json()  → parses JSON request bodies
//    - express.static() → serves static files (HTML, CSS, images)
//
// 6. THIRD-PARTY →
//    - cors() → handles Cross-Origin requests
//    - morgan() → logs HTTP requests
//    - helmet() → adds security headers
//
// ============================================================
// 📘 THE next() FUNCTION
//
// Every middleware receives 3 arguments: (req, res, next)
//
//   req  → the incoming request object
//   res  → the response object (to send data back)
//   next → a function that says "I'm done, pass to the next middleware/route"
//
// If you DON'T call next(), the request STOPS here.
// The client will hang forever waiting for a response.
//
// Example flow with 2 middlewares:
//
//   app.use(middleware1);  // runs first
//   app.use(middleware2);  // runs second (only if middleware1 calls next())
//   app.get("/", handler); // runs last (only if middleware2 calls next())
//
//   function middleware1(req, res, next) {
//     console.log("Step 1");
//     next(); // ✅ pass to middleware2
//   }
//
//   function middleware2(req, res, next) {
//     console.log("Step 2");
//     next(); // ✅ pass to route handler
//   }
//
// ============================================================
// 📘 HOW THIS AUTH MIDDLEWARE WORKS
//
// PURPOSE: Protect routes so only logged-in users can access them.
//
// STEP-BY-STEP:
//   1. Client sends request with header:
//      Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NX0.abc123
//
//   2. We extract the token from the header:
//      "Bearer eyJ..." → split by space → take the second part → "eyJ..."
//
//   3. We verify the token using jwt.verify(token, SECRET_KEY):
//      - Is the signature valid? (not tampered)
//      - Is it expired? (past the 7d expiry)
//      - If valid → returns the payload: { id: 5, email: "test@mail.com" }
//      - If invalid → throws an error
//
//   4. If valid: Attach user info to req.user and call next()
//      → The route handler can now use req.user.id to know WHO is making the request
//
//   5. If invalid: Send 401 Unauthorized and STOP
//      → The route handler never runs
//
// VISUAL FLOW:
//
//   POST /api/notes (Create a note)
//   Headers: { Authorization: "Bearer eyJ..." }
//
//   → authMiddleware runs:
//       ✅ Token valid → req.user = { id: 5, email: "test@mail.com" }
//       → next() → route handler runs → can use req.user.id
//
//   → authMiddleware runs:
//       ❌ No token → res.status(401) → "No token provided" → STOPS
//       ❌ Bad token → res.status(401) → "Invalid token" → STOPS
//
// ============================================================
// 📘 WHY DO WE ATTACH USER TO req.user?
//
// After middleware verifies the token, we put the user data on the request:
//   req.user = { id: 5, email: "test@mail.com" }
//
// Now in the route handler, we can do:
//   const notes = await db.query("SELECT * FROM notes WHERE user_id = ?", [req.user.id]);
//
// This way:
//   - Each user only sees THEIR notes
//   - No need to send user_id in the request body
//   - The user can't fake their identity (it comes from the verified token)
//
// ============================================================

const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Get the Authorization header
    // Expected format: "Bearer eyJhbGciOiJIUzI1NiJ9..."
    const authHeader = req.headers.authorization;

    // Step 2: Check if the header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Step 3: Extract the token (remove "Bearer " prefix)
    // "Bearer eyJ..." → ["Bearer", "eyJ..."] → take index 1
    const token = authHeader.split(" ")[1];

    // Step 4: Verify the token using the same secret used to sign it
    // If valid → returns payload { id: 5, email: "test@mail.com", iat: ..., exp: ... }
    // If invalid/expired → throws an error (caught by catch block)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Attach the decoded user data to the request object
    // Now any route handler after this middleware can access req.user
    req.user = decoded;

    // Step 6: Pass to the next middleware or route handler
    next();
  } catch (error) {
    // jwt.verify() throws specific errors:
    //   - TokenExpiredError → token has passed its expiresIn time
    //   - JsonWebTokenError → token is malformed or signature doesn't match
    //   - NotBeforeError → token is not yet active (rare)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Authentication failed.",
    });
  }
};

// ============================================================
// 📘 HOW TO USE THIS MIDDLEWARE
//
// OPTION 1: Protect ALL routes in a router
//   import authMiddleware from "../middleware/authMiddleware.js";
//   router.use(authMiddleware);  // every route below this is protected
//
// OPTION 2: Protect SPECIFIC routes
//   router.get("/profile", authMiddleware, (req, res) => {
//     // only runs if token is valid
//     res.json({ user: req.user });
//   });
//
// OPTION 3: Protect entire router from index.js
//   app.use("/api/notes", authMiddleware, noteRoutes);
//   // every route in noteRoutes is now protected
//
// In our app, we'll use this to protect /api/notes routes
// so only logged-in users can create, read, update, delete notes.
// ============================================================

export default authMiddleware;
