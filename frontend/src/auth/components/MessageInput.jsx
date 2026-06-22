//components MessageInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { ImagePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "../hook/massage.hook.js";
const MessageInput = ({
  messageText,
  setMessageText,
  selectedUser,
  handleSendMessage,
  socketRef,
  user,
  currentUserId,
  replyMsg,
  setReplyMsg,

  editMsg,
  setEditMsg,
  editText,
  setEditText,
  setMessages,
  editMessage,
}) => {
  const { editMessageinchat } = useMessage();
  // const sendMessage = async () => {
  //   try {
  //     if (!messageText?.trim()) return;
  //     if (!user?._id || !selectedUser?._id) return;
  //     if (!socketRef?.current) return;

  //     const text = messageText;

  //     // 1. SEND VIA API (FIXED FORMAT)
  //     await handleSendMessage(selectedUser._id, text);

  //     // 2. SOCKET EMIT
  //     socketRef.current.emit("send_message", {
  //       senderId: user._id,
  //       receiverId: selectedUser._id,
  //       text: text,
  //       createdAt: new Date(),
  //     });

  //     setMessageText("");
  //   } catch (err) {
  //     console.log("Send error:", err);
  //   }
  // };
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const queryClient = useQueryClient();
  const textareaRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    if (editMsg) {
      setMessageText(editMsg.text || "");

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [editMsg]);
const handleEditMessage = async () => {
  try {
    const finalText = messageText; // ✅ capture BEFORE clearing

    await editMessageinchat(editMsg._id, finalText);

    setMessages((prev) =>
      prev.map((m) =>
        m._id === editMsg._id
          ? {
              ...m,
              text: finalText, // ✅ use captured value
              edited: true,
              editedAt: new Date(),
            }

          : m,
      ),
    );

    socketRef.current.emit("messageEdited", {
      _id: editMsg._id,
      messageId: editMsg._id,
      text: finalText, // ✅ use captured value
      edited: true,
      editedAt: new Date(),
      senderId: user._id,
      receiverId: selectedUser._id,
    });

    setEditMsg(null);
    setEditText("");
    setMessageText(""); // ✅ clear AFTER everything
  } catch (err) {
    console.log(err);
  }
};
  const handleImageFile = (file) => {
    if (!file) return;

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      alert("Only PNG and JPG images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB");
      return;
    }

    setImage(file);
  };
  const sendMessage = async () => {
    if (sending) return; // prevent double click
    if (!messageText.trim() && !image) return;

    try {
      setSending(true);

      const formData = new FormData();
      formData.append("receiver", selectedUser._id);

      if (messageText.trim()) {
        formData.append("text", messageText);
      }

      if (image) {
        formData.append("image", image);
      }

      // ⭐ ADD THIS (REPLY FEATURE)
      if (replyMsg?._id) {
        formData.append("replyTo", replyMsg._id);
      }

      await handleSendMessage(formData);
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      setMessageText("");
      setReplyMsg("");
      setImage(null);
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
  };
  // ================= Typing =================
  const typingRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const handleTyping = (e) => {
    const value = e.target.value;

    if (value.trim() && !typingRef.current) {
      typingRef.current = true;

      socketRef.current.emit("typing", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        typing: true,
      });
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      typingRef.current = false;

      socketRef.current.emit("typing", {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        typing: false,
      });
    }, 1000);
  };
  const [showEmoji, setShowEmoji] = useState(false);
  return (
    //   <div className="p-3 lg:px-20">
    //   <div className="flex items-center bg-[#1f1f1f] rounded-full px-4 py-3 gap-3">

    //     <Smile
    //       size={22}
    //       className="text-zinc-400 cursor-pointer hover:text-white"
    //     />

    //     <textarea
    //   rows="1"
    //   value={messageText}
    //   onChange={(e) => {
    //     setMessageText(e.target.value);
    //     e.target.style.height = "auto";
    //     e.target.style.height = `${e.target.scrollHeight}px`;
    //   }}
    //   className="
    //     flex-1
    //     bg-transparent
    //     text-white
    //     outline-none
    //     resize-none
    //     max-h-32
    //     overflow-y-auto
    //   "
    // />

    //     <Paperclip
    //       size={22}
    //       className="text-zinc-400 cursor-pointer hover:text-white"
    //     />

    //     <button onClick={sendMessage}>
    //       <Send
    //         size={24}
    //         className="text-[#8774e1] hover:text-[#9d8cff]"
    //       />
    //     </button>

    //   </div>
    // </div>

    <div
      className="p-3 lg:px-20 relative"
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onPaste={(e) => {
        const items = e.clipboardData?.items;

        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            handleImageFile(file);
            break;
          }
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (!file) return;

        handleImageFile(file);
      }}
    >
      {editMsg && (
        <div className="mb-2 p-2 bg-[#2a2a2a] rounded-xl flex justify-between items-center border-l-4 border-blue-500">
          <div>
            <p className="text-blue-300 text-xs">Editing message</p>

            <p className="truncate text-white max-w-[250px]">{editMsg.text}</p>
          </div>

          <button
            onClick={() => {
              setEditMsg(null);
              setEditText("");
            }}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
      {isDragging && (
        <div className="absolute inset-0 z-[999] bg-black/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#8774e1] flex items-center justify-center">
          <div className="text-white text-lg font-medium">
            Drop image here 📸
          </div>
        </div>
      )}
      {replyMsg && (
        <div className="mb-2 p-2 bg-[#2a2a2a] rounded-xl flex justify-between items-center border-l-4 border-purple-500">
          <div className="text-sm text-white">
            <p className="text-purple-300 text-xs">Replying to</p>

            <p className="truncate max-w-[250px]">{replyMsg.text || "Image"}</p>
          </div>

          <button
            onClick={() => setReplyMsg(null)}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessageText((prev) => prev + emojiData.emoji);
              setShowEmoji(false);
            }}
            theme="dark"
          />
        </div>
      )}
      {image && (
        <div className="mb-2 relative w-fit">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-32 h-32 object-cover rounded-lg"
          />

          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
          >
            ×
          </button>
        </div>
      )}
      {/* Input Bar */}
      <div className="flex items-end bg-[#1f1f1fc2] backdrop-blur-xs rounded-3xl px-4 py-3 gap-3">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="text-zinc-400 hover:text-white transition"
        >
          <Smile size={22} />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder="Message"
          value={messageText || ""}
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping(e);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              if (editMsg) {
                handleEditMessage();
              } else {
                sendMessage();
              }
            }
          }}
          className="
            flex-1
            bg-transparent
            text-white
            placeholder:text-zinc-500
            outline-none
            resize-none
            max-h-32
            overflow-y-auto
          "
        />

        {/* Attachment */}
        <label className="text-zinc-400 hover:text-white transition cursor-pointer">
          <ImagePlus size={22} />
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            hidden
            onChange={(e) => {
              handleImageFile(e.target.files?.[0]);
            }}
          />
        </label>

        {/* Send Button */}
        <button
          onClick={() => {
            if (editMsg) {
              handleEditMessage();
            } else {
              sendMessage();
            }
          }}
          disabled={sending}
          className={`text-[#8774e1] transition ${
            sending ? "opacity-50 cursor-not-allowed" : "hover:text-[#9d8cff]"
          }`}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
