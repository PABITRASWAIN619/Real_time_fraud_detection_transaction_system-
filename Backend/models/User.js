import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  phone: { type: String, required: true },
 role: { type: String, enum: ["admin", "user"], default: "user" }
});

const User = mongoose.model("User", userSchema);
export default User;
