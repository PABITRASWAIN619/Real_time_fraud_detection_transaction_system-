import express from "express";
import Transaction from "../models/Transaction.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ middleware to verify JWT

const router = express.Router();

// ✅ Create a new transaction (user must be logged in)
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { amount, type, description } = req.body;

    // Validate input
    if (!amount || !type) {
      return res.status(400).json({ message: "Amount and type are required" });
    }

    const transaction = new Transaction({
      userId: req.user.id, // ✅ get userId from verified token
      amount,
      type,
      description,
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Failed to add transaction" });
  }
});

// ✅ Get all transactions for the logged-in user
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    // Use token user ID, ignore param if provided
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

// ✅ Get all transactions (Admin view)
router.get("/all", verifyToken, async (req, res) => {
  try {
    // Only allow admin users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const transactions = await Transaction.find()
      .populate("userId", "firstName email")
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

export default router;
