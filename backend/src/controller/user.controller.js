import Session from "../model/session.model.js";
import User from "../model/user.model.js";
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("name email");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}