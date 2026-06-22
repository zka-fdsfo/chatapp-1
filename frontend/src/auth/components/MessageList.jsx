import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const prevHeightRef = useRef(0);
  const initialLoadRef = useRef(true);

  const validMessages = messages.filter(
    (msg) => msg && (msg.text || msg.message || msg.image)
  );

  // ✅ Reset initialLoadRef every time the conversation changes
  // so the first batch of messages always scrolls to the bottom
  useEffect(() => {
    initialLoadRef.current = true;
  }, [setuserid]);

  // ✅ useLayoutEffect fires BEFORE the browser paints — no visible jump
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // OLDER MESSAGES LOADED — restore scroll position without jumping
    if (prevHeightRef.current) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevHeightRef.current;
      prevHeightRef.current = 0;
      return;
    }

    // FIRST LOAD or conversation switch — jump straight to bottom
    if (initialLoadRef.current && !loadingMessages) {
      initialLoadRef.current = false;
      el.scrollTop = el.scrollHeight;
      return;
    }

    // NEW MESSAGE SENT/RECEIVED — only auto-scroll if already near bottom
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 150;

    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loadingMessages]);

  const handleScroll = (e) => {
    const el = e.target;

    // Load older messages when reaching top
    if (el.scrollTop < 10 && !loadingMore) {
      // Capture height SYNCHRONOUSLY before the async load changes the DOM
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuMsg) return;
      const isInsideMessage = e.target.closest("[data-message]");
      const isInsideMenu = e.target.closest("[data-menu]");
      if (!isInsideMessage && !isInsideMenu) setMenuMsg(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuMsg]);

  return (
    <div ref={wrapperRef} className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ scrollBehavior: "auto", overflowAnchor: "none" }}
        className="h-full overflow-y-auto px-6 py-4 lg:px-25 space-y-4 scrollbar-none"
      >
        {loadingMessages ? (
          <MessageSkeleton />
        ) : validMessages.length === 0 ? (
          <EmptyChat userId={setuserid} />
        ) : (
          <>
            {loadingMore && (
              <div className="flex justify-center py-2">
                <div className="w-5 h-5 rounded-full border-2 border-zinc-200 border-t-transparent animate-spin" />
              </div>
            )}

            {validMessages.map((msg) => {
              const senderId =
                typeof msg.sender === "object"
                  ? msg.sender._id
                  : msg.sender || msg.senderId;

              const isMe = String(senderId) === String(currentUserId);

              return (
                <MessageBubble
                  key={msg._id}
                  msg={{ ...msg, text: msg.text || msg.message }}
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

        <div ref={bottomRef} />
      </div>

      {showScrollBtn && (
        <button
          onClick={() =>
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          }

          className="absolute bottom-5 right-[45%] bg-gray-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition z-40 flex items-center justify-center"
        >
          <ArrowDown size={22} />
        </button>
      )}
    </div>
  );
};

export default MessageList;