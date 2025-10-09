import React from "react";

const ListPreviewSkeleton = () => {
  return (
    <div className="relative cursor-default">
      {/* Card Container */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg">
        {/* Image Skeleton */}
        <div className="w-full h-full bg-zinc-800 animate-pulse" />

        {/* Bottom Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-zinc-700 rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-zinc-700 rounded-md w-1/2 animate-pulse" />
            </div>

            {/* User Info Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              {/* Avatar Skeleton */}
              <div className="w-6 h-6 bg-zinc-700 rounded-full animate-pulse" />
              {/* Username Skeleton */}
              <div className="h-3 bg-zinc-700 rounded-md w-20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPreviewSkeleton;
