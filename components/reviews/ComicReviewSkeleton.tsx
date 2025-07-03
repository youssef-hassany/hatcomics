import React from "react";

const ComicReviewSkeleton = () => {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 animate-pulse">
      {/* Comic Info Skeleton */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
        <div className="w-12 h-16 bg-zinc-700 rounded"></div>
        <div className="flex-1">
          <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-zinc-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-zinc-700 rounded w-32 mb-2"></div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-4 h-4 bg-zinc-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-zinc-700 rounded w-full"></div>
        <div className="h-3 bg-zinc-700 rounded w-5/6"></div>
        <div className="h-3 bg-zinc-700 rounded w-4/5"></div>
      </div>
    </div>
  );
};

export default ComicReviewSkeleton;
