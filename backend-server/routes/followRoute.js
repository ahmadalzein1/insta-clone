import express from "express";
import { followUser, unfollowUser } from "../controllers/followController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id", protect, followUser);
router.delete("/:id", protect, unfollowUser);

export default router;
