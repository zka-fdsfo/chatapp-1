export default function AppSkeleton() {
  return (
    <div className="h-screen bg-[#181818] animate-pulse overflow-hidden">
      {/* MOBILE */}
      <div className="md:hidden h-full flex flex-col">
        {/* Top */}
        <div className="p-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-zinc-700" />

          <div className="flex-1 h-10 rounded-full bg-zinc-700" />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-hidden px-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-700 shrink-0" />

              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-zinc-700 rounded" />
                  <div className="h-3 w-10 bg-zinc-700 rounded" />
                </div>

                <div className="h-3 w-40 bg-zinc-800 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex h-full">
        {/* Sidebar */}
        <div className="w-[350px] bg-[#1f1f1f] border-r border-zinc-800 flex flex-col">
          <div className="p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-zinc-700" />

            <div className="flex-1 h-10 rounded-full bg-zinc-700" />
          </div>

          <div className="flex-1 px-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-700" />

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="h-4 w-28 bg-zinc-700 rounded" />
                    <div className="h-3 w-10 bg-zinc-700 rounded" />
                  </div>

                  <div className="h-3 w-40 bg-zinc-800 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#101010]">
          {/* Header */}
          <div className="h-16 border-b border-zinc-800 flex items-center px-5 gap-3">
            <div className="w-11 h-11 rounded-full bg-zinc-700" />

            <div>
              <div className="h-4 w-32 bg-zinc-700 rounded" />
              <div className="h-3 w-20 bg-zinc-800 rounded mt-2" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 space-y-5">
            <div className="h-12 w-56 bg-zinc-800 rounded-2xl" />

            <div className="flex justify-end">
              <div className="h-12 w-48 bg-zinc-700 rounded-2xl" />
            </div>

            <div className="h-20 w-72 bg-zinc-800 rounded-2xl" />

            <div className="flex justify-end">
              <div className="h-14 w-64 bg-zinc-700 rounded-2xl" />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800 p-4">
            <div className="h-12 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}