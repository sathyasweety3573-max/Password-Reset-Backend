import express from "express";

import createUser from "../controller/user.controller.js";

const router = express.Router();

// SIGNUP ROUTE
router.post("/", createUser);

export default router;