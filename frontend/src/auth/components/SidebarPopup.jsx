import React from "react";
import {
  Plus,
  User,
  Bookmark,
  Users,
  Settings,
  MoreVertical,
} from "lucide-react";

const SidebarPopup = ({ open, onClose }) => {
  if (!open) return null;

  const menuItems = [
    { icon: Plus, text: "Add Account" },
    { icon: User, text: "My Profile" },
    { icon: Bookmark, text: "Saved Messages" },
    { icon: Users, text: "Contacts" },
    { icon: Settings, text: "Settings" },
    { icon: MoreVertical, text: "More", arrow: true },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-4 left-4 w-[300px] bg-[#1f1f1f]/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl z-50 border border-white/10">

        {/* Profile Header */}
        <div className="flex items-center gap-3 p-4">
          <img
            src="https://ui-avatars.com/api/?name=Mullick+Zaid+Khan&background=111827&color=fff"
            alt=""
            className="w-11 h-11 rounded-full"
          />

          <h2 className="font-semibold text-white text-lg">
            Mullick Zaid Khan
          </h2>
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

              {item.arrow && (
                <span className="text-gray-400 text-xl">›</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SidebarPopup;