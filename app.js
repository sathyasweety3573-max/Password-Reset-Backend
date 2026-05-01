import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully",
  });
});

// USER ROUTES
app.use("/api/user", userRoutes);

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// 404 ROUTE HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// PORT
const PORT = process.env.PORT || 5000;

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });