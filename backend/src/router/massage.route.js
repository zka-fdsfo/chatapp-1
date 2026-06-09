import express from "express";
import {
  sendMessage,
  getMessages,
  markAsSeen,
  deleteMessage,
} from "../controller/massage.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from '../middleware/multer.js'
const router = express.Router();

router.post("/send", authMiddleware, upload.single('image'), sendMessage);
router.get("/chatusers", authMiddleware, getMessages);
router.put("/seen", authMiddleware, markAsSeen);
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;