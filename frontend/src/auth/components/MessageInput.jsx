import React, { useState } from "react";

import { Send, Paperclip, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  messageText,
  setMessageText,
  selectedUser,
  handleSendMessage,
  socketRef,
  user,
}) => {
// const sendMessage = async () => {
//   try {
//     if (!messageText?.trim()) return;
//     if (!user?._id || !selectedUser?._id) return;
//     if (!socketRef?.current) return;

//     const text = messageText;

//     // 1. SEND VIA API (FIXED FORMAT)
//     await handleSendMessage(selectedUser._id, text);

//     // 2. SOCKET EMIT
//     socketRef.current.emit("send_message", {
//       senderId: user._id,
//       receiverId: selectedUser._id,
//       text: text,
//       createdAt: new Date(),
//     });

//     setMessageText("");
//   } catch (err) {
//     console.log("Send error:", err);
//   }
// };
const sendMessage = () => {
  if (!messageText.trim()) return;

  const msg = {
    senderId: user._id,
    receiverId: selectedUser._id,
    text: messageText,
    createdAt: new Date(),
  };

  handleSendMessage(selectedUser._id, messageText);

  socketRef.current.emit("send_message", msg);

  setMessageText("");
};
  const [showEmoji, setShowEmoji] = useState(false);
  return (
//   <div className="p-3 lg:px-20">
//   <div className="flex items-center bg-[#1f1f1f] rounded-full px-4 py-3 gap-3">

//     <Smile
//       size={22}
//       className="text-zinc-400 cursor-pointer hover:text-white"
//     />

//     <textarea
//   rows="1"
//   value={messageText}
//   onChange={(e) => {
//     setMessageText(e.target.value);
//     e.target.style.height = "auto";
//     e.target.style.height = `${e.target.scrollHeight}px`;
//   }}
//   className="
//     flex-1
//     bg-transparent
//     text-white
//     outline-none
//     resize-none
//     max-h-32
//     overflow-y-auto
//   "
// />

//     <Paperclip
//       size={22}
//       className="text-zinc-400 cursor-pointer hover:text-white"
//     />

//     <button onClick={sendMessage}>
//       <Send
//         size={24}
//         className="text-[#8774e1] hover:text-[#9d8cff]"
//       />
//     </button>

//   </div>
// </div>
 <div className="p-3 lg:px-20 relative">
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessageText((prev) => prev + emojiData.emoji);
              setShowEmoji(false);
            }}
            theme="dark"
          />
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-end bg-[#1f1f1fc2] backdrop-blur-xs rounded-full px-4 py-3 gap-3">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="text-zinc-400 hover:text-white transition"
        >
          <Smile size={22} />
        </button>

        {/* Text Area */}
        <textarea
          rows="1"
          placeholder="Message"
          value={messageText || ""}
          onChange={(e) => {
            setMessageText(e.target.value);

            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="
            flex-1
            bg-transparent
            text-white
            placeholder:text-zinc-500
            outline-none
            resize-none
            max-h-32
            overflow-y-auto
          "
        />

        {/* Attachment */}
        <button className="text-zinc-400 hover:text-white transition">
          <Paperclip size={22} />
        </button>

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="text-[#8774e1] hover:text-[#9d8cff] transition"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
);
};

export default MessageInput;