import React from "react";

const CommentSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-4 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        {/* Avatar skeleton */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-zinc-800 rounded-full"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* User info skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-zinc-800 rounded w-24"></div>
            <div className="h-3 bg-zinc-800 rounded w-16"></div>
          </div>

          {/* Comment text skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-4 bg-zinc-800 rounded w-12"></div>
            <div className="h-4 bg-zinc-800 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
