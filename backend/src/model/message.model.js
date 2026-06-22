import mongoose from "mongoose";
import { time } from "node:console";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    seen: {
      type: Boolean,
      default: false,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
    // 👇 ADD THIS
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================
// INDEXES
// ==========================

// Chat lookup + latest message
messageSchema.index({
  sender: 1,
  receiver: 1,
  createdAt: -1,
});

// Unread count
messageSchema.index({
  receiver: 1,
  sender: 1,
  seen: 1,
});

// Main sidebar query
messageSchema.index({
  deleted: 1,
  sender: 1,
  receiver: 1,
});

// Fetch messages of a conversation
messageSchema.index({
  sender: 1,
  receiver: 1,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
