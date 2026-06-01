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

// io.on("connection", (socket) => {
//   console.log("🟢 user connected:", socket.id);

//   // USER ONLINE
//   socket.on("online-user", (userId) => {
//     onlineUsers.set(userId, socket.id);

//     socket.join(userId);

//     io.emit("online-users", Array.from(onlineUsers.keys()));

//     console.log(`User ${userId} is online`);
//   });

//    // ✅ REAL-TIME MESSAGE HANDLING
//   socket.on("send_message", (data) => {
//     // data = { senderId, receiverId, message }

//     const { senderId, receiverId, message } = data;

//     // send to receiver
//     io.to(senderId).emit("receive_message", {
//   senderId,
//   receiverId,
//   message,
//   createdAt: new Date(),
// });

//     // also send back to sender (for UI sync)
//  // send only to receiver
// io.to(receiverId).emit("receive_message", {
//   senderId,
//   receiverId,
//   message,
//   createdAt: new Date(),
// });
//   });
//   // USER DISCONNECT
//   socket.on("disconnect", () => {
//     for (let [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         break;
//       }
//     }

//     io.emit("online-users", Array.from(onlineUsers.keys()));

//     console.log("🔴 user disconnected:", socket.id);
//   });
// });

//   io.on("connection", (socket) => {
//     console.log("🟢 user connected:", socket.id);

//     // =========================
//     // USER GO ONLINE
//     // =========================
//     socket.on("online-user", (userId) => {
//       if (!userId) return;

//       if (!onlineUsers.has(userId)) {
//         onlineUsers.set(userId, new Set());
//       }

//       onlineUsers.get(userId).add(socket.id);

//       socket.join(userId);

//       io.emit("online-users", Array.from(onlineUsers.keys()));

//       console.log(`🟢 User ${userId} is online`);
//     });

//     // =========================
//     // REAL-TIME MESSAGE
//     // =========================
//     socket.on("send_message", (data) => {
//       const { senderId, receiverId, text } = data;

//       if (!senderId || !receiverId || !text) return;

//       const payload = {
//         senderId,
//         receiverId,
//         text,

//         createdAt: new Date(),
//       };

//       // send ONLY to receiver
//       io.to(receiverId).emit("receive_message", payload);

//       console.log(`📩 Message from ${senderId} to ${receiverId}`);
//     });

//     // =========================
//     // TYPING (OPTIONAL)
//     // =========================
//     socket.on("typing", ({ senderId, receiverId }) => {
//       io.to(receiverId).emit("typing", { senderId });
//     });

//     socket.on("stop-typing", ({ senderId, receiverId }) => {
//       io.to(receiverId).emit("stop-typing", { senderId });
//     });

//     socket.on("message_seen", async ({ messageId, userId }) => {
//   // update DB if you want
//   // await Message.findByIdAndUpdate(messageId, { seen: true });

//   // notify sender
//   io.emit("message_seen_update", {
//     messageId,
//     userId,
//   });
// });
//     // =========================
//     // DISCONNECT HANDLING
//     // =========================
//     socket.on("disconnect", () => {
//       for (let [userId, socketSet] of onlineUsers.entries()) {
//         socketSet.delete(socket.id);

//         if (socketSet.size === 0) {
//           onlineUsers.delete(userId);
//         }
//       }

//       io.emit("online-users", Array.from(onlineUsers.keys()));

//       console.log("🔴 user disconnected:", socket.id);
//     });
//   });
io.on("connection", (socket) => {
  console.log("🟢 user connected:", socket.id);

  // =========================
  // ONLINE USER
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
  socket.on("send_message", (data) => {
    const { senderId, receiverId, text } = data;

    if (!senderId || !receiverId || !text) return;

    const payload = {
      senderId,
      receiverId,
      text,
      seen: true, // IMPORTANT
      createdAt: new Date(),
    };

    // send ONLY to receiver
    io.to(receiverId).emit("receive_message", payload);

    console.log(`📩 Message from ${senderId} to ${receiverId}`);
  });

  // =========================
  // TYPING
  // =========================
  socket.on("typing", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("typing", { senderId });
  });

  socket.on("stop-typing", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("stop-typing", { senderId });
  });

  // =========================
  // MESSAGE SEEN (BLUE TICK FIX)
  // =========================
  socket.on("message_seen", ({ messageId, senderId }) => {
    if (!messageId || !senderId) return;

    // send update ONLY to original sender
    io.to(senderId).emit("message_seen_update", {
      messageId,
    });

    console.log("👁 message seen:", messageId);
  });

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    for (let [userId, socketSet] of onlineUsers.entries()) {
      socketSet.delete(socket.id);

      if (socketSet.size === 0) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));

    console.log("🔴 user disconnected:", socket.id);
  });
});

  console.log(process.env.FRONTEND_URL)

app.use(cookieParser());
app.set("trust proxy", true);

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
export  {app , io, server };
