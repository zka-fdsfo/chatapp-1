import React from "react";

const EmptyChat = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className="
          text-center
          animate-fadeIn
          backdrop-blur-md
          bg-[#a700b644]
          p-6
          rounded-2xl
        "
      >
        {/* GIF */}
        <img
          src="https://i.pinimg.com/originals/78/5f/ce/785fce6734c7285c7ab99f871c732158.gif"
          alt="No Messages"
          className="w-48 md:w-60 mx-auto opacity-90"
        />

        {/* TITLE */}
        <h2 className="text-white text-2xl font-bold mt-5">
          No Messages Yet
        </h2>

        {/* SUBTEXT */}
        <p className="text-zinc-400 text-sm mt-2">
          Start chatting and make the first move 🚀
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;