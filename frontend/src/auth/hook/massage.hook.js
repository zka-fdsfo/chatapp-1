
import React, { useEffect, useRef, useState } from "react";
import {
  getallchatusers,
} from "../services/auth.api.js";

import {
  sendMessage,
  markAsSeen,
  getImageMessagesApi,
} from "../services/auth.api.js";

// Manages message state and message-related actions for the chat UI.
export const useMessage = () => {
  const [messages, setMessages] = useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const [imageMessages, setImageMessages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Loads the conversation with another user and marks it as seen.
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

  // Sends a new text or image message and appends it to local state.
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

  // Loads only image messages for the selected chat partner.
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