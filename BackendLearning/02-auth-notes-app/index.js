import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Notes API",
    version: "1.0.0",
    endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      getNotes: "GET /api/notes",
      createNote: "POST /api/notes",
      getNote: "GET /api/notes/:id",
      updateNote: "PUT /api/notes/:id",
      deleteNote: "DELETE /api/notes/:id",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL database connected successfully!");
    console.log(`Server is running on port http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    console.error(
      "   Check your .env credentials and ensure MySQL is running.",
    );
  }
});
