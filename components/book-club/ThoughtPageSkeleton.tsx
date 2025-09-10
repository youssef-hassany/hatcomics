import React from "react";

const ThoughtPageSkeleton = () => {
  return (
    <div>
      {/* Main post skeleton */}
      <article className="relative bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="flex space-x-3">
          {/* Avatar skeleton */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-zinc-700 rounded-full animate-pulse" />
          </div>

          {/* Main content skeleton */}
          <div className="flex-1 min-w-0">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {/* Full name skeleton */}
                <div className="h-4 bg-zinc-700 rounded animate-pulse w-24" />
                {/* Username skeleton */}
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-16" />
                <span className="text-zinc-500 text-sm">·</span>
                {/* Timestamp skeleton */}
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-8" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="mb-2">
              <div className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded animate-pulse w-full" />
                <div className="h-4 bg-zinc-700 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-zinc-700 rounded animate-pulse w-3/4" />
              </div>
            </div>

            {/* Attachments skeleton (optional) */}
            <div className="mb-3">
              <div className="h-32 bg-zinc-700 rounded-lg animate-pulse w-full" />
            </div>

            {/* Engagement actions skeleton */}
            <div className="flex items-center gap-6 max-w-md mt-3">
              {/* Like button skeleton */}
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-6" />
              </div>

              {/* Comment button skeleton */}
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions menu skeleton */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse" />
        </div>
      </article>

      {/* Comments section skeleton */}
      <div className="px-4 py-6">
        {/* Comment input skeleton */}
        <div className="flex space-x-3 mb-6 border-b border-zinc-800 pb-4">
          <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <div className="h-20 bg-zinc-700 rounded-lg animate-pulse mb-2" />
            <div className="flex justify-end">
              <div className="h-8 bg-zinc-700 rounded-full animate-pulse w-16" />
            </div>
          </div>
        </div>

        {/* Individual comment skeletons */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex space-x-3 mb-4">
            {/* Comment avatar */}
            <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse flex-shrink-0" />

            <div className="flex-1">
              {/* Comment header */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-20" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-12" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-6" />
              </div>

              {/* Comment content */}
              <div className="space-y-1 mb-2">
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-full" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-3/4" />
              </div>

              {/* Comment actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-zinc-700 rounded-full animate-pulse" />
                  <div className="h-3 bg-zinc-700 rounded animate-pulse w-4" />
                </div>
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThoughtPageSkeleton;
