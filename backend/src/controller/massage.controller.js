import Message from "../model/message.model.js";

/**
 * =========================
 * SEND MESSAGE
 * =========================
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text, image } = req.body;
    const sender = req.user._id; // assuming auth middleware sets req.user

    if (!receiver) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    if (!text && !image) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text || "",
      image: image || "",
    });

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
      .populate("sender", "name email")
      .populate("receiver", "name email");

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