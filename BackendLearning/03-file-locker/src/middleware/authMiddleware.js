import jwt from "jsonwebtoken";

// ============================================================
// 📘 AUTH MIDDLEWARE — Same concept from Project 2!
//
// This is identical to what you built before.
// The ONLY difference is it now lives in the middleware/ folder
// as part of the MVC structure.
//
// QUICK RECAP:
//   1. Client sends: Authorization: Bearer <token>
//   2. We extract the token from the header
//   3. jwt.verify() checks if it's valid + not expired
//   4. If valid → attach decoded user to req.user → call next()
//   5. If invalid → send 401 Unauthorized
//
// This middleware will be used in Phase 2 to protect file routes:
//   app.use("/api/files", authMiddleware, fileRoutes);
// ============================================================

const authMiddleware = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token: "Bearer eyJ..." → "eyJ..."
    const token = authHeader.split(" ")[1];

    // Verify the token — returns payload { id, email, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to the request object
    // Now controllers can use req.user.id to know WHO made the request
    req.user = decoded;

    // Pass to the next middleware or route handler
    next();
  } catch (error) {
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

export default authMiddleware;
