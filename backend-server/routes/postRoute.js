import express from "express";
import { createPost, getFeed } from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { checkNotBanned } from "../middlewares/banMiddleware.js";

const router = express.Router();

router.post("/", protect,checkNotBanned, upload.single("image"), createPost);
router.get("/feed", protect, getFeed);

export default router;
