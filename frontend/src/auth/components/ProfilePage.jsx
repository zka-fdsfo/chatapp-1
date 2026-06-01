import React from "react";
import {
  ArrowLeft,
  Pencil,
  MoreVertical,
  Phone,
  AtSign,
  Settings,
  Sparkles,
  Bell,
} from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md lg:max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-4">
            <ArrowLeft size={24} className="cursor-pointer" />
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>

          <div className="flex gap-4">
            <Pencil size={22} className="cursor-pointer" />
            <MoreVertical size={22} className="cursor-pointer" />
          </div>
        </div>

        <div className="lg:flex lg:gap-8 lg:px-6">
          {/* LEFT SIDE */}
          <div className="lg:w-[350px]">
            {/* Profile */}
            <div className="flex flex-col items-center mt-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500"
                  alt=""
                  className="w-36 h-36 rounded-full object-cover border-4 border-white/10"
                />

                <div className="absolute bottom-3 right-3 w-7 h-7 bg-gray-500 rounded-full border-4 border-black"></div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-center">
                Mullick Zaid Khan
              </h2>

              <p className="text-green-400 text-sm mt-1">online</p>
            </div>

            {/* Contact Card */}
            <div className="bg-[#171717] rounded-3xl p-5 mt-8 mx-4 lg:mx-0">
              <div className="flex gap-4 mb-6">
                <Phone className="text-gray-400 mt-1" />

                <div>
                  <h3 className="font-medium text-lg">
                    +91 93309 49229
                  </h3>
                  <p className="text-gray-400">Phone</p>
                </div>
              </div>

              <div className="flex gap-4">
                <AtSign className="text-gray-400 mt-1" />

                <div>
                  <h3 className="font-medium text-lg">
                    @mullickzaidkhan
                  </h3>
                  <p className="text-gray-400">Username</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 mt-8 lg:mt-20">
            <div className="bg-[#171717] rounded-3xl p-5 mx-4 lg:mx-0">
              <div className="space-y-7">
                <button className="w-full flex items-center gap-5 hover:text-blue-400 transition">
                  <Settings size={24} />
                  <span className="text-lg">
                    General Settings
                  </span>
                </button>

                <button className="w-full flex items-center gap-5 hover:text-blue-400 transition">
                  <Sparkles size={24} />
                  <span className="text-lg">
                    Animations & Performance
                  </span>
                </button>

                <button className="w-full flex items-center gap-5 hover:text-blue-400 transition">
                  <Bell size={24} />
                  <span className="text-lg">
                    Notifications
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;