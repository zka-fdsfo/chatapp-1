import express from "express";
import {
  sendMessage,
  getMessages,
  markAsSeen,
  deleteMessage,
} from "../controller/massage.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/chatusers", authMiddleware, getMessages);
router.put("/seen", authMiddleware, markAsSeen);
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;