import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { checkNotBanned } from "../middlewares/banMiddleware.js";
import {
  getConversations,
  getMessages,
  sendMessage,
  createOneToOne,
  createGroup,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.post("/conversations/one", protect, checkNotBanned, createOneToOne);
router.post("/conversations/group", protect, checkNotBanned, createGroup);

router.get("/messages/:conversationId", protect, getMessages);
router.post("/messages/:conversationId", protect, checkNotBanned, sendMessage);

export default router;
