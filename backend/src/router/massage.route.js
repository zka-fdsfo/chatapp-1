import express from "express";
import {
  sendMessage,
  getMessages,
  markAsSeen,
  deleteMessage,
  getImageMessages,
  editMessages,
} from "../controller/massage.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from '../middleware/multer.js'
const router = express.Router();

router.post("/send", authMiddleware, upload.single('image'), sendMessage);
router.get("/chatusers", authMiddleware, getMessages);
router.put("/seen", authMiddleware, markAsSeen);
router.delete("/delete-message", authMiddleware, deleteMessage);
router.get("/image-messages", authMiddleware, getImageMessages);
router.put("/edit-message", authMiddleware, editMessages);
export default router;