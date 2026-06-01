import { useState } from "react";

import {
  getallchatusers,
} from "../services/auth.api.js";

import {
  sendMessage,
  markAsSeen,
} from "../services/auth.api.js";

export const useMessage = () => {
  const [messages, setMessages] = useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  /* ================= FETCH MESSAGES ================= */
  const fetchMessages = async (userId) => {
    try {
      setLoadingMessages(true);

      const response =
        await getallchatusers(userId);

      setMessages(response.data || []);

      /* MARK AS SEEN */
      await markAsSeen(userId);
    } catch (error) {
      console.error(
        "Fetch Messages Error:",
        error.message
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async (
    receiverId,
    text
  ) => {
    if (!text.trim()) return;

    try {
      const newMessage =
        await sendMessage(
          receiverId,
          text
        );

      /* ADD NEW MESSAGE */
      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);
    } catch (error) {
      console.error(
        "Send Message Error:",
        error.message
      );
    }
  };

  return {
    messages,

    setMessages,

    loadingMessages,

    fetchMessages,

    handleSendMessage,
  };
};