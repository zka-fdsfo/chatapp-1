import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ProfilePage from "./ProfilePage.jsx";
import { useMessage } from "../hook/massage.hook.js";
import { useAuth } from "../hook/hookauth.js";
import MessageListSkeleton from "./MessageListSkeleton";
import ChatSkeleton from "./ChatSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMessage } from "../hook/useDeleteMessage.hook";
const Chat = ({
  selectedUser,
  setSelectedUser,
  setOnlineUsers,
  onlineUsers,
  lastMessage,
  setViewerImage,
}) => {
  const socketRef = useRef(null);
  const sentSeenMessageIdsRef = useRef(new Set());
  const receivedSeenMessageIdsRef = useRef(new Set());

  const { messages, setMessages, fetchMessages, handleSendMessage } =
    useMessage();

  const { user } = useAuth();

  const [messageText, setMessageText] = useState("");
  const [menuMsg, setMenuMsg] = useState(null);
  const [editMsg, setEditMsg] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  // ✅ PROFILE DRAWER STATE
  const [showProfile, setShowProfile] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteMessage } = useDeleteMessage();
  const currentUserId = user?._id ? String(user._id) : "";
const [replyMsg, setReplyMsg] = useState(null);
  // ================= SOCKET INIT =================
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      //console.log("🟢 Socket connected:", socketRef.current.id);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  // ================= Message sockit =================
  useEffect(() => {
    if (!socketRef.current) return;

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          String(msg._id) === String(messageId)
            ? {
                ...msg,
                deleted: true,
                text: "This message was deleted",
                image: "",
              }

            : msg,
        ),
      );
    };

    socketRef.current.on("messageDeleted", handleMessageDeleted);

    return () => {
      socketRef.current.off("messageDeleted", handleMessageDeleted);
    };
  }, []);
  // ================= ONLINE USER =================
  useEffect(() => {
    if (!user?._id || !socketRef.current) return;

    socketRef.current.emit("online-user", user._id);
  }, [user?._id]);

  // ================= FETCH MESSAGES =================
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser?._id) return;

      setMessages([]); // clear old chat
      setLoadingMessages(true);

      try {
        await fetchMessages(selectedUser._id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedUser?._id]);

  // ================= RECEIVE MESSAGE =================
  useEffect(() => {
    if (!socketRef.current) return;

   const handleReceiveMessage = (msg) => {
  const isActiveChat =
    (String(msg.sender) === String(selectedUser?._id) &&
      String(msg.receiver) === String(user?._id)) ||
    (String(msg.sender) === String(user?._id) &&
      String(msg.receiver) === String(selectedUser?._id));

  if (!isActiveChat) return;

  setMessages((prev) => {
    const exists = prev.some((m) => String(m._id) === String(msg._id));
    if (exists) return prev;

    return [...prev, msg];
  });
};

    socketRef.current.on("receive_message", handleReceiveMessage);

    return () => {
      socketRef.current.off("receive_message", handleReceiveMessage);
    };
  }, [selectedUser?._id, user?._id]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleSeenUpdate = ({ messageId }) => {
      // console.log("✅ Seen Update:", messageId);
queryClient.invalidateQueries({
  queryKey: ["users"],
});
      receivedSeenMessageIdsRef.current.add(String(messageId));

      setMessages((prev) =>
        prev.map((msg) =>
          String(msg._id) === String(messageId) && !msg.seen
            ? { ...msg, seen: true }
            : msg,
        ),
      );
    };

    socketRef.current.on("message_seen_update", handleSeenUpdate);

    return () => {
      socketRef.current.off("message_seen_update", handleSeenUpdate);
    };
  }, []);

  // ================= SEEN UPDATE =================
  useEffect(() => {
    if (!socketRef.current || !user?._id) return;

    const unseenMessages = messages.filter(
      (msg) =>
        String(msg.receiver || msg.receiverId) === String(user._id) &&
        !msg.seen &&
        msg._id,
    );
    queryClient.invalidateQueries({
  queryKey: ["users"],
});
    unseenMessages.forEach((msg) => {
      const messageId = String(msg._id);

      if (sentSeenMessageIdsRef.current.has(messageId)) return;

      sentSeenMessageIdsRef.current.add(messageId);

      socketRef.current.emit("message_seen", {
        messageId,
        senderId: String(msg.sender || msg.senderId),
      });
    });
  }, [messages, user?._id]);

  // If a seen update arrives before the message is present locally,

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleTyping = ({ senderId, typing }) => {
      if (String(senderId) === String(selectedUser?._id)) {
        setIsTyping(typing);
      }
    };

    socketRef.current.on("typing", handleTyping);

    return () => {
      socketRef.current.off("typing", handleTyping);
    };
  }, [selectedUser?._id]);
  // replay it once the message is added to state.
  useEffect(() => {
    if (!receivedSeenMessageIdsRef.current.size) return;

    let hasPendingSeenUpdate = false;

    setMessages((prev) => {
      const next = prev.map((msg) => {
        const messageId = String(msg._id);

        if (!receivedSeenMessageIdsRef.current.has(messageId) || msg.seen) {
          return msg;
        }

        hasPendingSeenUpdate = true;
        return { ...msg, seen: true };
      });

      return hasPendingSeenUpdate ? next : prev;
    });
  }, [messages, setMessages]);
  // ================= MessageDeleted=================

  const handleDeleteMessage = async (messageId) => {
    try {
      // 1. call API (via hook or direct service)
      await deleteMessage(messageId);

      // 2. instant UI update (optimistic)
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                deleted: true,
                text: "This message was deleted",
                image: "",
              }

            : msg,
        ),
      );

      // 3. SOCKET EMIT (this is the important part)
      socketRef.current.emit("messageDeleted", {
        messageId,
        senderId: user._id,
        receiverId: selectedUser._id,
      });
    } catch (err) {
      console.error(err);
    }
  };

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
      <div
        className={`absolute inset-0 z-50  ${
          showProfile ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* BACKDROP */}
        <div
          onClick={() => setShowProfile(false)}
          className={`profile-backdrop ${showProfile ? "show" : "hidden"}`}
        />

        {/* PANEL */}
        <div
          className={`profile-panel custom-scrollbar ${showProfile ? "open" : ""} h-screen overflow-y-auto`}
        >
          <ProfilePage
            user={selectedUser}
            showProfile={showProfile}
            currentUserId={currentUserId}
            setViewerImage={setViewerImage}
            lastMessage={selectedUser?.lastMessage?.createdAt}
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
        lastMessage={lastMessage?.createdAt}
        socketRef={socketRef}
        currentUserId={currentUserId}
        isTyping={isTyping}
      />

      {/* ================= MESSAGE LIST ================= */}
      <MessageList
        messages={messages}
        setuserid={selectedUser?._id}
        selectedUser={{
          name: selectedUser.name,
          avatar: selectedUser.avatar,
        }}
        setMessages={setMessages}
        currentUserId={currentUserId}
        menuMsg={menuMsg}
        setMenuMsg={setMenuMsg}
        setEditMsg={setEditMsg}
        setEditText={setEditText}
        loadingMessages={loadingMessages}
        handleDeleteMessage={handleDeleteMessage}
        setViewerImage={setViewerImage}
         setReplyMsg={setReplyMsg}
      />

      {/* ================= INPUT ================= */}
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        selectedUser={selectedUser}
        handleSendMessage={handleSendMessage}
        socketRef={socketRef}
        user={user}
        currentUserId={currentUserId}
        setReplyMsg={setReplyMsg}
        replyMsg={replyMsg}
      />
    </div>
  );
};

export default Chat;
