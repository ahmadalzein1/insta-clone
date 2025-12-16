import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getComments, addComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:postId", protect, getComments);
router.post("/:postId", protect, addComment);

export default router;
