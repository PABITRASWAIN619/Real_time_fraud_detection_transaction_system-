import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
