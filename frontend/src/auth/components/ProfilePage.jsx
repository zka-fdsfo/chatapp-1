import React, { useEffect, useState } from "react";
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
import { useMessage } from "../hook/massage.hook.js";
import { useAuth } from "../hook/hookauth.js";
const ProfilePage = ({ user: selectedUser, onClose, lastMessage,setViewerImage ,currentUserId}) => {
  const [notifications, setNotifications] = useState(true);

  const user = {
    name: selectedUser?.name || "User",
    phone: selectedUser?.phone || "+00 00000 00000",
    lastSeen: selectedUser?.lastSeen || "last seen 2 hours ago",
    avatar: selectedUser?.avatar || null,
  };
const { currentusernameimg } = useAuth();

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
  const { imageMessages, fetchImageMessages, loadingImages} = useMessage();

  useEffect(() => {
    if (selectedUser?._id) {
      fetchImageMessages(selectedUser._id);
    }
  }, [selectedUser?._id]);
 
  const formatLastSeen = (dateString) => {
    if (!dateString) return "Offline";

    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return `today at ${time}`;
    }

    if (isYesterday) {
      return `yesterday at ${time}`;
    }

    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })} at ${time}`;
  };
  // const firstLetter = user.name.charAt(0).toUpperCase();
  const firstLetter = [null, undefined].includes(selectedUser?.name)
    ? "A"
    : selectedUser.name.charAt(0).toUpperCase();
  const bgColor = avatarColors[firstLetter] || "6366f1";
  return (
    <div className="w-full h-screen bg-[#0f0f0f00] text-white overflow-y-auto custom-scrollbar">
      <div className=" relative min-h-screen bg-[#0f0f0f] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <button onClick={onClose}>
            <X size={24} />
          </button>

          <h2 className="text-xl font-bold">User Info</h2>

          <button>
      
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
          <p className="text-zinc-400 mt-1">
            {selectedUser?.isOnline
              ? "Online"
              : lastMessage
                ? `Last seen ${formatLastSeen(lastMessage)}`
                : "Offline"}
          </p>

          <p className="text-[#fff] text-center mt-2 font-bold px-4">
            {selectedUser?.bio || "Hey there! I'm using ChatApp."}
          </p>
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

        <div className="px-4 pb-4">
          <h3 className="text-lg flex gap-3.5 justify-center-safe font-semibold mb-3">Media<Image /></h3>

         <div className="grid grid-cols-3 gap-2">
  {imageMessages?.length > 0 ? (
    imageMessages.map((msg) => {
      const isMe =
        String(msg.sender || msg.senderId) === String(currentUserId);

      return (
        <img
          key={msg._id}
          src={msg.image}
          alt=""
          onClick={() => {
    //        console.log(msg);

            setViewerImage({
              name: isMe ? "You" : selectedUser?.name,
              avatar: isMe
                ? currentusernameimg.avatar || selectedUser?.avatar
                : selectedUser?.avatar,
              image: msg.image,
              createdAt: msg.createdAt,
            });
          }}
          className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition hover:scale-100 duration-300"
        />
      );
    })
  ) : (
    <p className="col-span-3 text-zinc-500 text-center py-4">
      No media files yet
    </p>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
