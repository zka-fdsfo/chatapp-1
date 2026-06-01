// UsersPage.jsx

import { useState, useEffect, useRef } from "react";
import { Menu, Search, Archive, Send } from "lucide-react";
import Chat from "../components/Chat";
import { createSocket } from "../Socket.IO/Socket.Io.js";
import { useAuth } from "../hook/hookauth";

export default function UsersPage() {
  const { fetchAllUsers, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const socketRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const currentUserId = user?._id || null;

  // Prevent double API calls in React Strict Mode
  const fetched = useRef(false);
  // SOCKET.IO
  // ================= SOCKET =================
  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      if (user?._id) {
        socket.emit("online-user", user._id);
      }
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);
  useEffect(() => {
    if (fetched.current) return;

    fetched.current = true;

    const loadUsers = async () => {
      try {
        const usersData = await fetchAllUsers();

        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

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
const firstLetter = [null, undefined].includes(user?.name) ? "A" : user.name.charAt(0).toUpperCase();
const bgColor = avatarColors[firstLetter] || "6366f1";
  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* SIDEBAR */}
      {/* SIDEBAR */}
      <div
        className={`
    absolute md:relative inset-y-0 left-0 z-20

    w-full md:w-[350px]
    bg-[#1f1f1f]
    border-r border-zinc-800
    flex flex-col

    transition-all
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]

    ${selectedUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"}

  `}
      >
        {/* TOP */}
        <div className="p-4 flex items-center gap-4">
          <button className="text-zinc-300 hover:text-white">
            <Menu size={24} />
          </button>

          <div className="flex-1 bg-[#2a2a2a] rounded-full px-4 py-2 flex items-center gap-3">
            <Search size={18} className="text-zinc-400" />

            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-white w-full placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* ARCHIVE */}
        {/* <div className="px-2 pb-2">

          <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#2a2a2a] cursor-pointer transition">

            <div className="w-12 h-12 rounded-full bg-zinc-300 flex items-center justify-center">
              <Archive
                size={22}
                className="text-zinc-700"
              />
            </div>

            <div>

              <h2 className="text-white font-semibold">
                Archived Chats
              </h2>

              <p className="text-zinc-400 text-sm">
                Telegram Style UI
              </p>

            </div>

          </div>
        </div> */}

        {/* LOADING */}
        {loading && (
          <div className="text-center text-zinc-400 mt-4">Loading users...</div>
        )}

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto">
          {!loading && users.length === 0 && (
            <div className="text-center text-zinc-500 mt-10">
              No users found
            </div>
          )}

          {users.map((userItem) => { 
            const firstLetter = [null, undefined].includes(userItem.name) ? "A" : userItem.name.charAt(0).toUpperCase();
            const bgColor = avatarColors[firstLetter] || "6366f1";
            return (
            <div
              key={userItem._id}
              onClick={() => setSelectedUser(userItem)}
              className={`
                flex items-center gap-3 px-4 py-3
                cursor-pointer transition
                ${
                  selectedUser?._id === userItem._id
                    ? "bg-[#5e519b] px-4 py-3 rounded-2xl text-black font-semibold"
                    : "hover:bg-[#2b2b2b]"
                }

              `}
            >
              {/* Avatar */}
              {/* <img
                src={`https://ui-avatars.com/api/?name=${userItem.name}&background=6366f1&color=fff`}
                alt={userItem.name}
                className={`w-12 h-12 rounded-full object-cover ${
                  onlineUsers.includes(userItem._id)
                    ? "border-[#00d652] border-4"
                    : "border-[#5e519b] border-2"
                }`}
              /> */}
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${userItem.name}&background=${bgColor}&color=fff`}
                  alt={userItem.name}
                  className={`w-11 h-11 md:w-12 md:h-12 rounded-full text-4xl  object-cover ${
                  onlineUsers.includes(userItem._id)
                    ? "border-[#00d652] border-"
                    : "border-[#5e519b] border-0"
                } `}
                />

                {/* ONLINE DOT */}
                {onlineUsers.includes(userItem._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-[#1b1b1b] rounded-full" />
                )}
             
              </div>
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h2 className="text-white font-semibold truncate">
                    {userItem.name}

                    {userItem._id === currentUserId && " (You)"}
                  </h2>

                  <span
                    className={`text-xs ${
                      onlineUsers.includes(userItem._id)
                        ? "text-white font-medium"
                        : "text-[#646464] font-normal"
                    }`}
                  >
                    {onlineUsers.includes(userItem._id) ? "Online" : "Offline"}
                  </span>
                </div>

                <p className="text-zinc-400 text-sm truncate">
                  {userItem.email}
                </p>
              </div>
            </div>
)})}
        </div>
      </div>

      {/* RIGHT SIDE */}
      {/* RIGHT SIDE */}
      <div
        className="
    relative
    flex-1
    h-screen
    overflow-hidden
    bg-transparent
  "
      >
        {/* ================= BACKGROUNDS ================= */}
        <div className="absolute inset-0 overflow-hidden bg-[url('https://i.pinimg.com/1200x/2a/80/d6/2a80d6b14706411e887e26b97064f3ed.jpg')] bg-cover bg-center">
          {/* BG 1 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade1"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/e1/b2/0d/e1b20d0e294cf31988a2b0430eb0e105.gif')",
            }}
          />

          {/* BG 2 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade2"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/5c/25/73/5c25734971c2c39c85b071e2966e9427.gif')",
            }}
          />

          {/* BG 3 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade3"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/b2/e4/fc/b2e4fcb625fe5b31fb96eca51e85c416.gif')",
            }}
          />

          {/* BG 4 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade4"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/33/49/39/334939188944f723f4b82c22e98b1ff8.gif')",
            }}
          />
        </div>

        {/* ================= OVERLAY ================= */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 h-full overflow-hidden">
          {/* ================= CHAT SCREEN ================= */}
          <div
            className={`
        absolute inset-0 h-full

        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          selectedUser
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }

      `}
          >
            {selectedUser && (
              <Chat
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setOnlineUsers={setOnlineUsers}
                onlineUsers={onlineUsers}
              />
            )}
          </div>

          {/* ================= DEFAULT SCREEN ================= */}
          <div
            className={`
        absolute inset-0 h-full

        flex items-center justify-center p-6

        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          selectedUser
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        }

      `}
          >
            <div className="text-center">
              <Send size={70} className="text-blue-500 mx-auto mb-4" />

              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Zello Chat App
              </h1>

              <p className="text-zinc-300 mt-3 text-sm md:text-base">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
