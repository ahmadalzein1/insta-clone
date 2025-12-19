import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { searchUsers, getUserProfile} from "../controllers/userController.js";
import { updateAvatar } from "../controllers/avatarController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { checkNotBanned } from "../middlewares/banMiddleware.js";



const router = express.Router();
router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserProfile);
router.put("/avatar", protect,checkNotBanned, upload.single("avatar"), updateAvatar);

export default router;
