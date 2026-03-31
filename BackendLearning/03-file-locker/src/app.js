import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

// ============================================================
// 📘 WHY SEPARATE app.js AND index.js?
//
// In Project 2, everything was in one file (index.js).
// Now we split them:
//
//   app.js  → CREATES the Express app (middleware, routes)
//   index.js → STARTS the server (connects DB, listens on port)
//
// WHY?
//   1. Cleaner separation of concerns
//   2. Easier to test — you can import `app` without starting the server
//   3. Industry standard pattern (MVC architecture)
//
// Think of it like a restaurant:
//   app.js  = the kitchen setup (menu, chef stations, recipes)
//   index.js = opening the doors (turning on lights, unlocking entrance)
// ============================================================

const app = express();

// ======================== MIDDLEWARE ========================
// These run on EVERY request, in order:

// 1. CORS — allows frontend apps on different domains to call our API
app.use(cors());

// 2. JSON parser — converts request body from JSON string to JavaScript object
//    Without this, req.body would be undefined
app.use(express.json());

// ======================== ROUTES ========================

// Root endpoint — quick health check / API overview
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the File Locker API",
    version: "1.0.0",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      uploadFile: "POST /api/files",
      listFiles: "GET /api/files",
      getFile: "GET /api/files/:id",
      downloadFile: "GET /api/files/:id/download",
      deleteFile: "DELETE /api/files/:id",
    },
  });
});

// Auth routes — public (no token needed)
app.use("/api/auth", authRoutes);

// 📘 File routes will be added here in Phase 2:
// app.use("/api/files", authMiddleware, fileRoutes);

export default app;
