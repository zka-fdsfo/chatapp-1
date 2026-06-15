import { useEffect, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useAuth } from "../hook/hookauth";

export default function SearchPage({
  onClose,
  setSelectedUser,
}) {
const {useSearchUser } = useAuth();
  const [query, setQuery] = useState("");
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
  const {
    searchUsers: users,
    loading,
    searchUser,
  } = useSearchUser();

  useEffect(() => {
    const delay = setTimeout(() => {
      searchUser(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-[#1f1f1f] z-[9999] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-zinc-700">
        <button onClick={onClose}>
          <ArrowLeft className="text-white" />
        </button>

        <div className="flex-1 flex items-center bg-[#2b2b2b] rounded-full px-4 py-2">
          <Search size={18} className="text-zinc-400" />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent text-white w-full outline-none ml-2"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="text-center text-zinc-400 mt-4">
            Searching...
          </p>
        )}

        {!loading && query && users.length === 0 && (
          <p className="text-center text-zinc-500 mt-4">
            No users found
          </p>
        )}

        {users.map((user) => {
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "A";
  const bgColor = avatarColors[firstLetter] || "6366f1";

  return (
    <div
      key={user._id}
      onClick={() => {
        setSelectedUser(user);
        onClose();
      }}
      className="flex items-center gap-3 p-4 hover:bg-[#2a2a2a] cursor-pointer"
    >
      <img
        src={
          user.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=${bgColor}&color=fff`
        }

        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      <div>
        <h2 className="text-white font-semibold">
          {user.name}
        </h2>

        <p className="text-zinc-400 text-sm">
          {user.bio || "Hey there! I'm using ChatApp."}
        </p>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}