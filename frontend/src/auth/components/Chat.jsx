import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ProfilePage from "./ProfilePage.jsx";
import { useMessage } from "../hook/massage.hook.js";
import { useAuth } from "../hook/hookauth.js";

const Chat = ({
  selectedUser,
  setSelectedUser,
  setOnlineUsers,
  onlineUsers,
}) => {
  const socketRef = useRef(null);

  const {
    messages,
    setMessages,
    fetchMessages,
    handleSendMessage,
    handleDeleteMessage,
  } = useMessage();

  const { user } = useAuth();

  const [messageText, setMessageText] = useState("");
  const [menuMsg, setMenuMsg] = useState(null);
  const [editMsg, setEditMsg] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ PROFILE DRAWER STATE
  const [showProfile, setShowProfile] = useState(false);

  const currentUserId = user?._id;

  // ================= SOCKET INIT =================
  useEffect(() => {
    socketRef.current = io("http://192.168.99.196:5000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // ================= ONLINE USER =================
  useEffect(() => {
    if (!user?._id || !socketRef.current) return;
    socketRef.current.emit("online-user", user._id);
  }, [user?._id]);

  // ================= FETCH MESSAGES =================
  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser?._id]);

  // ================= RECEIVE MESSAGE =================
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceiveMessage = (msg) => {
      const isActiveChat =
        msg.senderId === selectedUser?._id ||
        msg.receiverId === selectedUser?._id;

      if (!isActiveChat) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    socketRef.current.on("receive_message", handleReceiveMessage);

    return () => {
      socketRef.current.off("receive_message", handleReceiveMessage);
    };
  }, [selectedUser?._id]);

  // ================= SEEN UPDATE =================
  useEffect(() => {
    if (!socketRef.current || !messages.length) return;

    const unseen = messages.filter(
      (m) => m.receiverId === user?._id && !m.seen
    );

    unseen.forEach((msg) => {
      socketRef.current.emit("message_seen_update", {
        messageId: msg._id,
        userId: user?._id,
      });
    });
  }, [messages, selectedUser?._id, user?._id]);

  // ================= LISTEN SEEN UPDATE =================
  useEffect(() => {
    if (!socketRef.current) return;

    const handleSeenUpdate = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    };

    socketRef.current.on("message_seen_update", handleSeenUpdate);

    return () => {
      socketRef.current.off("message_seen_update", handleSeenUpdate);
    };
  }, []);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">

      {/* ================= PROFILE DRAWER ================= */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* BACKDROP */}
        <div
          onClick={() => setShowProfile(false)}
          className={`profile-backdrop ${
            showProfile ? "show" : "hidden"
          }`}
        />

        {/* PANEL */}
        <div
          className={`profile-panel ${
            showProfile ? "open" : ""
          }`}
        >
          <ProfilePage
            user={selectedUser}
            onClose={() => setShowProfile(false)}
          />
        </div>
      </div>

      {/* ================= CHAT HEADER ================= */}
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setOnlineUsers={setOnlineUsers}
        onlineUsers={onlineUsers}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* ================= MESSAGE LIST ================= */}
      <MessageList
        messages={messages}
        setuserid={selectedUser?._id}
        setMessages={setMessages}
        currentUserId={currentUserId}
        menuMsg={menuMsg}
        setMenuMsg={setMenuMsg}
        setEditMsg={setEditMsg}
        setEditText={setEditText}
        handleDeleteMessage={handleDeleteMessage}
      />

      {/* ================= INPUT ================= */}
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        selectedUser={selectedUser}
        handleSendMessage={handleSendMessage}
        socketRef={socketRef}
        user={user}
      />
    </div>
  );
};

export default Chat;