import React from "react";
import {  ChevronLeft } from 'lucide-react';
const ChatHeader = ({ selectedUser, setSelectedUser }) => {
  return (
    <div className="h-[70px] md:h-[80px] bg-[#1b1b1b44] backdrop-blur-md px-4 md:px-6 flex items-center gap-3 border-b border-white/5">
      
      {/* BACK BUTTON MOBILE */}
      <button
        onClick={() => setSelectedUser(null)}
        className="md:hidden text-white text-2xl"
      >
        <ChevronLeft size={28} />
      </button>

      {/* USER AVATAR */}
      <div className="relative">
        <img
          src={`https://ui-avatars.com/api/?name=${selectedUser?.name}&background=6366f1&color=fff`}
          alt={selectedUser?.name}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-indigo-500 object-cover"
        />

        {/* ONLINE DOT */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1b1b1b] rounded-full"></span>
      </div>

      {/* USER INFO */}
      <div className="flex flex-col">
        <h1 className="text-white font-semibold text-base md:text-lg">
          {selectedUser?.name}
        </h1>

        <p className="text-green-400 text-xs md:text-sm">
          Online
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;