import React from "react";

const BubbleSkeleton = ({ isMe,width, hasImage }) => {
  const bg = isMe ? "#6457a5" : "#313030";

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} relative mb-1 px-2`}
    >
      <div className={`relative max-w-[92%] md:max-w-[830px] ${hasImage ? "mb-2" : "mb-7"}`}>

        <div
          className={`
    relative group animate-pulse
    rounded-2xl
            ${isMe ? "rounded-br-md" : "rounded-bl-md"}
            ${hasImage ? "p-[0.4vw]" : "px-3 pt-2 pb-2"}
          `}
          style={{ backgroundColor: bg }}
        >
          {/* SHIMMER OVERLAY */}
          <div
            className="absolute inset-0 rounded-2xl animate-shimmer pointer-events-none z-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
              backgroundSize: "600px 100%",
            }}
          />

          {hasImage ? (
            <div className="w-[220px] h-[140px] rounded-xl bg-white/10" />
          ) : (
            <div className={`flex flex-col gap-2 py-0.5 ${width}`}>
              <div className="h-3.5 w-[85%] rounded-full bg-white/25" />
              {width === "h-14" && (
                <div className="h-3.5 w-[60%] rounded-full bg-white/25" />
              )}
            </div>
          )}

          {/* TIME + TICKS */}
          <div
            className={`flex items-end gap-1 ${
              hasImage
                ? "absolute bottom-3 right-3 bg-[#00000063] px-3 py-1 rounded-[20px]"
                : "mt-1"
            }`}
          >
            <div className="h-2.5 w-10 rounded-full bg-white/20" />
            {isMe && <div className="h-2.5 w-4 rounded-full bg-white/20" />}
          </div>

          {/* TAIL */}
       <svg
  viewBox="0 0 11 20"
  width="11"
  height="20"
  style={{
    color: bg,
    opacity: 0.8,
  }}
  className={`
    absolute animate-shimmer
    ${
      isMe
        ? "-right-[6px] scale-x-[-1] rotate-[329deg] bottom-[-7px]"
        : "-left-[6px] rotate-45 bottom-[-7px]"
    }
  `}
>
            <path
              d="M11 0C11 0 11 7 11 10C11 13 2 19 0 20C4 15 4 10 4 10C4 10 4 5 0 0H11Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const MessageSkeleton = () => {
const rows = [
  { isMe: false, width: "w-[180px]", hasImage: false },
  { isMe: true,  width: "w-[160px]", hasImage: false },
  { isMe: false, width: "w-[220px]", hasImage: true  },
  { isMe: true,  width: "w-[120px]", hasImage: false },
  { isMe: false, width: "w-[140px]", hasImage: false },
  { isMe: true,  width: "w-[100px]", hasImage: false },
  { isMe: false, width: "w-[180px]", hasImage: false },
];

  return (
    <>
      {rows.map((row, i) => (
        <BubbleSkeleton key={i} {...row} />
      ))}
    </>
  );
};

export default MessageSkeleton;