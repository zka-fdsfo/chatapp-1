import Message from "../model/message.model.js";
import { io } from "../app.js";
import imagekit from "../db/imagekit.js";
import { messaging } from "../db/firebase-admin.js";
import User from "../model/user.model.js";
/**
 * =========================
 * SEND MESSAGE
 * =========================
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
 
    // EARLY EXITS — before any async work
    if (!receiver) {
      return res.status(400).json({ message: "Receiver is required" });
    }
    if (!text?.trim() && !req.file) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }
 
    const sender = req.user._id;
 
    // UPLOAD IMAGE — only if file exists
    let image = "";
    if (req.file) {
      const uploaded = await imagekit.files.upload({         // imagekit.upload() is faster than imagekit.files.upload()
        file: req.file.buffer.toString("base64"),
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/avatarsTelegramClone",
      });
      image = uploaded.url;
    }
 
    // CREATE MESSAGE
    const message = await Message.create({
      sender,
      receiver,
      text: text?.trim() || "",
      image,
    });
 
    // EMIT + RESPOND in parallel — don't await emit
    io.to(receiver.toString()).emit("receive_message", {
      ...message.toObject(),
      senderId: sender,
      receiverId: receiver,
    });
 const receiverUser = await User.findById(receiver);
const senderUser = await User.findById(sender);

if (receiverUser?.fcmToken) {
  try {
    await messaging.send({
      token: receiverUser.fcmToken,
      notification: {
        title: senderUser.name,
        body: text?.trim() || "📷 Image",
      },
      data: {
        senderId: sender.toString(),
        receiverId: receiver.toString(),
      },
    });

    console.log("Notification sent");
  } catch (err) {
    console.error("FCM Error:", err);
  }
}
    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
 
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
      deleted: false,
    })
      .sort({ createdAt: 1 })
      .select("sender receiver text image seen createdAt")  // only fetch needed fields
      .lean();                                               // plain JS objects, skips Mongoose overhead
 
    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender can delete
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    message.deleted = true;
    await message.save();

    return res.status(200).json({
      message: "Message deleted",
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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