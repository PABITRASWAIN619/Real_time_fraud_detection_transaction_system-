import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Named export version

dotenv.config();

const router = express.Router();

// 🟢 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, userId, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      userId,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { loginId, password, role } = req.body;

    // Match email or userId
    const user =
      (await User.findOne({ email: loginId })) ||
      (await User.findOne({ userId: loginId }));

    if (!user) return res.status(400).json({ message: "User not found" });

    // Check role
    if (user.role !== role) {
      return res.status(403).json({ message: `Invalid role selected for ${user.firstName}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        role: user.role,
        email: user.email,
        loginId: user.userId || user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 CHANGE PASSWORD (Protected)
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // `req.user.id` comes from verifyToken middleware
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
