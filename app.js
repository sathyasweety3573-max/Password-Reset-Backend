import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

// Connect to express server
const app = express();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());


// Connect to MongoDB
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/password-reset-db";

mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors()); // Enable CORS for all routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import and use user routes

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);