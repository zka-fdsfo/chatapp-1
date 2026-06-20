import React, { useState, useRef } from "react";
import {
  Reply,
  Pencil,
  Copy,
  Trash2,
  Check,
  CheckCheck,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../hook/hookauth";

const PREVIEW_CHAR_LIMIT = 300;
const MENU_WIDTH = 208;
const MENU_HEIGHT = 180;

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
  const bubbleRef = useRef(null);

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
      ),
    );

  // ── Scroll to replied message and flash-highlight it ─────────────────────────
  const handleReplyClick = (e) => {
    e.stopPropagation();
    if (!msg.replyTo?._id) return;
    const target = document.getElementById(`msg-${msg.replyTo._id}`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("msg-highlight");
    setTimeout(() => target.classList.remove("msg-highlight"), 1800);
  };

  // ── Clamp menu so it never overflows the bubble ───────────────────────────────
  const openMenu = (clientX, clientY) => {
    const el = bubbleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;
    if (x + MENU_WIDTH > rect.width) x = rect.width - MENU_WIDTH;
    if (x < 0) x = 0;
    if (y + MENU_HEIGHT > rect.height) y = rect.height - MENU_HEIGHT;
    if (y < 0) y = 0;
    setMenuPosition({ x, y });
    setMenuMsg(menuMsg === msg._id ? null : msg._id);
  };

  // ── Desktop: right-click ─────────────────────────────────────────────────────
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu(e.clientX, e.clientY);
  };

  // ── Mobile: tap tracking ──────────────────────────────────────────────────────
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches?.[0])
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches?.[0];
    if (!touch) return;
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    if (dx < 8 && dy < 8) {
      e.preventDefault();
      openMenu(touch.clientX, touch.clientY);
    }

    touchStartRef.current = null;
  };

  // ── Block touch events on interactive children (image, reply preview) ─────────
  // Without this, tapping these elements bubbles up to the bubble's onTouchEnd
  // and incorrectly opens the context menu on mobile.
  const handleChildTouchStart = (e) => {
    touchStartRef.current = null; // clear so touchEnd has nothing to act on
  };

  const handleChildTouchEnd = (e) => {
    e.stopPropagation(); // prevent bubble's onTouchEnd from firing
    touchStartRef.current = null;
  };

  // ── ChevronDown button (image bubbles) ──────────────────────────────────────
  const handleChevronClick = (e) => {
    e.stopPropagation();
    const el = bubbleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let x = rect.width - MENU_WIDTH - 8;
    if (x < 0) x = 0;
    setMenuPosition({ x, y: 36 });
    setMenuMsg(menuMsg === msg._id ? null : msg._id);
  };

  // ── Shared event props for the bubble wrapper ────────────────────────────────
  const bubbleEvents = {
    onContextMenu: handleContextMenu,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };

  // Spread onto any child element that should NOT open the menu when tapped
  const childTouchEvents = {
    onTouchStart: handleChildTouchStart,
    onTouchEnd: handleChildTouchEnd,
  };

  const bubbleBase = `
    relative group flex flex-col cursor-pointer rounded-2xl transition-all duration-200
    ${
      isMe
        ? "bg-[#6457a5] hover:bg-[#2b2549] text-white rounded-br-md"
        : "bg-[#313030] hover:bg-[#181818] text-white rounded-bl-md"
    }

  `;

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

  const Tail = () => (
    <svg
      viewBox="0 0 11 20"
      width="11"
      height="20"
      className={`absolute -z-10 transition-colors duration-150 will-change-transform
        ${
          isMe
            ? "-right-1.5 text-[#6457a5] group-hover:text-[#2b2549] scale-x-[-1] rotate-329 -bottom-1.75"
            : "-left-1.5 text-[#313030] group-hover:text-[#181818] rotate-45 -bottom-1.75"
        }`}
    >
      <path
        d="M11 0C11 0 11 7 11 10C11 13 2 19 0 20C4 15 4 10 4 10C4 10 4 5 0 0H11Z"
        fill="currentColor"
      />
    </svg>
  );

  const ReplyPreview = () =>
    msg.replyTo ? (
      <div
        onClick={handleReplyClick}
        {...childTouchEvents}
        className="mb-1 p-2 bg-black/20 border-l-2 border-purple-400 rounded-md text-xs cursor-pointer hover:bg-black/30 active:scale-[0.98] transition-all select-none"
      >
        <p className="text-purple-300 font-semibold text-[11px] mb-0.5">
          {String(msg.replyTo.sender) === String(currentUserId) ? (
            <><Reply size={12} className="inline mr-1" />You</>
          ) : (
            <><Reply size={12} className="inline mr-1" />{selectedUser?.name || "User"}</>
          )}
        </p>
        <p className="truncate text-white/60">
          {msg.replyTo.text || (msg.replyTo.image ? "📷 Photo" : "Message")}
        </p>
      </div>
    ) : null;

  const ContextMenu = () =>
    menuMsg === msg._id ? (
      <div
        data-menu
        style={{
          position: "absolute",
          left: `${isMe ? menuPosition.x - 90 : menuPosition.x}px`,
          top: `${menuPosition.y}px`,
        }}
        className="z-[50] w-52 overflow-hidden rounded-2xl bg-[#1f1f1f] border border-[#ffffff10] shadow-2xl backdrop-blur-xl font-medium animate-popup"
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

  return (
    <div
      id={`msg-${msg._id}`}
      className={`flex ${isMe ? "justify-end" : "justify-start"} relative mb-1 px-2`}
    >
      <div
        data-message
        ref={bubbleRef}
        className="relative max-w-[82%] md:max-w-[430px] mb-7"
      >
        {/* IMAGE-ONLY */}
        {msg.image && !msg.text && (
          <div {...bubbleEvents} className={`${bubbleBase} p-[0.4vw]`}>
            <button
              onClick={handleChevronClick}
              className="absolute top-2 right-2 z-[5] bg-black/50 text-white p-1 rounded-full"
            >
              <ChevronDown size={18} />
            </button>
            <ReplyPreview />
            <div className="relative">
              <img
                src={msg.image}
                alt="message"
                className="max-w-[280px] max-h-[350px] rounded-xl object-cover cursor-pointer"
                {...childTouchEvents}
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

        {/* IMAGE + TEXT */}
        {msg.image && msg.text && (
          <div {...bubbleEvents} className={`${bubbleBase} p-2 gap-1`}>
            <button
              onClick={handleChevronClick}
              className="absolute top-2 right-2 z-[5] bg-black/5 text-white p-1 rounded-full"
            >
              <ChevronDown size={18} />
            </button>
            <ReplyPreview />
            <img
              src={msg.image}
              alt="message"
              className="w-full max-h-[350px] rounded-xl object-cover cursor-pointer mb-2"
              {...childTouchEvents}
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
              className={`text-[15px] leading-relaxed font-medium break-words whitespace-pre-wrap overflow-hidden max-w-full px-1 ${msg.deleted ? "italic text-white/40 opacity-70" : "text-white"}`}
            >
              {renderText(displayText)}
            </div>
            {isLong && !msg.deleted && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((p) => !p); }}
                className="self-start text-[13px] font-semibold text-[#c3c3c3] transition-colors px-1"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
            <TimeRow />
            <Tail />
          </div>
        )}

        {/* TEXT-ONLY */}
        {!msg.image && (
          <div {...bubbleEvents} className={`${bubbleBase} px-3 pt-2 pb-1.5`}>
            <ReplyPreview />
            {msg.text && (
              <div className={isShortText ? "flex flex-row justify-between gap-2" : "flex flex-col"}>
                <div
                  className={`text-[15px] leading-relaxed font-medium break-words whitespace-pre-wrap overflow-hidden max-w-full ${msg.deleted ? "italic text-white/40 opacity-70" : "text-white"}`}
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
            {isLong && !msg.deleted && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((p) => !p); }}
                className="self-start text-[13px] font-semibold text-[#c3c3c3] transition-colors mt-0.5 ml-4"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
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