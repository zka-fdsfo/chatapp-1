import React from "react";
import { Reply, Pencil, Copy, Trash2, Check, CheckCheck } from "lucide-react";
import * as Linkify from "react-linkify";
import { useAuth } from "../hook/hookauth";
const MessageBubble = ({
  msg,
  isMe,
  menuMsg,
  setMenuMsg,
  setEditMsg,
  setEditText,
  handleDeleteMessage,
  setViewerImage,
  selectedUser,
}) => {
  const { currentusernameimg } = useAuth();

  // FORMAT TIME
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex ${
        isMe ? "justify-end" : "justify-start"
      } relative mb-1 px-2`}
    >
      {/* MESSAGE WRAPPER */}

      <div
        className={`relative max-w-[82%] md:max-w-107.5 ${msg.image && !msg.text ? "mb-2" : "mb-7"}`}
      >
        {/* MESSAGE BUBBLE */}
        <div
          onClick={(e) => {
            e.stopPropagation();

            setMenuMsg(menuMsg === msg._id ? null : msg._id);
          }}
          className={`
            relative group
            rounded-2xl flex gap-2
            cursor-pointer
            transition-all duration-200
            ${
              isMe
                ? "bg-[#6457a5] hover:bg-[#a494ff] text-white rounded-br-md pl-2"
                : "bg-[#313030] hover:bg-[#181818] text-white rounded-bl-md pr-2"
            }

           ${msg.image ? "flex-col" : ""}
  ${msg.image && msg.text ? "p-2" : msg.image ? "p-[0.4vw]" : "px-3 pt-2 pb-2"}
           
          `}
        >
          {/* MESSAGE TEXT */}
          {/* <div className="text-[15px] leading-relaxed font-medium break-words whitespace-pre-wrap overflow-hidden max-w-full">
            {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
              const isLink = /https?:\/\/[^\s]+/.test(part);

              return isLink ? (
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
              );
            })}
          </div> */}
          {/* MESSAGE CONTENT */}
          <div className="flex flex-col gap-2 max-w-full">
            {/* IMAGE */}
            {msg.image && (
              <img
                src={msg.image}
                alt="message"
                className="
        max-w-70
        max-h-87.5
        rounded-xl
        object-cover
        cursor-pointer
      "
                onClick={(e) => {
                  e.stopPropagation(); // Prevent menu opening

                  setViewerImage({
                    name: isMe ? currentusernameimg?.name : selectedUser?.name,
                    avatar: isMe
                      ? currentusernameimg?.avatar
                      : selectedUser?.avatar,
                    image: msg?.image,
                    createdAt: msg?.createdAt,
                  });
                }}
              />
            )}

            {/* TEXT */}
            {msg.text && (
              <div className="text-[15px] leading-relaxed font-medium wrap-break-word whitespace-pre-wrap overflow-hidden max-w-full ml-2">
                {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                  const isLink = /https?:\/\/[^\s]+/.test(part);

                  return isLink ? (
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
                  );
                })}
              </div>
            )}
          </div>

          {/* TIME + TICKS */}
          <div
            className={`
    flex items-end gap-1
    text-[11px]
    self-end
    whitespace-nowrap
    text-white
    ${
      msg.image && !msg.text
        ? "absolute bottom-3 right-3 bg-[#00000063] px-3 py-1 rounded-[20px]"
        : ""
    }

  `}
          >
            <span>{formatTime(msg.createdAt)}</span>
            {isMe && (
              <span className={msg.seen ? "text-sky-400" : "text-white/50"}>
                  {msg.seen ? <CheckCheck size={16} /> : <Check size={16} />}
              </span>
            )}
          </div>

          {/* MESSAGE TAIL */}
          <svg
            viewBox="0 0 11 20"
            width="11"
            height="20"
            className={`
              absolute
              -z-10  transition-colors duration-150
  will-change-transform
              ${
                isMe
                  ? "-right-1.5 text-[#6457a5] group-hover:text-[#a494ff] scale-x-[-1] rotate-329 -bottom-1.75"
                  : "-left-1.5 text-[#313030] group-hover:text-[#181818] rotate-45 -bottom-1.75"
              }

            `}
          >
            <path
              d="M11 0C11 0 11 7 11 10C11 13 2 19 0 20C4 15 4 10 4 10C4 10 4 5 0 0H11Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* POPUP MENU */}
        {menuMsg === msg._id && (
          <div
            className={`
              absolute z-50 
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
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(msg.text);
                } catch {
                  const textArea = document.createElement("textarea");
                  textArea.value = msg.text;
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textArea);
                }

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
};

export default MessageBubble;
