import React from "react";

const DraftSkeleton = () => {
  return (
    <div className="w-full p-6 border-l-4 border-l-transparent animate-pulse">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-zinc-600 rounded-lg"></div>

        <div className="flex-1 min-w-0">
          {/* Title skeleton */}
          <div className="h-6 bg-zinc-600 rounded mb-2 w-3/4"></div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-zinc-600 rounded w-full"></div>
            <div className="h-4 bg-zinc-600 rounded w-4/5"></div>
            <div className="h-4 bg-zinc-600 rounded w-2/3"></div>
          </div>

          {/* Date skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-zinc-600 rounded"></div>
            <div className="h-3 bg-zinc-600 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftSkeleton;
