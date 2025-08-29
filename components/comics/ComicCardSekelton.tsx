import React from "react";

const ComicCardSkeleton = () => (
  <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700 animate-pulse">
    {/* Cover skeleton */}
    <div className="relative aspect-[3/4] bg-zinc-700">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-700"></div>
      {/* Badge skeleton */}
      <div className="absolute top-3 right-3 bg-zinc-600 rounded-full w-12 h-6"></div>
    </div>

    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-zinc-600 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-600 rounded w-1/2"></div>
      </div>

      {/* Volume info skeleton */}
      <div className="h-3 bg-zinc-600 rounded w-2/3"></div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-zinc-700 rounded w-full"></div>
        <div className="h-3 bg-zinc-700 rounded w-4/5"></div>
        <div className="h-3 bg-zinc-700 rounded w-3/5"></div>
      </div>

      {/* Metadata skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-zinc-600 rounded"></div>
          <div className="h-3 bg-zinc-600 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-zinc-600 rounded"></div>
          <div className="h-3 bg-zinc-600 rounded w-24"></div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-zinc-600 rounded-lg"></div>
    </div>
  </div>
);

export default ComicCardSkeleton;
