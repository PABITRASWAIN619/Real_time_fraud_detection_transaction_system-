import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🟢 Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Default export (can import either way)
export default verifyToken;
