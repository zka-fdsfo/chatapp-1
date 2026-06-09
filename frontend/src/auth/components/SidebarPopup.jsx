import React from "react";
import {
  Plus,
  User,
  Bookmark,
  Users,
  Settings,
  MoreVertical,
} from "lucide-react";

const SidebarPopup = ({ open, onClose, user, avatar, onProfileClick,closing }) => {
  if (!open) return null;
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
  const menuItems = [
    { icon: Plus, text: "Add Account" },
    { icon: User, text: "My Profile" },
    { icon: Bookmark, text: "Saved Messages" },
    { icon: Users, text: "Contacts" },
    { icon: Settings, text: "Settings" },
    { icon: MoreVertical, text: "More", arrow: true },
  ];
  const firstLetter = user?.charAt(0)?.toUpperCase() || "A";
  const bgColor = avatarColors[firstLetter] || "6366f1";
  console.log("SidebarPopup user:", user, "avatar:", avatar);
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Menu */}
      <div
        className={` scale-3d-0 scale-70 animate-scaleIn
    fixed top-[48px] left-[18px]
    w-[270px]
    bg-[#181818]/20
    backdrop-blur-3xl
    rounded-2xl
    overflow-hidden
   animate-popup
    border border-white/5
    z-50
    ${
    closing
      ? "animate-popup-close"
      : "animate-popup"
  }
  `}
      >
        {/* Profile Header */}
        <div
          onClick={onProfileClick}
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition"
        >
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user || "User",
              )}&background=${bgColor}&color=fff`
            }

            alt={user}
            className="w-11 h-11 rounded-full object-cover"
          />

          <h2 className="font-semibold text-white text-lg">{user}</h2>
        </div>

        <div className="h-px bg-white/10" />

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-4">
                <Icon size={22} className="text-gray-300" />
                <span className="font-medium">{item.text}</span>
              </div>

              {item.arrow && <span className="text-gray-400 text-xl">›</span>}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SidebarPopup;
