import React from "react";
import { ChevronLeft } from "lucide-react";

const ChatHeader = ({
  selectedUser,
  setSelectedUser,
  onlineUsers,
  onOpenProfile,
  lastMessage,
}) => {
  const isOnline = onlineUsers?.includes(selectedUser?._id);
  const avatarColors = {
    A: "ef4444",
    B: "f97316",
    C: "eab308",
    D: "22c55e",
    E: "06b6d4",
    F: "3b82f6",
    G: "6366f1",
    H: "8b5cf6",
    I: "d946ef",
    J: "ec4899",
    K: "14b8a6",
    L: "84cc16",
    M: "f59e0b",
    N: "ef4444",
    O: "10b981",
    P: "0ea5e9",
    Q: "8b5cf6",
    R: "a855f7",
    S: "f43f5e",
    T: "f97316",
    U: "22c55e",
    V: "06b6d4",
    W: "3b82f6",
    X: "6366f1",
    Y: "8b5cf6",
    Z: "0092ff",
  };
  const formatLastSeen = (dateString) => {
    if (!dateString) return "Offline";

    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const firstLetter = [null, undefined].includes(selectedUser?.name)
    ? "A"
    : selectedUser.name.charAt(0).toUpperCase();
  const bgColor = avatarColors[firstLetter] || "6366f1";
  return (
    <div className="h-[70px] md:h-[80px] bg-[#1b1b1b44] backdrop-blur-md px-4 md:px-6 flex items-center gap-3 border-b border-white/5">
      {/* BACK BUTTON MOBILE */}
      <button
        onClick={() => setSelectedUser(null)}
        className="md:hidden text-white text-2xl"
      >
        <ChevronLeft size={28} />
      </button>

      {/* USER AVATAR */}
      <div className="relative cursor-pointer" onClick={onOpenProfile}>
        <img
          src={
            selectedUser.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              selectedUser.name,
            )}&background=${bgColor}&color=fff`
          }

          alt={selectedUser.name}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full border-indigo-500 object-cover"
        />

        {/* ONLINE DOT */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-[#1b1b1b] rounded-full" />
        )}
      </div>

      {/* USER INFO */}
      <div className="flex flex-col">
        <h1
          onClick={onOpenProfile}
          className="text-white font-semibold text-base md:text-lg cursor-pointer"
        >
          {selectedUser?.name}
        </h1>
        <p
          className={`text-xs md:text-sm ${
            isOnline ? "text-white font-medium" : "text-white/50"
          }`}
        >
          {isOnline
            ? "Online"
            : lastMessage
              ? `Last seen ${formatLastSeen(lastMessage)}`
              : "Offline"}
        </p>
        {/* <p className={`text-xs md:text-sm ${isOnline ? "text-white font-medium" : "text-white/50"}`}>
          {isOnline ? "Online" : lastMessage ? `Last seen: ${new Date(lastMessage).toLocaleString()}` : "Offline"}
        </p> */}
      </div>
    </div>
  );
};

export default ChatHeader;
