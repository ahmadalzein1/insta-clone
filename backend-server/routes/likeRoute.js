import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { likePost, unlikePost } from "../controllers/likeController.js";

const router = express.Router();

router.post("/:postId", protect, likePost);
router.delete("/:postId", protect, unlikePost);

export default router;
