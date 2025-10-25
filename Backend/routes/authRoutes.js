import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/Signup", async (req, res) => {
  try {
    const { firstName, lastName, userId, email, phone ,password, role } = req.body;

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

// Login
router.post("/login", async (req, res) => {
  try {
    const { loginId, password, role } = req.body;

    // Match email or userId
    const user =
      (await User.findOne({ email: loginId })) ||
      (await User.findOne({ userId: loginId }));

    if (!user) return res.status(400).json({ message: "User not found" });

    // Check role match
    if (user.role !== role) {
      return res.status(403).json({ message: `Invalid role selected for ${user.firstName}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
