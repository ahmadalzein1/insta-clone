import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { likePost, unlikePost } from "../controllers/likeController.js";
import { checkNotBanned } from "../middlewares/banMiddleware.js";
const router = express.Router();

router.post("/:postId", protect,checkNotBanned, likePost);
router.delete("/:postId", protect,checkNotBanned, unlikePost);

export default router;
