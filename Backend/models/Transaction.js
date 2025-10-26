import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: String,
  status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
  date: { type: Date, default: Date.now },
});

// Create the model
const Transaction = mongoose.model("Transaction", transactionSchema);

// Export it as default
export default Transaction;
