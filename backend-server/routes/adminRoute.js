import express from "express";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import {
  toggleBanUser,
  deletePostAdmin,listPostsAdmin,listUsersAdmin
} from "../controllers/adminController.js";

const router = express.Router();

router.put("/users/:id/ban", protect, isAdmin, toggleBanUser);
router.delete("/posts/:id", protect, isAdmin, deletePostAdmin);

router.get("/users", protect, isAdmin, listUsersAdmin);
router.get("/posts", protect, isAdmin, listPostsAdmin);

export default router;
