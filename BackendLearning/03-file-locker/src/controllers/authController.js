import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

// ============================================================
// 📘 WHAT IS A CONTROLLER?
//
// A controller is the "brain" — it handles the BUSINESS LOGIC.
// It sits between the route and the model:
//
//   Route (receives request)
//     → Controller (decides WHAT to do)
//       → Model (talks to database)
//     ← Controller (decides WHAT to respond)
//   ← Route (sends response)
//
// Think of it like a restaurant:
//   Route = waiter (takes the order)
//   Controller = chef (cooks the food, makes decisions)
//   Model = pantry (stores and retrieves ingredients)
//
// 📘 WHAT CHANGED FROM PROJECT 2?
//
// In Project 2, ALL of this was in authRoutes.js:
//   - Route definition (router.post)
//   - Business logic (validation, hashing, JWT)
//   - Database queries (pool.query)
//
// Now it's split:
//   - authRoutes.js → ONLY defines which URL maps to which function
//   - authController.js → handles validation, hashing, JWT (this file)
//   - userModel.js → handles database queries
//
// Same logic, better organization! 🎯
// ============================================================

// ======================== REGISTER ========================
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password.",
      });
    }

    // Check if user already exists (using the MODEL, not raw SQL)
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database (using the MODEL)
    const result = await UserModel.create(username, email, hashedPassword);

    // Create JWT token — user is auto-logged-in after registering
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: result.insertId,
        username,
        email,
        // ⚠️ Never send back the password!
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ======================== LOGIN ========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user by email (using the MODEL)
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Compare password with stored hash
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
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export { register, login };
