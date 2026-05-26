import express from "express";

import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./router/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.route.js";
import messageRouter from "./router/massage.route.js";
import cors from 'cors';
import { Server } from "socket.io";
import { createServer } from 'node:http';

const app = express();
app.use(express.json());
app.use(morgan("dev"));
const server = createServer(app);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
const onlineUsers = new Map(); 
// userId -> socketId

io.on("connection", (socket) => {
  console.log("🟢 user connected:", socket.id);

  // USER ONLINE
  socket.on("online-user", (userId) => {
    onlineUsers.set(userId, socket.id);

    socket.join(userId);

    io.emit("online-users", Array.from(onlineUsers.keys()));

    console.log(`User ${userId} is online`);
  });

  // USER DISCONNECT
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));

    console.log("🔴 user disconnected:", socket.id);
  });
});

app.use(cookieParser());
app.set("trust proxy", true);

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
export  {app , io, server };
