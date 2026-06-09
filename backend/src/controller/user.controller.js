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

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user;

    const users = await User.find({
      _id: { $ne: currentUserId },
    }).select("name email avatar bio");

    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        // Get only the latest message sent BY this user TO the current user
        const lastMessage = await Message.findOne({
          sender: user._id,
          receiver: currentUserId,
        })
          .sort({ createdAt: -1 })
          .select("text image message createdAt sender receiver seen");

        return {
          ...user.toObject(),
          lastMessage,
        };
      })
    );

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const changeCurrentUserinfo = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user;

    const { name, bio } = req.body;
    console.log("name 159",name)

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
