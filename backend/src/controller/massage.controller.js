import Message from "../model/message.model.js";
import { io } from "../app.js";
import imagekit from "../db/imagekit.js";
import { messaging } from "../db/firebase-admin.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";
/**
 * =========================
 * SEND MESSAGE
 * =========================
 */
// export const sendMessage = async (req, res) => {
//   try {
//     const { receiver, text } = req.body;
 
//     // EARLY EXITS — before any async work
//     if (!receiver) {
//       return res.status(400).json({ message: "Receiver is required" });
//     }

//     if (!text?.trim() && !req.file) {
//       return res.status(400).json({ message: "Message cannot be empty" });
//     }
 
//     const sender = req.user._id;
 
//     // UPLOAD IMAGE — only if file exists
//     let image = "";
//     if (req.file) {
//       const uploaded = await imagekit.files.upload({         // imagekit.upload() is faster than imagekit.files.upload()
//         file: req.file.buffer.toString("base64"),
//         fileName: `${Date.now()}-${req.file.originalname}`,
//         folder: "/avatarsTelegramClone",
//       });
//       image = uploaded.url;
//     }
 
//     // CREATE MESSAGE
//     const message = await Message.create({
//       sender,
//       receiver,
//       text: text?.trim() || "",
//       image,
//     });
 
//     // EMIT + RESPOND in parallel — don't await emit
//     io.to(receiver.toString()).emit("receive_message", {
//       ...message.toObject(),
//       senderId: sender,
//       receiverId: receiver,
//     });
//  const receiverUser = await User.findById(receiver);
// const senderUser = await User.findById(sender);

// if (receiverUser?.fcmToken) {
//   try {
//     await messaging.send({
//       token: receiverUser.fcmToken,
//       // ❌ REMOVED: notification field (was causing auto-display by browser)
//       data: {
//         title: senderUser.name,                        // ✅ moved here
//         body: text?.trim() || "📷 Image",              // ✅ moved here
//         senderId: sender.toString(),
//         receiverId: receiver.toString(),
//         senderAvatar: senderUser?.avatar || "",
//       },
//     });

//     console.log("Notification sent");
//   } catch (err) {
//     console.error("FCM Error:", err);
//   }
// }

//     return res.status(201).json({
//       message: "Message sent successfully",
//       data: message,
//     });
//   } catch (error) {
//     console.error("Send Message Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
//  export const sendMessage = async (req, res) => {
//   try {
//     const { receiver, text } = req.body;

//     // Validation
//     if (!receiver) {
//       return res.status(400).json({
//         message: "Receiver is required",
//       });
//     }

//     const trimmedText = text?.trim() || "";

//     if (!trimmedText && !req.file) {
//       return res.status(400).json({
//         message: "Message cannot be empty",
//       });
//     }

//     const sender = req.user._id;

//     // Upload image only if present
//     let image = "";

//     if (req.file) {
//       const uploaded = await imagekit.files.upload({
//         file: req.file.buffer.toString("base64"),
//         fileName: `${Date.now()}-${req.file.originalname}`,
//         folder: "/avatarsTelegramClone",
//       });

//       image = uploaded.url;
//     }

//     // Create message
//     const message = await Message.create({
//       sender,
//       receiver,
//       text: trimmedText,
//       image,
//     });

//     // Socket emit (don't await)
//     io.to(receiver.toString()).emit("receive_message", {
//       ...message.toObject(),
//       senderId: sender,
//       receiverId: receiver,
//     });

//     // Send response immediately
//     res.status(201).json({
//       message: "Message sent successfully",
//       data: message,
//     });

//     // Everything below runs in background
//     Promise.all([
//       User.findById(receiver)
//         .select("fcmToken")
//         .lean(),

//       User.findById(sender)
//         .select("name avatar")
//         .lean(),
//     ])
//       .then(async ([receiverUser, senderUser]) => {
//         if (!receiverUser?.fcmToken) return;

//         try {
//           await messaging.send({
//             token: receiverUser.fcmToken,
//             data: {
//               title: senderUser?.name || "New Message",
//               body: trimmedText || "📷 Image",
//               senderId: sender.toString(),
//               receiverId: receiver.toString(),
//               senderAvatar: senderUser?.avatar || "",
//             },
//           });

//           console.log("Notification sent");
//         } catch (err) {
//           console.error("FCM Error:", err);
//         }
//       })
//       .catch((err) => {
//         console.error("Background task error:", err);
//       });
//   } catch (error) {
//     console.error("Send Message Error:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text, replyTo } = req.body;
      console.log(req.body)
    // Validation
    if (!receiver) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    const trimmedText = text?.trim() || "";

    if (!trimmedText && !req.file) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const sender = req.user._id;

    // Upload image (if any)
    let image = "";

    if (req.file) {
      const uploaded = await imagekit.files.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/avatarsTelegramClone",
      });

      image = uploaded.url;
    }

    // 1️⃣ Create message
    const message = await Message.create({
      sender,
      receiver,
      text: trimmedText,
      image,
      replyTo: replyTo || null,
    });

    // 2️⃣ Populate replyTo (IMPORTANT)
    const populatedMessage = await Message.findById(message._id)
      .populate("replyTo")
      .lean();

    // 3️⃣ Socket emit
    io.to(receiver.toString()).emit("receive_message", populatedMessage);

    // 4️⃣ Send response immediately
    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });

    // 5️⃣ Background FCM task
    Promise.all([
      User.findById(receiver).select("fcmToken").lean(),
      User.findById(sender).select("name avatar").lean(),
    ])
      .then(async ([receiverUser, senderUser]) => {
        if (!receiverUser?.fcmToken) return;

        try {
          await messaging.send({
            token: receiverUser.fcmToken,
            data: {
              title: senderUser?.name || "New Message",
              body: trimmedText || "📷 Image",
              senderId: sender.toString(),
              receiverId: receiver.toString(),
              senderAvatar: senderUser?.avatar || "",
            },
          });

          console.log("Notification sent");
        } catch (err) {
          console.error("FCM Error:", err);
        }
      })
      .catch((err) => {
        console.error("Background task error:", err);
      });
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
/**
 * =========================
 * GET CHAT BETWEEN TWO USERS
 * =========================
 */
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const myId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const query = {
      deleted: false,
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    };

    const [messages, totalMessages] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id sender receiver text image seen createdAt replyTo")
        .populate({
          path: "replyTo",
          select: "_id text image sender createdAt",
        })
        .lean(),

      Message.countDocuments(query),
    ]);

    const orderedMessages = messages.reverse();

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: orderedMessages,
      pagination: {
        page,
        limit,
        totalMessages,
        hasMore: skip + messages.length < totalMessages,
      },
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
// export const getMessages = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const myId = req.user._id;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     const messages = await Message.find({
//       deleted: false,
//       $or: [
//         { sender: myId, receiver: userId },
//         { sender: userId, receiver: myId },
//       ],
//     })
//       .sort({ createdAt: 1 })

//       // only required fields (FAST)
//       .select("_id sender receiver text image seen createdAt replyTo")

//       // populate reply message (IMPORTANT)
//       .populate({
//         path: "replyTo",
//         select: "_id text image sender createdAt",
//       })

//       .lean();

//     return res.status(200).json({
//       message: "Messages fetched successfully",
//       data: messages,
//     });
//   } catch (error) {
//     console.error("Get Messages Error:", error);

//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

/**
 * =========================
 * MARK AS SEEN
 * =========================
 */
export const markAsSeen = async (req, res) => {
  try {
    const { senderId } = req.body;
    const myId = req.user._id;
     const messages = await Message.find({
      sender: senderId,
      receiver: myId,
      seen: false,
    });
    await Message.updateMany(
      {
        sender: senderId,
        receiver: myId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );
      // Notify sender that messages were seen
    messages.forEach((msg) => {
      io.to(senderId.toString()).emit("message_seen_update", {
        messageId: msg._id,
      });
    });
    console.log("Messages marked as seen")
    return res.status(200).json({
      message: "Messages marked as seen",
    });
  } catch (error) {
    console.error("Mark Seen Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * =========================
 * DELETE MESSAGE (SOFT DELETE)
 * =========================
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.query;
    const userId = req.user._id;

    // 🔥 FIX: prevent crash
    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message id" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.deleted = true;
    await message.save();
     // ✅ FIX: use real receiver from message
    const receiverId = message.receiver.toString();
    const senderId = message.sender.toString();

    io.to(receiverId).emit("messageDeleted", {
      messageId,
    });

    io.to(senderId).emit("messageDeleted", {
      messageId,
    });

    return res.status(200).json({
      message: "Message deleted",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getImageMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { selectedUserId } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: myId },
      ],
      deleted: false,
      image: {
        $exists: true,
        $nin: [null, ""],
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Image Messages Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};