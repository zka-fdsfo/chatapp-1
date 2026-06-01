import React, { useEffect, useRef, useState } from "react";

import MessageBubble from "./MessageBubble";
import EmptyChat from "./EmptyChat";
import { ArrowDown } from "lucide-react";

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
  const wrapperRef = useRef(null);
  const bottomRef = useRef(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // FILTER VALID MESSAGES
const validMessages = messages.filter(
  (msg) => msg && (msg.text || msg.message)
);
  
  // AUTO SCROLL ON NEW MESSAGE
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // DETECT SCROLL POSITION
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    setShowScrollBtn(!isNearBottom);
  };

  // OUTSIDE CLICK TO CLOSE MENU
useEffect(() => {
  const handleClickOutside = (e) => {
    // if no menu open → ignore
    if (!menuMsg) return;

    // check if click is inside a message bubble
    const isInsideMessage = e.target.closest("[data-message]");
    const isInsideMenu = e.target.closest("[data-menu]");

    if (!isInsideMessage && !isInsideMenu) {
      setMenuMsg(null);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [menuMsg]);

  return (
    <div ref={wrapperRef} className="relative flex-1 min-h-0">
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
        msg={{
          ...msg,
          text: msg.text || msg.message, // IMPORTANT FIX
        }}
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
            bottomRef.current?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="
            absolute bottom-5 right-[45%] bg-gray-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition z-50 flex items-center justify-center
          "
        >
          <ArrowDown size={22} />
        </button>
      )}
    </div>
  );
};

export default MessageList;
