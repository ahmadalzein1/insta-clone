import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getComments, addComment } from "../controllers/commentController.js";
import { checkNotBanned } from "../middlewares/banMiddleware.js";
const router = express.Router();

router.get("/:postId", protect, getComments);
router.post("/:postId", protect,checkNotBanned, addComment);

export default router;
