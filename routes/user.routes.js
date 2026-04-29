import express from "express";

import createUser from "../controller/user.controller.js";

const router =
  express.Router();


// SIGNUP
router.post(
  "/signup",
  createUser
);

export default router;