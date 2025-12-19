import express from "express";
import { followUser, unfollowUser } from "../controllers/followController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { checkNotBanned } from "../middlewares/banMiddleware.js";
const router = express.Router();

router.post("/:id", protect,checkNotBanned, followUser);
router.delete("/:id", protect,checkNotBanned, unfollowUser);

export default router;
