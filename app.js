import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

// FIXED HERE
const MONGO_URL = process.env.MONGO_URI;

console.log("MONGO_URI =", MONGO_URL);

if (!MONGO_URL) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });