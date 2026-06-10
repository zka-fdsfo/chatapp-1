import { Clock3 } from "lucide-react";

export default function RateLimit() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center text-[#8774e1]">
        <Clock3 size={70} className="mx-auto mb-4 " />

        <h1 className="text-3xl font-bold mb-3">
          Too Many Attempts
        </h1>

        <p className="text-zinc-400 mb-6">
          You've made too many login attempts.
          Please wait a few minutes and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-5 py-3 rounded-xl bg-[#8774e1] text-white font-medium
          "
        >
          Try Again Later
        </button>
      </div>
    </div>
  );
}