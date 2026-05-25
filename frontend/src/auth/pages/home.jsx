// UsersPage.jsx

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Archive,
  Send,
} from "lucide-react";

import { useAuth } from "../hook/hookauth";

export default function UsersPage() {
  const { fetchAllUsers, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);

  const currentUserId = user?._id || null;

  // Prevent double API calls in React Strict Mode
  const fetched = useRef(false);

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

  return (
    <div className="h-screen bg-black flex overflow-hidden">

      {/* SIDEBAR */}
      <div
        className={`
          ${selectedUser ? "hidden md:flex" : "flex"}
          w-full md:w-[350px]
          bg-[#1f1f1f]
          border-r border-zinc-800
          flex-col
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
          <div className="text-center text-zinc-400 mt-4">
            Loading users...
          </div>
        )}

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto">

          {!loading && users.length === 0 && (
            <div className="text-center text-zinc-500 mt-10">
              No users found
            </div>
          )}

          {users.map((userItem) => (

            <div
              key={userItem._id}
              onClick={() => setSelectedUser(userItem)}
              className={`
                flex items-center gap-3 px-4 py-3
                cursor-pointer transition
                ${
                  selectedUser?._id === userItem._id
                    ? "bg-[#343434]"
                    : "hover:bg-[#2b2b2b]"
                }

              `}
            >

              {/* Avatar */}
              <img
                src={`https://ui-avatars.com/api/?name=${userItem.name}&background=6366f1&color=fff`}
                alt={userItem.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />

              {/* User Info */}
              <div className="flex-1 min-w-0">

                <div className="flex justify-between items-start">

                  <h2 className="text-white font-semibold truncate">
                    {userItem.name}

                    {userItem._id === currentUserId &&
                      " (You)"}
                  </h2>

                  <span className="text-xs text-green-400">
                    Online
                  </span>

                </div>

                <p className="text-zinc-400 text-sm truncate">
                  {userItem.email}
                </p>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`
          flex-1 flex flex-col relative
          ${selectedUser ? "flex" : "hidden md:flex"}
        `}
      >

        {/* CHAT BACKGROUND */}
      {/* ANIMATED BACKGROUNDS */}
<div className="absolute inset-0 overflow-hidden">

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
        "url('https://i.pinimg.com/originals/3d/13/f0/3d13f01dc20ae47db6f6a30c604778d9.gif')",
    }}
  />

  {/* BG 4 */}
  <div
    className="absolute inset-0 bg-cover bg-center animate-fade4"
    style={{
      backgroundImage:
        "url('https://i.pinimg.com/originals/55/e8/af/55e8af23ff4e1055efd3605624dceb66.gif')",
    }}
  />

</div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col h-full">

          {selectedUser ? (
            <>
              {/* CHAT HEADER */}
              <div className="h-[70px] md:h-[80px]  bg-[#1b1b1b44] backdrop-blur-md px-4 md:px-6 flex items-center gap-3">

                {/* BACK BUTTON MOBILE */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden text-white text-2xl"
                >
                  ←
                </button>

                {/* Avatar */}
                <img
                  src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=6366f1&color=fff`}
                  alt={selectedUser.name}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-indigo-500"
                />

                {/* Info */}
                <div>

                  <h1 className="text-white font-semibold text-base md:text-lg">
                    {selectedUser.name}
                  </h1>

                  <p className="text-green-400 text-xs md:text-sm">
                    Online
                  </p>

                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4">

                {/* MY MESSAGE */}
                <div className="flex justify-end">

                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%] md:max-w-[400px] shadow-lg">

                    Hey 👋

                  </div>

                </div>

                {/* RECEIVER MESSAGE */}
                <div className="flex justify-start">

                  <div className="bg-[#262626] text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%] md:max-w-[400px] shadow-lg">

                    Hello 🔥

                  </div>

                </div>

                {/* RECEIVER MESSAGE */}
                <div className="flex justify-start">

                  <div className="bg-[#262626] text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%] md:max-w-[400px] shadow-lg">

                    Zello UI looking clean 😎

                  </div>

                </div>

              </div>

              {/* INPUT */}
              <div className="p-3 md:p-4 backdrop-blur-md">

                <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-full px-4 py-3">

                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 pl-2 bg-transparent outline-none text-white placeholder:text-zinc-400 text-sm md:text-base"
                  />

                  <button className="text-blue-500 hover:text-blue-400 transition">

                    <Send size={22} />

                  </button>

                </div>

              </div>
            </>
          ) : (
            /* DEFAULT SCREEN */
            <div className="flex-1 flex items-center justify-center p-6">

              <div className="text-center">

                <Send
                  size={70}
                  className="text-blue-500 mx-auto mb-4"
                />

                <h1 className="text-3xl md:text-5xl font-bold text-white">

                  Zello Chat App

                </h1>

                <p className="text-zinc-300 mt-3 text-sm md:text-base">

                  Select a chat to start messaging

                </p>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}