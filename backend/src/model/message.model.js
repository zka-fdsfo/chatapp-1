import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // =========================
    // Sender
    // =========================
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // Receiver
    // =========================
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // Message Text
    // =========================
    text: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // Image Message
    // =========================
    image: {
      type: String,
      default: "",
    },

    // =========================
    // Seen Status
    // =========================
    seen: {
      type: Boolean,
      default: false,
    },

    // =========================
    // Deleted Message
    // =========================
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;