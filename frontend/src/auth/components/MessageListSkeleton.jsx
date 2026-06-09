import React from "react";

const MessageListSkeleton = () => {
  return (
    <div className="h-full overflow-y-hidden px-6 py-4 lg:px-25 animate-pulse">
      <div className="space-y-5">
        {/* Received */}
        <div className="flex justify-start">
          <div className="max-w-[75%]">
            <div className="h-12 w-52 bg-zinc-700 rounded-2xl rounded-bl-sm" />
            <div className="h-3 w-12 bg-zinc-800 rounded mt-2 ml-2" />
          </div>
        </div>

        {/* Sent */}
        <div className="flex justify-end">
          <div className="max-w-[75%]">
            <div className="h-14 w-64 bg-[#8774e1]/40 rounded-2xl rounded-br-sm" />
            <div className="h-3 w-10 bg-zinc-800 rounded mt-2 ml-auto" />
          </div>
        </div>

        {/* Received */}
        <div className="flex justify-start">
          <div className="max-w-[75%]">
            <div className="h-20 w-72 bg-zinc-700 rounded-2xl rounded-bl-sm" />
            <div className="h-3 w-14 bg-zinc-800 rounded mt-2 ml-2" />
          </div>
        </div>

        {/* Sent */}
        <div className="flex justify-end">
          <div className="max-w-[75%]">
            <div className="h-12 w-48 bg-[#8774e1]/40 rounded-2xl rounded-br-sm" />
            <div className="h-3 w-10 bg-zinc-800 rounded mt-2 ml-auto" />
          </div>
        </div>

        {/* Received */}
        <div className="flex justify-start">
          <div className="max-w-[75%]">
            <div className="h-16 w-60 bg-zinc-700 rounded-2xl rounded-bl-sm" />
            <div className="h-3 w-12 bg-zinc-800 rounded mt-2 ml-2" />
          </div>
        </div>

        {/* Sent */}
        <div className="flex justify-end">
          <div className="max-w-[75%]">
            <div className="h-10 w-40 bg-[#8774e1]/40 rounded-2xl rounded-br-sm" />
            <div className="h-3 w-10 bg-zinc-800 rounded mt-2 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageListSkeleton;