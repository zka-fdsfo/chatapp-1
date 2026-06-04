import React from "react";
import {
  ArrowLeft,
  Camera,
  Gift,
  Megaphone,
} from "lucide-react";

export default function EditProfile({ user, onClose }) {

  const avatarColors = {
    A: "ef4444",
    B: "f97316",
    C: "eab308",
    D: "22c55e",
    E: "06b6d4",
    F: "3b82f6",
    G: "6366f1",
    H: "8b5cf6",
    I: "d946ef",
    J: "ec4899",
    K: "14b8a6",
    L: "84cc16",
    M: "f59e0b",
    N: "ef4444",
    O: "10b981",
    P: "0ea5e9",
    Q: "8b5cf6",
    R: "a855f7",
    S: "f43f5e",
    T: "f97316",
    U: "22c55e",
    V: "06b6d4",
    W: "3b82f6",
    X: "6366f1",
    Y: "8b5cf6",
    Z: "0092ff",
  };
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "A";
  const bgColor = avatarColors[firstLetter] || "6366f1";


  return (
<div className="min-h-screen overflow-y-auto bg-[#0e0f13] text-white flex justify-center">
      <div className="w-full max-w-md px-4 py-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={onClose}>
          <ArrowLeft size={18} />
          <h1 className="text-[15px] font-medium">
            Edit Profile
          </h1>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "User"
                )}&background=${bgColor}&color=fff`
              }
              alt={user?.name}
              className="w-full h-full object-cover"
            />

            <button
              className="
                absolute
                bottom-0
                left-1/2
                -translate-x-1/2
                bg-black/70
                p-1.5
                rounded-full
                border
                border-zinc-700
              "
            >
              <Camera size={18} />
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#1b1d22] rounded-3xl p-4">

          {/* First Name */}
          <div className="mb-3">
            <label className="text-[11px] text-zinc-500">
              Name
            </label>

            <input
              defaultValue={user.name}
              className="
                w-full
                mt-1
                bg-transparent
                border
                border-zinc-800
                rounded-xl
                px-3
                py-2
                text-sm
                outline-none
              "
            />
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="text-[11px] text-zinc-500">
              Last Name
            </label>

            <input
              defaultValue={user.lastName}
              className="
                w-full
                mt-1
                bg-transparent
                border
                border-zinc-800
                rounded-xl
                px-3
                py-2
                text-sm
                outline-none
              "
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <input
              defaultValue={user.bio}
              placeholder="Bio (optional)"
              className="
                w-full
                bg-transparent
                border
                border-zinc-800
                rounded-xl
                px-3
                py-3
                text-sm
                outline-none
              "
            />
          </div>

          {/* Birthday */}
          <button
            className="
              flex
              items-center
              gap-3
              w-full
              text-left
              py-2
            "
          >
            <Gift size={18} />
            <span className="text-sm font-medium">
              Add Birthday
            </span>
          </button>
        </div>

        {/* Description */}
        <p className="text-[10px] text-zinc-500 leading-relaxed mt-3 px-1">
          Any details such as age, occupation or city.
          Example: 22 y.o. designer from San Francisco.
        </p>

        {/* Username Section */}
        <div className="bg-[#1b1d22] rounded-3xl p-4 mt-4">

          <h2 className="text-[#6f8cff] text-sm font-medium mb-3">
            Username
          </h2>

          <div className="mb-3">
            <label className="text-[11px] text-zinc-500">
              Username (optional)
            </label>

            <input
              defaultValue="mullickzaidkhan"
              className="
                w-full
                mt-1
                bg-transparent
                border
                border-zinc-800
                rounded-xl
                px-3
                py-2
                text-sm
                outline-none
              "
            />
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed">
            You can choose a username on Telegram.
            If you do, people will be able to find
            you by this username and contact you
            without needing your phone number.
          </p>

          <p className="text-[10px] text-zinc-500 mt-2">
            You can use a-z, 0-9 and underscores.
          </p>

          <p className="text-[10px] text-zinc-500 mt-1">
            Minimum length is 5 characters.
          </p>
        </div>

        {/* Channel */}
        <div className="bg-[#1b1d22] rounded-3xl p-4 mt-4">

          <h2 className="text-[#6f8cff] text-sm font-medium mb-4">
            Personal Channel
          </h2>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <Megaphone size={18} />
              <span className="text-sm">
                Channel
              </span>
            </div>

            <button className="text-[#6f8cff] text-sm">
              Add
            </button>

          </div>
        </div>

        <p className="text-[10px] text-zinc-500 mt-3 px-1">
          Display the channel you message in your profile.
        </p>

      </div>
    </div>
  );
}