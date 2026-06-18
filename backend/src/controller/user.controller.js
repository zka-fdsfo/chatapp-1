import Session from "../model/session.model.js";
import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import imagekit from "../db/imagekit.js";
// export const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find().select("name email");
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// }

/**
 * Get all users except the current user and include the latest message
 * sent by each user to the current user.
 *
 * Usage: GET /api/users (protected)
 * Response: Array of users with `lastMessage` field (latest message sent TO current user).
 */
export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const [users, messages] = await Promise.all([
      User.find({
        _id: { $ne: currentUserId },
      })
        .select("name avatar bio")
        .lean(),

      Message.find({
        deleted: false,
        $or: [
          { sender: currentUserId },
          { receiver: currentUserId },
        ],
      })
        .sort({ createdAt: -1 })
        .select(
          "text image message createdAt sender receiver seen"
        )
        .lean(),
    ]);

    const userMap = new Map();

    for (const msg of messages) {
      const senderId = String(msg.sender);
      const receiverId = String(msg.receiver);

      const otherUserId =
        senderId === currentUserId
          ? receiverId
          : senderId;

      if (!userMap.has(otherUserId)) {
        userMap.set(otherUserId, {
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      // Count unread messages sent TO current user
      if (
        senderId !== currentUserId &&
        receiverId === currentUserId &&
        msg.seen === false
      ) {
        userMap.get(otherUserId).unreadCount++;
      }
    }

    const usersWithLastMessage = users.map((user) => {
      const data = userMap.get(String(user._id));

      let formattedLastMessage = null;

      if (data?.lastMessage) {
        const lastMessage = data.lastMessage;

        formattedLastMessage = {
          ...lastMessage,
          displayText:
            String(lastMessage.sender) === currentUserId
              ? `(You) ${
                  lastMessage.text ||
                  lastMessage.message ||
                  (lastMessage.image ? "📷 Photo" : "")
                }`
              : lastMessage.text ||
                lastMessage.message ||
                (lastMessage.image ? "📷 Photo" : ""),
        };
      }

      return {
        ...user,
        unreadCount: data?.unreadCount || 0,
        lastMessage: formattedLastMessage,
      };
    });

    const chattedUsers = usersWithLastMessage
      .filter((user) => user.lastMessage)
      .sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt) -
          new Date(a.lastMessage.createdAt)
      );

    const nonChattedUsers = usersWithLastMessage
      .filter((user) => !user.lastMessage)
      .slice(0, 8);

    const finalUsers = [...chattedUsers, ...nonChattedUsers];

    res.status(200).json(finalUsers);
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
/**
 * Update the current user's profile information (name, bio, and avatar).
 *
 * Usage: PUT /api/users/me (protected)
 * Body: { name?, bio? } and optionally a file upload for avatar (multipart/form-data).
 * Response: Updated user object with fields `name`, `email`, `avatar`, `bio`.
 */
export const changeCurrentUserinfo = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user;

    const { name, bio } = req.body;
   
    const update = {};
    let avatar;

    if (req.file) {
      const uploadedImage = await imagekit.files.upload({
        file: req.file.buffer.toString("base64"),
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/avatarsTelegramClone",
      });

      avatar = uploadedImage.url;
    }

    if (name !== undefined) {
      update.name = name;
    }

    if (bio !== undefined) {
      update.bio = bio;
    }

    if (avatar) {
      update.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      currentUserId,
      update,
      {
        new: true,
        runValidators: true,
      }
    ).select("name email avatar bio");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("changeCurrentUserinfo:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * Save or update the FCM (Firebase Cloud Messaging) token for the authenticated user.
 *
 * Usage: POST /api/users/fcm-token (protected)
 * Body: { token: string }
 * Purpose: Store token so the backend can send push notifications to this user.
 */
export const saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { token } = req.body;

    await User.findByIdAndUpdate(userId, {
      fcmToken: token,
    });

    res.status(200).json({
      success: true,
      message: "FCM token saved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to save token",
    });
  }
};

//search user controller
export const searchUsers = async (req, res) => {
  try {
    const currentUserId = req.user;
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
      name: {
        $regex: query,
        $options: "i", // case-insensitive
      },
    })
      .select("name avatar bio")
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    console.error("Search Users Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};