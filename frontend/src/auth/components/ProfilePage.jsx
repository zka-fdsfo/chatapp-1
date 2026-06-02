import React, { useState } from "react";
import {
  X,
  Pencil,
  Phone,
  Bell,
  Image,
  FileText,
  Link2,
  Music,
} from "lucide-react";

const ProfilePage = ({ user: selectedUser, onClose }) => {
  const [notifications, setNotifications] = useState(true);

  const user = {
    name: selectedUser?.name || "User",
    phone: selectedUser?.phone || "+00 00000 00000",
    lastSeen: selectedUser?.lastSeen || "last seen 2 hours ago",
    avatar: selectedUser?.avatar || null,
  };
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
  // const firstLetter = user.name.charAt(0).toUpperCase();
  const firstLetter = [null, undefined].includes(selectedUser?.name)
    ? "A"
    : selectedUser.name.charAt(0).toUpperCase();
  const bgColor = avatarColors[firstLetter] || "6366f1";
  return (
    <div className="w-full h-full bg-[#0f0f0f00] text-white overflow-y-auto">
      <div className="w-full h-full  relative  bg-[#0f0f0f] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <button onClick={onClose}>
            <X size={24} />
          </button>

          <h2 className="text-xl font-bold">User Info</h2>

          <button>
            <Pencil
              size={20}
              className="text-zinc-400 hover:text-white transition"
            />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-6 py-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover "
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-bold text-white"
              style={{
                background: `#${bgColor}`,
              }}
            >
              {firstLetter}
            </div>
          )}

          <h1 className="mt-5 text-3xl font-semibold">{user.name}</h1>

          <p className="text-zinc-400 mt-1">{user.lastSeen}</p>
        </div>

        {/* Contact Card */}
        <div className="px-4 mt-4 mb-6">
          <div className="bg-[#1c1c1f] rounded-3xl p-5 space-y-6">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <Phone size={24} className="text-zinc-400" />

              <div>
                <p className="font-medium text-lg">{user.phone}</p>
                <span className="text-zinc-500 text-sm">Phone</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell size={22} className="text-zinc-400" />
                <span className="text-lg">Notifications</span>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition ${
                  notifications ? "bg-violet-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
                    notifications ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {/* <div className="px-4 mt-5 pb-5">
          <div className="bg-[#1c1c1f] rounded-full flex justify-around p-2">
            <button className="flex items-center gap-2 bg-violet-600/20 text-violet-400 px-4 py-2 rounded-full">
              <Image size={18} />
              Media
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-white">
              <FileText size={18} />
              Files
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-white">
              <Link2 size={18} />
              Links
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-white">
              <Music size={18} />
              Music
            </button>
          </div>
        </div> */}

        {/* Gallery */}
        {/* <div className="grid grid-cols-3 gap-1 p-2">
          {[
            "https://picsum.photos/300?1",
            "https://picsum.photos/300?2",
            "https://picsum.photos/300?3",
            "https://picsum.photos/300?4",
            "https://picsum.photos/300?5",
            "https://picsum.photos/300?6",
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full h-28 md:h-36 object-cover rounded-xl hover:scale-105 transition"
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
