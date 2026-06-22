
import React, { useEffect, useRef, useState } from "react";
import {
  getallchatusers,
} from "../services/auth.api.js";

import {
  sendMessage,
  markAsSeen,
  getImageMessagesApi,
  editMessageApi,
} from "../services/auth.api.js";

// Manages message state and message-related actions for the chat UI.
export const useMessage = () => {
  const [messages, setMessages] = useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);
  const [imageMessages, setImageMessages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Loads the conversation with another user and marks it as seen.
const fetchMessages = async (userId, page = 1) => {
  const isInitialLoad = page === 1;

  try {
    if (isInitialLoad) {
      setLoadingMessages(true);
    }

    const response = await getallchatusers(userId, page);

    const data = response.data || [];
    const pagination = response.pagination || {};

    if (isInitialLoad) {
      setMessages(data);
      await markAsSeen(userId);
    }

    return {
      data,
      page: pagination.page || page,
      hasMore: pagination.hasMore ?? false,
    };
  } catch (error) {
    console.error("Fetch Messages Error:", error.message);

    return {
      data: [],
      page,
      hasMore: false,
    };
  } finally {
    if (isInitialLoad) {
      setLoadingMessages(false);
    }
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
const editMessageinchat = async (messageId, text) => {
  try {
    const data = await editMessageApi(
      messageId,
      text
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};
  return {
    messages,

    setMessages,

    loadingMessages,
    editMessageinchat,
    fetchMessages,
    setImageMessages,
    handleSendMessage,
    imageMessages,
    loadingImages,
    fetchImageMessages,
  };
};