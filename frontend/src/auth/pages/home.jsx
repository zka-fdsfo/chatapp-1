// UsersPage.jsx

/*
 * =============================================================================
 * Home Page / Users Page - Zello Chat App
 *
 * Description:
 *   This file implements the UsersPage component which displays the sidebar
 *   user list, handles Socket.IO connection for online presence, and renders
 *   the chat panel for a selected user.
 *
 * Key behaviors:
 *   - Fetches all users once (protected against React Strict Mode double calls)
 *   - Maintains Socket.IO connection and updates `onlineUsers`
 *   - Renders user avatars, presence status, last message preview, and the Chat
 *     component when a user is selected.
 *
 * Notes / TODOs:
 *   - Consider extracting avatar generation to a utility.
 *   - Improve accessibility: add ARIA labels and keyboard navigation.
 *   - Replace inline background GIF URLs with optimized static assets.
 *
 * Author: (added by Copilot)
 * Date: 2026-06-02
 * =============================================================================
 */

import { useState, useEffect, useRef } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase.js";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Menu, Search, Archive, Send, MessageCircle } from "lucide-react";
import Chat from "../components/Chat";
import { createSocket } from "../Socket.IO/Socket.Io.js";
import { useAuth } from "../hook/hookauth";
import SidebarPopup from "../components/SidebarPopup.jsx";
import EditProfile from "../components/EditProfile.jsx";
import UserSkeleton from "../components/UsersSkeleton.jsx";
import ImageViewer from "../components/ImageViewer.jsx";
import { Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  Notificationpermission,
  unlockAudio,
} from "../util/Notificationpermission.js";
import SearchPage from "../components/SearchPage.jsx";
// Main users page component that wires together presence, notifications, and the chat layout.
export default function UsersPage() {
  const { fetchAllUsers, user } = useAuth();

  const { data: users = [], isLoading: loading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const socketRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const currentUserId = user?._id || null;
  const [showProfile, setShowProfile] = useState(false);
  const [closingProfile, setClosingProfile] = useState(false);
  const [viewerImage, setViewerImage] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const queryClient = useQueryClient();
  // Prevent double API calls in React Strict Mode
  const fetched = useRef(false);

  // Requests notification permission once when the page loads.
  useEffect(() => {
    Notificationpermission();
  }, []);

  // Keeps the Socket.IO connection synced with the current user's online presence.
  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);

      if (user?._id) {
        socket.emit("online-user", user._id);
      }
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      // console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);
  // Loads the user list once and avoids duplicate fetches in React Strict Mode.
  // useEffect(() => {
  //   if (fetched.current) return;

  //   fetched.current = true;

  //   const loadUsers = async () => {
  //     try {
  //       const usersData = await fetchAllUsers();

  //       if (Array.isArray(usersData)) {
  //         setUsers(usersData);
  //       } else {
  //         setUsers([]);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load users:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadUsers();
  // }, []);

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
  // useEffect(() => {
  //   const handleClick = async () => {
  //     try {
  //       await audio.play();

  //       audio.pause();
  //       audio.currentTime = 0;

  //       window.notificationAudio = audio;
  //     } catch (err) {
  //       console.log("❌ UNLOCK FAILED", err);
  //     }
  //   };

  //   document.addEventListener("click", handleClick, { once: true });

  //   return () => {
  //     document.removeEventListener("click", handleClick);
  //   };
  // }, []);

  // Unlocks notification audio after the first user interaction.
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudio();
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);
  // Stores the notification click handler so a foreground toast can open the matching chat.
  const handleOpenChatRef = useRef(null);
  handleOpenChatRef.current = (payload) => {
    const senderId = payload.data?.senderId;
    if (!senderId) return;
    const senderUser = users.find((u) => u._id === senderId);
    if (senderUser) setSelectedUser(senderUser);
  };

  // Listens for foreground FCM messages and shows the toast preview.
  useEffect(() => {
    if (window.__notificationRegistered) return;
    window.__notificationRegistered = true;

    const audio = new Audio("/sound/mixkit-software-interface-start-2574.wav");
    audio.preload = "auto";

    const unsubscribe = onMessage(messaging, (payload) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      // onMessage ONLY fires when tab is active/focused
      // service worker handles background — no overlap possible
      const title = payload.data?.title || "New Message";
      const body = payload.data?.body || "";
      const senderAvatar = payload.data?.senderAvatar || "";
      console.log("Working");
      audio.currentTime = 0;
      audio.play().catch(() => {});
      console.log("FCM RECEIVED", payload.messageId);
      toast.custom(() => (
        <div
          onClick={() => handleOpenChatRef.current(payload)}
          className="w-[320px] cursor-pointer bg-[#27272a] backdrop-blur-md text-white rounded-2xl shadow-2xl p-3 flex items-center gap-3 border border-white/10 mr-[40%] "
        >
          <img
            src={senderAvatar || "/default-avatar.png"}
            className="w-12 h-12 rounded-full object-cover shrink-0"
            alt="avatar"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{title}</p>
            <p className="text-gray-300 text-sm truncate">{body}</p>
            <p className="text-blue-400 text-xs mt-1">Tap to open chat</p>
          </div>
        </div>
      ));
    });

    return () => {
      unsubscribe();
      // ❌ do NOT reset window.__notificationRegistered here
    };
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const [closingMenu, setClosingMenu] = useState(false);
  // Closes the profile drawer with its exit animation.
  const closeProfile = () => {
    setClosingProfile(true);

    setTimeout(() => {
      setShowProfile(false);
      setClosingProfile(false);
    }, 350);
  };

  // Closes the sidebar popup with its exit animation.
  const closeMenu = () => {
    setClosingMenu(true);

    setTimeout(() => {
      setShowMenu(false);
      setClosingMenu(false);
    }, 220);
  };

  console.log("users", users);
  /*
   * =============================================================================
   * Layout / Render Notes (Important UI sections)
   *
   * - SIDEBAR: Left column contains search, user list, and settings popup. It
   *   collapses on mobile when a user is selected.
   * - RIGHT SIDE: Main content area uses layered animated backgrounds with an
   *   overlay and contains two possible states:
   *     1) Chat screen - visible when `selectedUser` is set; mounts the `Chat`
   *        component and wires presence/message props.
   *     2) Default screen - instructive landing view shown when no chat is
   *        selected (big icon + message).
   *
   * Accessibility & Performance hints:
   *   - Background GIFs can be heavy; consider optimized static/video assets
   *     or progressive loading to improve performance on mobile.
   *   - Add ARIA attributes to interactive elements (user rows, menu button)
   *     and ensure keyboard focus states are visible.
   *
   * This block is informational only — it does not change behavior.
   * =============================================================================
   */
  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* <Toaster
  position="top-center"
  toastOptions={{
    duration: 90000,
    style: {
      zIndex: 99999,
    },
  }}
 
/> */}
      <ImageViewer image={viewerImage} onClose={() => setViewerImage(null)} />
      {/* SIDEBAR */}
      {/* SIDEBAR */}
      <div
        className={`
    absolute md:relative inset-y-0 left-0 z-20

    w-full md:w-87.5
    bg-[#1f1f1f]
   
    border-r border-zinc-800
    flex flex-col
    scrollbar-x-hide
    transition-all
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    
    ${selectedUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"}

  `}
      >
        {/* TOP */}
        <div className="p-4 flex items-center gap-4">
          <button
            className="text-zinc-300 hover:text-white"
            onClick={() => setShowMenu(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 bg-[#2a2a2a] rounded-full px-2 py-0 flex items-center gap-3">
            <div
              onClick={() => setShowSearch(true)}
              className="flex-1 bg-[#2a2a2a] rounded-full px-4 py-2 flex items-center gap-3 cursor-pointer"
            >
              <Search size={18} className="text-zinc-400" />
              <span className="text-zinc-400">Search</span>
            </div>
          </div>
        </div>
        {/* Outside the button */}
        <SidebarPopup
          open={showMenu}
          user={user.name}
          avatar={user.avatar}
          onClose={closeMenu}
          closing={closingMenu}
          onProfileClick={() => {
            closeMenu();

            setTimeout(() => {
              setShowProfile(true);
            }, 220);
          }}
        />
        {showSearch && (
          <SearchPage
            onClose={() => setShowSearch(false)}
            setSelectedUser={setSelectedUser}
          />
        )}{" "}
        {/* LOADING */}
        {loading && (
          <div className="flex-1 flex items-center justify-center h-full">
            <UserSkeleton />
          </div>
        )}
        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar ">
          {!loading && users.length === 0 && (
            <div className="text-center text-zinc-500 mt-10">
              No users found
            </div>
          )}

          {users.map((userItem) => {
            const firstLetter = [null, undefined].includes(userItem.name)
              ? "A"
              : userItem.name.charAt(0).toUpperCase();
            const bgColor = avatarColors[firstLetter] || "6366f1";
            return (
              <div
                key={userItem._id}
                onClick={() => setSelectedUser(userItem)}
                className={`
      flex items-center gap-3 px-4 py-3
      cursor-pointer transition
      scrollbar-hide
      ${
        selectedUser?._id === userItem._id
          ? "bg-[#8774e1] px-4 py-3 rounded-2xl m-1 text-black font-semibold "
          : "hover:bg-[#2f016480] transition rounded-2xl"
      }

    `}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={
                      userItem.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userItem.name,
                      )}&background=${bgColor}&color=fff`
                    }

                    alt={userItem.name}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full text-4xl object-cover ${
                      onlineUsers.includes(userItem._id)
                        ? "border-[#00d652] border-"
                        : "border-[#5e519b] border-0"
                    }`}
                  />
                  {onlineUsers.includes(userItem._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-[#1b1b1b] rounded-full" />
                  )}
                </div>

                {/* Name + last message */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-semibold truncate">
                    {userItem.name}
                    {userItem._id === currentUserId && " (You)"}
                  </h2>

                  <p
                    className={`text-sm truncate ${
                      userItem.lastMessage?.text
                        ? "text-white"
                        : "text-zinc-300"
                    }`}
                  >
                    {userItem.lastMessage?.text ? (
                      <>
                        {String(userItem.lastMessage.sender) ===
                          String(currentUserId) && (
                          <span
                            className={`text-zinc-300 ${selectedUser ? "font-bold" : "font-medium"}`}
                          >
                            You:{" "}
                          </span>
                        )}
                        {userItem.lastMessage.text.length > 8
                          ? `${userItem.lastMessage.text.substring(0, 8)}...`
                          : userItem.lastMessage.text}
                      </>
                    ) : userItem.lastMessage?.image ? (
                      <span
                        className={`flex items-center gap-1 ${
                          selectedUser?._id === userItem._id
                            ? "text-white"
                            : "text-indigo-400"
                        }`}
                      >
                        {String(userItem.lastMessage.sender) ===
                          String(currentUserId) && (
                          <span
                            className={`text-zinc-300 ${selectedUser ? "font-bold" : "font-normal"}`}
                          >
                            You:{" "}
                          </span>
                        )}
                        <ImageIcon size={14} />
                        Photo
                      </span>
                    ) : (
                      `${userItem.name} joined the zollo`.toUpperCase()
                    )}
                  </p>
                </div>

                {/* Right column: time + unread badge */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                  <span
                    className={`text-xs ${
                      onlineUsers.includes(userItem._id)
                        ? "text-white font-bold"
                        : "text-[#dadada] font-normal"
                    }`}
                  >
                    {onlineUsers.includes(userItem._id)
                      ? "Online"
                      : userItem.lastMessage?.createdAt
                        ? (() => {
                            const date = new Date(
                              userItem.lastMessage.createdAt,
                            );
                            const now = new Date();
                            const isToday =
                              date.toDateString() === now.toDateString();
                            return isToday
                              ? date.toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : date.toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                });
                          })()
                        : "Offline"}
                  </span>

                  {userItem.unreadCount > 0 && (
                    <div className="bg-[#fafafa] text-[#474165] text-[11px] font-bold min-w-[18px] h-[18px] px-1 py-2 rounded-full flex items-center justify-center leading-none">
                      <span className="mb-0.5">
                        {userItem.unreadCount > 99
                          ? "99+"
                          : userItem.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* EDIT PROFILE MODAL */}
        {showProfile && (
          <div
            className={`
      fixed inset-0 z-9999
      bg-[#0e0f13]
      overflow-y-auto
      custom-scrollbar
      ${closingProfile ? "animate-slide-left-close" : "animate-slide-left"}
    `}
          >
            <EditProfile user={user} onClose={closeProfile} />
          </div>
        )}
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
        <div className="absolute inset-0 overflow-hidden bg-[url('https://images4.alphacoders.com/938/thumb-1920-938819.jpg')] bg-cover bg-center">
          {/* BG 1 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade1"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/89/7e/2a/897e2ab8a8f517dcbac01280ceed8948.png')",
            }}
          />

          {/* BG 2 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade2"
            style={{
              backgroundImage:
                "url('https://inspgr.id/app/uploads/2022/05/art-white-g-17.jpg')",
            }}
          />

          {/* BG 3 */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-fade3"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/originals/09/5e/74/095e741ff45bece31a21bd2b58c70e2e.jpg')",
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
        <div className="absolute inset-0 bg-black/50 " />

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
                lastMessage={selectedUser?.lastMessage}
                setViewerImage={setViewerImage}
                className="h-full w-full "
              />
            )}
          </div>

          {/* ================= DEFAULT SCREEN ================= */}
          <div
            className={`
        absolute inset-0 h-full

        flex items-center justify-center 

        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          selectedUser
            ? "-translate-x-full opacity-0 "
            : "translate-x-0 opacity-100 bg-cover bg-center"
        }

          `}
            style={
              selectedUser
                ? {}
                : {
                    backgroundImage:
                      "url('https://i.pinimg.com/736x/91/56/78/915678c314c10f2c58ca30c043aa7c20.jpg')",
                  }
            }

          >
            <div className="text-center flex flex-col justify-center  items-center bg-[#0000007c] w-full h-full ">
              {/* <img
                src="./public/Frame 1 (42).png"
                alt="Welcome"
                className="w-[20px] md:w-40 mx-auto mb-6"
              /> */}

              <div
                className="icon-wrap h-[20%] mb-2"
                aria-label="Winking chat bubble icon"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 942 942"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M471 897C706.273 897 897 706.273 897 471C897 235.727 706.273 45 471 45C235.727 45 45 235.727 45 471C45 706.273 235.727 897 471 897Z"
                    fill="#2563EB"
                  />

                  <path
                    d="M556.896 761.455L739.928 725.494C739.928 725.494 734.971 788.6 747.766 826C757.543 854.579 788.338 894.234 788.338 894.234C788.338 894.234 695.773 887.923 647.26 858.273C603.129 831.302 556.896 761.455 556.896 761.455Z"
                    fill="#2563EB"
                  />

                  <ellipse
                    cx="471.5"
                    cy="471"
                    rx="309.5"
                    ry="310"
                    fill="white"
                  />

                  <path
                    d="M537 710.449L667.916 685C667.916 685 662.161 729.467 671.312 755.935C678.306 776.161 705 826 705 826C705 826 636.333 799.95 601.634 778.967C570.069 759.88 537 710.449 537 710.449Z"
                    fill="white"
                  />

                  <path
                    d="M305.002 373.009C347.12 362.75 389.579 388.577 399.838 430.694C410.096 472.812 384.27 515.272 342.152 525.53C300.035 535.789 257.575 509.961 247.316 467.844C237.058 425.726 262.885 383.268 305.002 373.009Z"
                    fill="#2563EB"
                  />
                  <path
                    d="M308.294 324.219C320.422 323.613 332.559 325.259 344.01 329.063L339.604 340.786C329.791 337.526 319.39 336.115 308.996 336.634C298.602 337.153 288.419 339.592 279.027 343.812C269.636 348.031 261.22 353.948 254.261 361.226C247.302 368.503 241.935 376.997 238.468 386.225L226 382.083C230.046 371.316 236.308 361.404 244.428 352.912C252.548 344.421 262.368 337.516 273.326 332.593C284.284 327.67 296.166 324.824 308.294 324.219Z"
                    fill="#2563EB"
                  />

                  <g className="wink-group">
                    <path
                      d="M591.162 290.899C598.016 282.593 611.379 279.768 621.008 284.591C630.636 289.414 632.886 300.059 626.032 308.365L564.172 383.338L653.58 421.467C663.486 425.691 666.384 436.178 660.052 444.889C653.719 453.599 640.555 457.235 630.648 453.011L521.97 406.666C516.744 404.437 513.468 400.465 512.47 395.931C511.272 391.445 512.353 386.413 515.969 382.03L591.162 290.899Z"
                      fill="#2563EB"
                    />
                    <path
                      d="M593.701 255.585C588.793 276.847 575.585 295.607 556.685 308.161C537.785 320.715 514.566 326.151 491.611 323.396L493.253 311.308C512.99 313.677 532.955 309.003 549.206 298.208C565.457 287.413 576.815 271.283 581.035 253L593.701 255.585Z"
                      fill="#2563EB"
                    />
                  </g>

                  <path
                    className="mouth-path"
                    d="M491.02 570.048C526.724 552.564 521.082 467.763 555.668 538.39C590.254 609.016 589.347 680.444 553.643 697.929C517.938 715.413 460.957 672.332 426.371 601.706C391.786 531.08 455.315 587.532 491.02 570.048Z"
                    fill="#2563EB"
                  />
                </svg>
              </div>

              <h1 className="text-4xl md:text-[3.5vw] w-[80%] font-bold text-white capitalize">
                NexChat
              </h1>

              <p className="text-zinc-300 mt-1 text-2xl md:text-base capitalize ">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
