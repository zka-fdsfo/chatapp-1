import React, { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { useMessage } from "../hook/massage.hook.js";
import { useAuth } from "../hook/hookauth.js";

const Chat = ({ selectedUser, setSelectedUser }) => {
  const {
    messages,
    fetchMessages,
    handleSendMessage,
    handleDeleteMessage,
  } = useMessage();

  const { user } = useAuth();

  const [messageText, setMessageText] = useState("");
  const [menuMsg, setMenuMsg] = useState(null);
  const [editMsg, setEditMsg] = useState(null);
  const [editText, setEditText] = useState("");

  const currentUserId = user?._id;

  // FETCH MESSAGES
  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* MESSAGES */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        menuMsg={menuMsg}
        setMenuMsg={setMenuMsg}
        setEditMsg={setEditMsg}
        setEditText={setEditText}
        handleDeleteMessage={handleDeleteMessage}
      />

      {/* INPUT */}
      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        selectedUser={selectedUser}
        handleSendMessage={handleSendMessage}
      />

    </div>
  );
};

export default Chat;