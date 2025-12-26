import express from "express";
import { register, login, verifyEmail,resendVerification } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// POST /api/auth/login
router.post("/login", login);

export default router;
