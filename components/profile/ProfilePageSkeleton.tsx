import React from "react";

const Bone = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-zinc-700/60 ${className}`} />
);

const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Cover strip */}
      <div className="h-32 sm:h-44 bg-linear-to-br from-zinc-800 via-zinc-800 to-zinc-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Avatar row */}
        <div className="relative -mt-14 sm:-mt-16 flex items-end justify-between mb-4">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-700/60 animate-pulse border-4 border-zinc-900" />

          {/* Edit button */}
          <div className="mb-1">
            <Bone className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-5 space-y-3">
          {/* Name + badge + role pill */}
          <div className="flex flex-wrap items-center gap-2">
            <Bone className="h-8 w-44" />
            <Bone className="h-8 w-8 rounded-full" />
            <Bone className="h-6 w-24 rounded-full" />
          </div>

          {/* @username */}
          <Bone className="h-4 w-28" />

          {/* Bio */}
          <div className="space-y-2 max-w-lg">
            <Bone className="h-3.5 w-full" />
            <Bone className="h-3.5 w-3/4" />
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[72, 64, 64].map((w, i) => (
              <div
                key={i}
                className="flex flex-col items-center px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/60 animate-pulse gap-1.5"
              >
                <div
                  className={`h-6 bg-zinc-700/70 rounded`}
                  style={{ width: w }}
                />
                <div className="h-3 w-12 bg-zinc-700/50 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Rank progress card */}
        <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl p-5 mb-6 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Bone className="h-3 w-24" />
              <div className="flex items-center gap-2">
                <Bone className="h-5 w-20" />
                <Bone className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5 items-end flex flex-col">
              <Bone className="h-3 w-28" />
              <Bone className="h-4 w-20" />
            </div>
          </div>

          {/* Progress bar */}
          <Bone className="h-2 w-full rounded-full" />

          {/* Milestone nodes */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <Bone className="w-10 h-10 rounded-full" />
                <Bone className="h-2.5 w-8" />
              </div>
            ))}
          </div>

          {/* Description card */}
          <div className="flex items-center gap-3 bg-zinc-700/20 border border-zinc-700/40 rounded-xl px-4 py-3">
            <Bone className="w-7 h-7 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Bone className="h-3.5 w-20" />
              <Bone className="h-3 w-48" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-700/50 mb-6" />

        {/* Content tabs */}
        <div className="rounded-2xl border border-zinc-700/60 overflow-hidden bg-zinc-800/80">
          {/* Tab bar */}
          <div className="flex border-b border-zinc-700/60 px-2">
            {[80, 64, 96, 80].map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 px-4 py-4 flex-1"
              >
                <Bone className="h-4 w-4 rounded" />
                <Bone className={`h-3.5 hidden md:block`} />
              </div>
            ))}
          </div>

          {/* Content rows */}
          <div className="p-4 sm:p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-zinc-700/30 border border-zinc-700/40 p-4 space-y-2 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <Bone className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Bone className="h-3.5 w-3/4" />
                    <Bone className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
