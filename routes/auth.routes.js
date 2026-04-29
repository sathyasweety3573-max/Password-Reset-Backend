import express from "express";

import {

  Login,

  forgotPassword,

  verifyResetToken,

  resetPassword,

} from "../controller/auth.controller.js";

const router =
  express.Router();


// LOGIN
router.post(
  "/login",
  Login
);


// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);


// VERIFY RESET TOKEN
router.get(
  "/verify-reset-token/:token",
  verifyResetToken
);


// RESET PASSWORD
router.post(
  "/reset-password/:token",
  resetPassword
);


export default router;