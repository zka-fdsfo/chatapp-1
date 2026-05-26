import React from "react";

import { useState, useEffect, useRef } from "react";
import { Menu, Search, Archive, Send } from "lucide-react";
import { Reply, Pencil, Copy, Trash2 } from "lucide-react";
import Linkify from "react-linkify";
import { useMessage } from "../hook/massage.hook.js";
import { useAuth } from "../hook/hookauth.js";
const Chat = ({ selectedUser, setSelectedUser }) => {
  const { messages, fetchMessages, handleSendMessage, handleDeleteMessage } =
    useMessage();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");

  const [menuMsg, setMenuMsg] = useState(null);

  const [editMsg, setEditMsg] = useState(null);

  const [editText, setEditText] = useState("");
  const currentUserId = user?._id;
  // FETCH MESSAGES
  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // FORMAT TIME
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  // console.log(selectedUser)
  return (
    <div className="flex flex-col h-full">
      {/* CHAT HEADER */}
      <div className="h-[70px] md:h-[80px]  bg-[#1b1b1b44] backdrop-blur-md px-4 md:px-6 flex items-center gap-3">
        {/* BACK BUTTON MOBILE */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden text-white text-2xl"
        >
          ←
        </button>

        {/* Avatar */}
        <img
          src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=6366f1&color=fff`}
          alt={selectedUser.name}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-indigo-500"
        />

        {/* Info */}
        <div>
          <h1 className="text-white font-semibold text-base md:text-lg">
            {selectedUser.name}
          </h1>

          <p className="text-green-400 text-xs md:text-sm">Online</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        className="
    flex-1
    min-h-0
    overflow-y-auto
    px-6 py-4
    space-y-4
  "
      >
        {/* ================= NO MESSAGE ================= */}
        {messages.filter((msg) => msg && msg.text && msg.text.trim() !== "")
          .length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="text-center animate-fadeIn backdrop-blur-md bg-[#a700b644] p-6 rounded-xl">
              <img
                src="https://i.pinimg.com/originals/78/5f/ce/785fce6734c7285c7ab99f871c732158.gif"
                alt="No Messages"
                className="w-48 md:w-60 mx-auto opacity-90"
              />

              <h2 className="text-white text-2xl font-bold mt-5">
                No Messages Yet
              </h2>

              <p className="text-zinc-400 text-sm mt-2">
                Start chatting and make the first move 🚀
              </p>
            </div>
          </div>
        ) : (
          messages
            .filter((msg) => msg && msg.text && msg.text.trim() !== "")
            .map((msg) => {
              const senderId =
                typeof msg.sender === "object" ? msg.sender._id : msg.sender;

              const isMe = senderId === currentUserId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  } relative mb-1 px-2`}
                >
                  {/* ================= MESSAGE WRAPPER ================= */}
                  <div className="relative max-w-[82%] md:max-w-[430px]">
                    {/* ================= MESSAGE BUBBLE ================= */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();

                        setMenuMsg(menuMsg?._id === msg._id ? null : msg);
                      }}
                      className={`
                  relative px-3 pt-2 pb-1
                  rounded-2xl flex gap-2
                  cursor-pointer
                  transition-all duration-200
                  ${
                    isMe
                      ? "bg-[#8774e1] text-white rounded-br-md p-3 pb-2"
                      : "bg-[#212121] text-white rounded-bl-md p-3 pb-2"
                  }
                `}
                    >
                      {/* MESSAGE */}
                      <p
                        className="text-[15px]
                       leading-relaxed font-medium break-words
                       break-all
    whitespace-pre-wrap

    max-w-full
    overflow-hidden"
                      >
                        {msg.text}
                      </p>

                      {/* TIME */}
                      <div
                        className={`
                    flex items-end gap-1
                    text-[11px] self-end whitespace-nowrap
                    ${isMe ? "text-white/70" : "text-zinc-400"}
                  `}
                      >
                        <span>{formatTime(msg.createdAt)}</span>

                        {isMe && (
                          <span
                            className={`
      text-[10px]
      ${msg.seen ? "text-sky-400" : "text-white/70"}
    `}
                          >
                            ✓✓
                          </span>
                        )}
                      </div>

                      {/* ================= TAIL ================= */}
                      <svg
                        viewBox="0 0 11 20"
                        width="11"
                        height="20"
                        className={`
                    absolute
                    ${
                      isMe
                        ? "-right-[6px] bottom-0 scale-x-[-1] text-[#8774e1] rotate-[329deg] top-[26px]"
                        : "-left-[6px] bottom-0 text-[#212121] rotate-43  top-[26px]"
                    }
                  `}
                      >
                        <path
                          d="M11 0C11 0 11 7 11 10C11 13 2 19 0 20C4 15 4 10 4 10C4 10 4 5 0 0H11Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>

                    {/* ================= TELEGRAM POPUP ================= */}
                    {menuMsg?._id === msg._id && (
                      <div
                        className={`
    absolute z-50 mt-2
    w-52 overflow-hidden
    rounded-2xl
    bg-[#1f1f1f]
    border border-[#ffffff10]
    shadow-2xl
    backdrop-blur-xl
    font-medium
    origin-top
    animate-popup

    ${isMe ? "right-0" : "left-0"}
  `}
                      >
                        {/* REPLY */}
                        <button
                          className="
        w-full flex items-center gap-4
        px-4 py-3
        hover:bg-[#2b2b2b]
        text-white text-sm
        transition
      "
                        >
                          <Reply size={18} strokeWidth={2.2} />
                          Reply
                        </button>

                        {/* EDIT */}
                        {isMe && (
                          <button
                            onClick={() => {
                              setEditMsg(msg);
                              setEditText(msg.text);
                              setMenuMsg(null);
                            }}
                            className="
          w-full flex items-center gap-4
          px-4 py-3
          hover:bg-[#2b2b2b]
          text-white text-sm
          transition
        "
                          >
                            <Pencil size={18} strokeWidth={2.2} />
                            Edit
                          </button>
                        )}

                        {/* COPY */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            setMenuMsg(null);
                          }}
                          className="
        w-full flex items-center gap-4
        px-4 py-3
        hover:bg-[#2b2b2b]
        text-white text-sm
        transition
      "
                        >
                          <Copy size={18} strokeWidth={2.2} />
                          Copy
                        </button>

                        {/* DELETE */}
                        {isMe && (
                          <button
                            onClick={() => {
                              handleDeleteMessage(msg._id);
                              setMenuMsg(null);
                            }}
                            className="
          w-full flex items-center gap-4
          px-4 py-3
          hover:bg-[#2b2b2b]
          text-red-500 text-sm
          transition
        "
                          >
                            <Trash2 size={18} strokeWidth={2.2} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 md:p-4 backdrop-blur-md">
        <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-full px-4 py-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(selectedUser._id, messageText);

                setMessageText("");
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

          <button
            onClick={() => {
              handleSendMessage(selectedUser._id, messageText);

              setMessageText("");
            }}
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
    </div>
  );
};

export default Chat;
