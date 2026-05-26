import React, { useEffect, useRef, useState } from "react";

import MessageBubble from "./MessageBubble";
import { ArrowDown } from "lucide-react";
import EmptyChat from "./EmptyChat";

const MessageList = ({
  messages,
  currentUserId,
  menuMsg,
  setMenuMsg,
  setEditMsg,
  setEditText,
  handleDeleteMessage,
}) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // FILTER VALID MESSAGES
  const validMessages = messages.filter(
    (msg) => msg && msg.text && msg.text.trim() !== ""
  );

  // AUTO SCROLL ON NEW MESSAGE
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // DETECT SCROLL POSITION
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    setShowScrollBtn(!isNearBottom);
  };

  return (
    <div className="relative flex-1 min-h-0">

      {/* MESSAGES CONTAINER */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="
          h-full
          overflow-y-auto
          px-6 py-4
          space-y-4
          scrollbar-none
        "
      >

        {/* EMPTY STATE */}
        {validMessages.length === 0 ? (
          <EmptyChat />
        ) : (
          validMessages.map((msg) => {
            const senderId =
              typeof msg.sender === "object"
                ? msg.sender._id
                : msg.sender;

            const isMe = senderId === currentUserId;

            return (
              <MessageBubble
                key={msg._id}
                msg={msg}
                isMe={isMe}
                menuMsg={menuMsg}
                setMenuMsg={setMenuMsg}
                setEditMsg={setEditMsg}
                setEditText={setEditText}
                handleDeleteMessage={handleDeleteMessage}
              />
            );
          })
        )}

        {/* BOTTOM ANCHOR */}
        <div ref={bottomRef} />
      </div>

      {/* SCROLL TO BOTTOM BUTTON */}
     {showScrollBtn && (
  <button
    onClick={() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }}
    className="
      absolute
      bottom-5
      right-[45%]
      bg-gray-600
      hover:bg-indigo-500
      text-white
      p-3
      rounded-full
      shadow-lg
      transition
      z-50
      flex items-center justify-center
    "
  >
    <ArrowDown size={22} />
  </button>
)}
    </div>
  );
};

export default MessageList;