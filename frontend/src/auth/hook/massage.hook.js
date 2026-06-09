import { useState } from "react";

import {
  getallchatusers,
} from "../services/auth.api.js";

import {
  sendMessage,
  markAsSeen,
  getImageMessagesApi,
} from "../services/auth.api.js";

export const useMessage = () => {
  const [messages, setMessages] = useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const [imageMessages, setImageMessages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
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
const handleSendMessage = async (formData) => {
  try {
    const newMessage = await sendMessage(formData);

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);
  } catch (error) {
    console.error(
      "Send Message Error:",
      error
    );
  }
};

  /* ================= FETCH IMAGE MESSAGES ================= */
  const fetchImageMessages = async (selectedUserId) => {
    try {
      setLoadingImages(true);
    
      const response = await getImageMessagesApi(selectedUserId);

      setImageMessages(response.messages || []);

      return response.messages;
    } catch (error) {
      console.error("Fetch Image Messages Error:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  return {
    messages,

    setMessages,

    loadingMessages,

    fetchMessages,

    handleSendMessage,
    imageMessages,
    loadingImages,
    fetchImageMessages,
  };
};