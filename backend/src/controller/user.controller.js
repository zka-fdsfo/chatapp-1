import Session from "../model/session.model.js";
import User from "../model/user.model.js";
import Message from "../model/message.model.js";
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
    }).select("name email avatar");

    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            {
              sender: currentUserId,
              receiver: user._id,
            },
            {
              sender: user._id,
              receiver: currentUserId,
            },
          ],
        })
          .sort({ createdAt: -1 })
          .select("text message createdAt sender receiver seen");

        return {
          ...user.toObject(),
          lastMessage,
        };
      })
    );

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const changeCurrentUserinfo = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user;

    const { name, avatar, bio } = req.body;
    const update = {};
    if(req.body.name!==undefined) {
      update.name = name;
    }
    if(req.body.avatar!==undefined) {
      update.avatar = avatar;
    }
    if(req.body.bio!==undefined) {
      update.bio = bio;
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