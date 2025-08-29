// PostContentSkeleton.tsx
import React from "react";

const PostContentSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 rounded-full bg-zinc-800" />

            <div className="flex-1">
              {/* Title Skeleton */}
              <div className="h-8 bg-zinc-800 rounded-lg mb-3 w-3/4" />

              {/* Meta info skeleton */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-zinc-700 rounded" />
                  <div className="h-4 bg-zinc-700 rounded w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-zinc-700 rounded" />
                  <div className="h-4 bg-zinc-700 rounded w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="space-y-6">
              {/* Simulated content paragraphs */}
              <div className="space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-11/12" />
                <div className="h-4 bg-zinc-800 rounded w-4/5" />
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-5/6" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
              </div>

              {/* Simulated heading */}
              <div className="pt-4">
                <div className="h-6 bg-zinc-800 rounded w-1/2 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-800 rounded w-4/5" />
                  <div className="h-4 bg-zinc-800 rounded w-11/12" />
                </div>
              </div>

              {/* Simulated code block */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-5/6" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-4/5" />
              </div>

              {/* Simulated list */}
              <div className="space-y-2 pl-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  <div className="h-4 bg-zinc-800 rounded flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  <div className="h-4 bg-zinc-800 rounded w-4/5" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-zinc-700 rounded-full" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostContentSkeleton;
