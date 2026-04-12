import express from "express";

import {
  Login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controller/auth.controller.js";

const router = express.Router();
router.post("/login", Login);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);



export default router;