import React from "react";
import { Send } from "lucide-react";

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

  return (
    <div className="pb-2  lg:px-5 md:p-4 ">
      <div className="flex items-center gap-2 rounded-full px-4 py-2">

        {/* INPUT */}
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText || ""}   // IMPORTANT FIX
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1  outline-none text-white  bg-[#2a2a2a] p-3 rounded-2xl placeholder:text-zinc-400 pl-8"
        />
        
        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          className="text-gray-200 hover:text-white bg-indigo-500 p-2.5 rounded-2xl "
        >
          <Send size={22} />
        </button>

      </div>
    </div>
  );
};

export default MessageInput;