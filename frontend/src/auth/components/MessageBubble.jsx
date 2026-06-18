import React, { useState, useRef } from "react";
import { Reply, Pencil, Copy, Trash2, Check, CheckCheck } from "lucide-react";
import { useAuth } from "../hook/hookauth";

// Characters shown before "Read more" appears
const PREVIEW_CHAR_LIMIT = 300;

const MessageBubble = ({
  msg,
  isMe,
  menuMsg,
  setMenuMsg,
  menuPosition,
  setMenuPosition,
  setEditMsg,
  setEditText,
  handleDeleteMessage,
  setViewerImage,
  selectedUser,
  wrapperRef,
  setReplyMsg,
}) => {
  const { currentusernameimg, user } = useAuth();
  const currentUserId = user?._id ? String(user._id) : "";
const longPressTimer = useRef(null);
  // ── Read-more state ──────────────────────────────────────────────────────────
  const [expanded, setExpanded] = useState(false);
  const isLong = (msg.text || "").length > PREVIEW_CHAR_LIMIT;
  const displayText =
    isLong && !expanded
      ? msg.text.slice(0, PREVIEW_CHAR_LIMIT) + "…"
      : msg.text;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const isShortText = (msg.text || "").length <= 15;

  /** Render plain text with clickable links */
  const renderText = (text) =>
    (text || "").split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      /https?:\/\/[^\s]+/.test(part) ? (
        <a
          key={`link-${i}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline break-all"
        >
          {part}
        </a>
      ) : (
        <React.Fragment key={`text-${i}`}>{part}</React.Fragment>
      )
    );

  // ── Time + ticks row — always its own bottom row, pushed right ───────────────
  const TimeRow = () => (
    <div className="flex justify-end items-center gap-1 mt-0.5">
      <span className="text-[11px] text-white/70 whitespace-nowrap">
        {formatTime(msg.createdAt)}
      </span>
      {isMe && (
        <span className={msg.seen ? "text-sky-400" : "text-white/50"}>
          {msg.seen ? <CheckCheck size={15} /> : <Check size={15} />}
        </span>
      )}
    </div>
  );

  // ── Bubble click → context menu ──────────────────────────────────────────────
const handleBubbleClick = (e) => {
  e.stopPropagation();

  const bubbleRect = e.currentTarget.getBoundingClientRect();

  // Exact click position relative to bubble
  const x = e.clientX - bubbleRect.left;
  const y = e.clientY - bubbleRect.top;

  setMenuPosition({ x, y });
  setMenuMsg(menuMsg === msg._id ? null : msg._id);
};

  // ── Shared bubble base classes ───────────────────────────────────────────────
  const bubbleBase = `
    relative group flex flex-col
    cursor-pointer rounded-2xl
    transition-all duration-200
    ${isMe
      ? "bg-[#6457a5] hover:bg-[#2b2549] text-white rounded-br-md"
      : "bg-[#313030] hover:bg-[#181818] text-white rounded-bl-md"
    }
  `;
const startLongPress = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();

  let clientX;
  let clientY;

  if (e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  longPressTimer.current = setTimeout(() => {
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setMenuPosition({ x, y });
    setMenuMsg(msg._id);
  }, 500);
};

const cancelLongPress = () => {
  if (longPressTimer.current) {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  }
};


  // ── Tail SVG ─────────────────────────────────────────────────────────────────
  const Tail = () => (
    <svg
      viewBox="0 0 11 20"
      width="11"
      height="20"
      className={`
        absolute -z-10 transition-colors duration-150 will-change-transform
        ${isMe
          ? "-right-1.5 text-[#6457a5] group-hover:text-[#2b2549] scale-x-[-1] rotate-329 -bottom-1.75"
          : "-left-1.5 text-[#313030] group-hover:text-[#181818] rotate-45 -bottom-1.75"
        }
      `}
    >
      <path
        d="M11 0C11 0 11 7 11 10C11 13 2 19 0 20C4 15 4 10 4 10C4 10 4 5 0 0H11Z"
        fill="currentColor"
      />
    </svg>
  );

  // ── Context menu ─────────────────────────────────────────────────────────────
  const ContextMenu = () =>
    menuMsg === msg._id ? (
      <div
  data-menu
  style={{
    position: "absolute",
    left: `${menuPosition.x}px`,
    top: `${menuPosition.y}px`,
  }}
  className="z-[9999] w-52 overflow-hidden rounded-2xl bg-[#1f1f1f] border border-[#ffffff10] shadow-2xl backdrop-blur-xl font-medium animate-popup"
>
        <button
          onClick={() => { setReplyMsg(msg); setMenuMsg(null); }}
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#2b2b2b] text-white text-sm transition"
        >
          <Reply size={18} strokeWidth={2.2} /> Reply
        </button>
        {isMe && (
          <button
            onClick={() => { setEditMsg(msg); setEditText(msg.text); setMenuMsg(null); }}
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#2b2b2b] text-white text-sm transition"
          >
            <Pencil size={18} strokeWidth={2.2} /> Edit
          </button>
        )}
        <button
          onClick={async () => {
            try { await navigator.clipboard.writeText(msg.text); }
            catch {
              const ta = document.createElement("textarea");
              ta.value = msg.text;
              document.body.appendChild(ta); ta.select();
              document.execCommand("copy"); document.body.removeChild(ta);
            }
            setMenuMsg(null);
          }}
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#2b2b2b] text-white text-sm transition"
        >
          <Copy size={18} strokeWidth={2.2} /> Copy
        </button>
        {isMe && (
          <button
            onClick={() => { handleDeleteMessage(msg._id); setMenuMsg(null); }}
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#2b2b2b] text-red-500 text-sm transition"
          >
            <Trash2 size={18} strokeWidth={2.2} /> Delete
          </button>
        )}
      </div>
    ) : null;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} relative mb-1 px-2`}>
      <div
        data-message
        className="relative max-w-[82%] md:max-w-[430px] mb-7"
      >
        {/* ── IMAGE-ONLY bubble ─────────────────────────────────────────────── */}
        {msg.image && !msg.text && (
          <div   onMouseDown={startLongPress}
  onMouseUp={cancelLongPress}
  onMouseLeave={cancelLongPress}
  onTouchStart={startLongPress}
  onTouchEnd={cancelLongPress}
  onContextMenu={(e) => e.preventDefault()} className={`${bubbleBase} p-[0.4vw]`}>
            <div className="relative">
              <img
                src={msg.image}
                alt="message"
                className="max-w-[280px] max-h-[350px] rounded-xl object-cover cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewerImage({
                    name: isMe ? currentusernameimg?.name : selectedUser?.name,
                    avatar: isMe ? currentusernameimg?.avatar : selectedUser?.avatar,
                    image: msg?.image,
                    createdAt: msg?.createdAt,
                  });
                }}
              />
              {/* Time overlaid on image */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full">
                <span className="text-[11px] text-white whitespace-nowrap">
                  {formatTime(msg.createdAt)}
                </span>
                {isMe && (
                  <span className={msg.seen ? "text-sky-400" : "text-white/60"}>
                    {msg.seen ? <CheckCheck size={14} /> : <Check size={14} />}
                  </span>
                )}
              </div>
            </div>
            <Tail />
          </div>
        )}

        {/* ── IMAGE + TEXT bubble ───────────────────────────────────────────── */}
        {msg.image && msg.text && (
          <div   onMouseDown={startLongPress}
  onMouseUp={cancelLongPress}
  onMouseLeave={cancelLongPress}
  onTouchStart={startLongPress}
  onTouchEnd={cancelLongPress}
  onContextMenu={(e) => e.preventDefault()} className={`${bubbleBase} p-2 gap-1`}>
            {/* Reply preview */}
            {msg.replyTo && (
              <div className="mb-1 p-2 bg-black/20 border-l-2 border-purple-400 rounded-md text-xs text-white/70">
                <p className="text-purple-300">
                  Replying to {String(msg.replyTo.sender) === String(currentUserId) ? "You" : "User"}
                </p>
                <p className="truncate">{msg.replyTo.text || "Image"}</p>
              </div>
            )}
            <img
              src={msg.image}
              alt="message"
              className="w-auto max-h-[350px] rounded-xl object-cover cursor-pointer mb-2 w-full"
              onClick={(e) => {
                e.stopPropagation();
                setViewerImage({
                  name: isMe ? currentusernameimg?.name : selectedUser?.name,
                  avatar: isMe ? currentusernameimg?.avatar : selectedUser?.avatar,
                  image: msg?.image,
                  createdAt: msg?.createdAt,
                });
              }}
            />
            <div
              className={`text-[15px] leading-relaxed font-medium break-words whitespace-pre-wrap overflow-hidden max-w-full px-1 ${msg.deleted ? "italic text-white/40 opacity-70" : "text-white"
                }`}
            >
              {renderText(displayText)}
            </div>
            {isLong && !msg.deleted && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((p) => !p); }}
                className="self-start text-[13px] font-semibold text-[#c3c3c3] hover:text-[#c3c3c3] transition-colors px-1"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
            {/* Time — own row, right-aligned */}
            <TimeRow />
            <Tail />
          </div>
        )}

        {/* ── TEXT-ONLY bubble ──────────────────────────────────────────────── */}
        {!msg.image && (
          <div   onMouseDown={startLongPress}
  onMouseUp={cancelLongPress}
  onMouseLeave={cancelLongPress}
  onTouchStart={startLongPress}
  onTouchEnd={cancelLongPress}
  onContextMenu={(e) => e.preventDefault()} className={`${bubbleBase} px-3 pt-2 pb-1.5`}>
            {/* Reply preview */}
            {msg.replyTo && (
              <div className="mb-1 p-2 bg-black/20 border-l-2 border-purple-400 rounded-md text-xs text-white/70">
                <p className="text-purple-300">
                  Replying to {String(msg.replyTo.sender) === String(currentUserId) ? "You" : "User"}
                </p>
                <p className="truncate">{msg.replyTo.text || "Image"}</p>
              </div>
            )}

            {/* Text content */}
          {msg.text && (
  <div
    className={
      isShortText
        ? "flex flex-row justify-around gap-2"
        : "flex flex-col"
    }
  >
    <div
      className={`text-[15px] leading-relaxed font-medium break-words whitespace-pre-wrap overflow-hidden max-w-full ${
        msg.deleted ? "italic text-white/40 opacity-70" : "text-white"
      }`}
    >
      {renderText(displayText)}
    </div>

    {isShortText && (
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[11px] text-white/70 whitespace-nowrap">
          {formatTime(msg.createdAt)}
        </span>

        {isMe && (
          <span className={msg.seen ? "text-sky-400" : "text-white/50"}>
            {msg.seen ? <CheckCheck size={15} /> : <Check size={15} />}
          </span>
        )}
      </div>
    )}
  </div>
)}

            {/* Read more / Show less */}
            {isLong && !msg.deleted && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((p) => !p); }}
                className="self-start text-[13px] font-semibold text-[#c3c3c3] hover:text-[#c3c3c3] transition-colors mt-0.5 ml-4"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}

            {/* Time — always its own row, right-aligned */}
   
{!isShortText && <TimeRow />}

            <Tail />
          </div>
        )}

        <ContextMenu />
      </div>
    </div>
  );
};

export default MessageBubble;