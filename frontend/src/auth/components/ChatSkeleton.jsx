import React from "react";
import MessageListSkeleton from "./MessageListSkeleton";

const ChatSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="h-16 border-b border-zinc-800 flex items-center px-4 gap-3 animate-pulse">
        <div className="w-11 h-11 rounded-full bg-zinc-700" />

        <div>
          <div className="h-4 w-32 bg-zinc-700 rounded" />
          <div className="h-3 w-20 bg-zinc-800 rounded mt-2" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <MessageListSkeleton />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-700" />
          <div className="flex-1 h-12 rounded-full bg-zinc-700" />
          <div className="w-10 h-10 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;