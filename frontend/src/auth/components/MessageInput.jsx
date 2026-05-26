import React from "react";
import { Send } from "lucide-react";

const MessageInput = ({
  messageText,
  setMessageText,
  selectedUser,
  handleSendMessage,
}) => {
  
  const sendMessage = () => {
    if (!messageText.trim()) return;

    handleSendMessage(selectedUser._id, messageText);

    setMessageText("");
  };

  return (
    <div className="p-3 md:p-4 backdrop-blur-md">
      <div
        className="
          flex items-center gap-3
          bg-[#2a2a2a]
          rounded-full
          px-4 py-3
        "
      >
        {/* INPUT */}
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="
            flex-1 pl-2
            bg-transparent
            outline-none
            text-white
            placeholder:text-zinc-400
            text-sm md:text-base
          "
        />

        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          className="
            text-blue-500
            hover:text-blue-400
            transition
          "
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;