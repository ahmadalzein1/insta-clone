import express from "express";
import { register, login, verifyEmail,resendVerification,forgotPassword,resetPassword } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// POST /api/auth/login
router.post("/login", login);

export default router;
