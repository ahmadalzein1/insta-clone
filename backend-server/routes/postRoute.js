import express from "express";
import { createPost, getFeed } from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/feed", protect, getFeed);

export default router;
