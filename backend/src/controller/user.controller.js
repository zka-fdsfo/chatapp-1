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
    }).select("name email");

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