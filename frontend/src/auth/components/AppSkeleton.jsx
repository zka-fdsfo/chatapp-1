import React, { useEffect, useRef, useState } from "react";

export default function AppSkeleton() {
  const [step, setStep] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const first = setTimeout(() => {
      setShowMessage(true);
      setStep(1);
    }, 1000);

    const second = setTimeout(() => setStep(2), 2000);
    const third = setTimeout(() => setStep(3), 4000);
    const fourth = setTimeout(() => setStep(4), 6000);
    const fift = setTimeout(() => setStep(5), 7000);

    return () => {
      clearTimeout(first);
      clearTimeout(second);
      clearTimeout(third);
      clearTimeout(fourth);
      clearTimeout(fift);
    };
  }, []);
  return (
    <div className="h-screen bg-[#181818] animate-pulse overflow-hidden">
{showMessage && (
  <div className="absolute inset-0 flex items-center justify-center z-50 px-4">
    
    {/* Glass Card */}
    <div className="max-w-md w-full rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 shadow-xl">
      
      <div className="flex flex-col items-center text-center space-y-2">

  {step >= 1 && (
    <p className="fade-in text-indigo-300 text-sm md:text-base leading-relaxed">
     You might face loading issues
    </p>
  )}

  {step >= 2 && (
    <p className="fade-in text-zinc-300 text-sm md:text-base leading-relaxed">
      because I, the developer, couldn’t afford.
    </p>
  )}

  {step >= 3 && (
    <p className="fade-in text-zinc-400 text-sm md:text-base leading-relaxed">
      a good server due to a low budget…
    </p>
  )}

  {step >= 4 && (
    <p className="fade-in text-zinc-500 text-sm md:text-base leading-relaxed">
     so it’s running on struggle and
    </p>
  )}

  {step >= 5 && (
    <p className="fade-in text-red-400 font-medium text-sm md:text-base leading-relaxed">
       hope 😭 sorry from my side.”
    </p>
  )}

</div>
    </div>
  </div>
)}
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