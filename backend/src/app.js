import express from "express";

import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./router/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.route.js";
import messageRouter from "./router/massage.route.js";
import cors from "cors";
import Message from "./model/message.model.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
const app = express();
app.use(express.json());
app.use(morgan("dev"));
const server = createServer(app);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
const onlineUsers = new Map();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 user connected:", socket.id);

  // =========================
  // USER ONLINE
  // =========================
  socket.on("online-user", (userId) => {
    if (!userId) return;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    socket.join(userId);

    io.emit("online-users", Array.from(onlineUsers.keys()));

    console.log(`🟢 User ${userId} is online`);
  });

  // =========================
  // SEND MESSAGE
  // =========================
//  socket.on("send_message", (data) => {
//   const { senderId, receiverId, text } = data;

//   if (!senderId || !receiverId || !text?.trim()) {
//     return;
//   }

//   const payload = {
//     _id: Date.now().toString(),
//     senderId,
//     receiverId,
//     text: text.trim(),
//     seen: false,
//     createdAt: new Date(),
//   };

//   // ONLY RECEIVER GETS SOCKET EVENT
//   io.to(receiverId).emit("receive_message", payload);

//   console.log(`📩 Message from ${senderId} to ${receiverId}`);
// });

  // =========================
  // TYPING
  // =========================
  socket.on("typing", ({ senderId, receiverId,typing }) => {
    if (!senderId || !receiverId ) return;
      console.log("SERVER RECEIVED:", {
    senderId,
    receiverId,
    typing,
  });
    io.to(receiverId).emit("typing", {
      senderId,
      typing,
    });
  });

  // socket.on("stop-typing", ({ senderId, receiverId }) => {
  //   if (!senderId || !receiverId) return;

  //   io.to(receiverId).emit("stop-typing", {
  //     senderId,
  //   });
  // });

  // =========================
  // MESSAGE SEEN
  // =========================
socket.on("message_seen", async ({ messageId, senderId }) => {
  console.log("👀 MESSAGE SEEN", {
    messageId,
    senderId,
  });
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    console.log("Invalid ObjectId:", messageId);
    return;
  }

  await Message.findByIdAndUpdate(messageId, {
    seen: true,
  });

  io.to(String(senderId)).emit("message_seen_update", {
    messageId,
  });
});

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    let userWentOffline = false;

    for (const [userId, socketSet] of onlineUsers.entries()) {
      if (socketSet.has(socket.id)) {
        socketSet.delete(socket.id);

        if (socketSet.size === 0) {
          onlineUsers.delete(userId);
          userWentOffline = true;

          console.log(`🔴 User ${userId} is offline`);
        }

        break;
      }
    }

    if (userWentOffline) {
      io.emit("online-users", Array.from(onlineUsers.keys()));
    }

    console.log("🔴 socket disconnected:", socket.id);
  });
});

console.log(process.env.FRONTEND_URL);

app.use(cookieParser());
app.set("trust proxy", true);
app.use("/api/auth", authLimiter,authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
export { app, io, server };
