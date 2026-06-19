import React, { useEffect, useRef, useState } from "react";

import MessageBubble from "./MessageBubble";
import EmptyChat from "./EmptyChat";
import { ArrowDown } from "lucide-react";
import MessageSkeleton from "./MessageSkeleton";

const MessageList = ({
  messages,
  currentUserId,
  menuMsg,
  setMenuMsg,
  setEditMsg,
  setEditText,
  setuserid,
  handleDeleteMessage,
  setViewerImage,
  selectedUser,
  loadingMessages,
  setReplyMsg,
  pageLoading,
  loadOlderMessages,
}) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const bottomRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const prevHeightRef = useRef(0);
  const initialLoadRef = useRef(true);

  const validMessages = messages.filter(
    (msg) => msg && (msg.text || msg.message || msg.image),
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prevHeightRef.current) {
      requestAnimationFrame(() => {
        const newHeight = el.scrollHeight;
        el.scrollTop = newHeight - prevHeightRef.current;
        prevHeightRef.current = 0;
      });
      return;
    }

    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 50);
      return;
    }

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 150;

    if (isNearBottom) {
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 50);
    }
  }, [messages]);

  const handleScroll = (e) => {
    const el = e.target;

    if (el.scrollTop < 10 && !loadingMore) {
      prevHeightRef.current = el.scrollHeight;
      setLoadingMore(true);
      loadOlderMessages().finally(() => {
        setLoadingMore(false);
      });
    }

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    setShowScrollBtn(!isNearBottom);
  };

  // OUTSIDE CLICK TO CLOSE MENU
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuMsg) return;

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
        style={{ scrollBehavior: "auto" }}
        className="
          h-full
          overflow-y-auto
          px-6 py-4
          lg:px-25
          space-y-4
          scrollbar-none
        "
      >
        {/* EMPTY STATE */}
        {loadingMessages ? (
          <div className="animate-slide-down">
    <MessageSkeleton />
  </div>
        ) : validMessages.length === 0 ? (
          <EmptyChat userId={setuserid} />
        ) : (
          <>
            {pageLoading && <div className="animate-fade-in">
    <MessageSkeleton />
  </div>}
            {validMessages.map((msg) => {
              const senderId =
                typeof msg.sender === "object"
                  ? msg.sender._id
                  : msg.sender || msg.senderId;

              const isMe = String(senderId) === String(currentUserId);

              return (
                <MessageBubble
                  key={msg._id}
                  msg={{
                    ...msg,
                    text: msg.text || msg.message,
                  }}
                  isMe={isMe}
                  menuMsg={menuMsg}
                  setMenuMsg={setMenuMsg}
                  menuPosition={menuPosition}
                  setMenuPosition={setMenuPosition}
                  setEditMsg={setEditMsg}
                  setEditText={setEditText}
                  handleDeleteMessage={handleDeleteMessage}
                  setViewerImage={setViewerImage}
                  selectedUser={selectedUser}
                  setReplyMsg={setReplyMsg}
                  wrapperRef={wrapperRef}
                />
              );
            })}
          </>
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
          absolute bottom-5 right-[45%] bg-gray-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition z-40 flex items-center justify-center
          "
        >
          <ArrowDown size={22} />
        </button>
      )}
    </div>
  );
};

export default MessageList;