export default function UsersSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-2">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-3 py-3 animate-pulse"
        >
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-zinc-700 shrink-0" />

          {/* Text */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-zinc-700 rounded" />
              <div className="h-3 w-10 bg-zinc-700 rounded" />
            </div>

            <div className="h-3 w-48 bg-zinc-800 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}