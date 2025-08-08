import React from "react";

const CreatePostsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              {/* Title skeleton */}
              <div className="h-9 w-48 bg-zinc-700 rounded-md mb-2 animate-pulse"></div>
              {/* Subtitle skeleton */}
              <div className="h-5 w-64 bg-zinc-700 rounded-md animate-pulse"></div>
            </div>

            {/* Drafts button skeleton */}
            <div className="h-10 w-16 bg-zinc-700 rounded-md animate-pulse"></div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-3 md:p-6 space-y-6">
          {/* Title input skeleton */}
          <div>
            <div className="h-4 w-10 bg-zinc-700 rounded mb-2 animate-pulse"></div>
            <div className="w-full h-10 bg-zinc-700 border border-zinc-600 rounded-md animate-pulse"></div>
          </div>

          <div>
            <div className="h-4 w-16 bg-zinc-700 rounded mb-2 animate-pulse"></div>

            {/* Editor Mode Toggle skeleton */}
            <div className="flex justify-center">
              <div className="w-full p-1 rounded-lg flex justify-evenly mb-2">
                <div className="flex items-center gap-2 h-10 w-20 bg-zinc-700 rounded-md animate-pulse">
                  <div className="w-4 h-4 bg-zinc-600 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-zinc-600 rounded animate-pulse"></div>
                </div>

                <div className="flex items-center gap-2 h-10 w-24 bg-zinc-700 rounded-md animate-pulse">
                  <div className="w-4 h-4 bg-zinc-600 rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-zinc-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Editor skeleton */}
            <div className="bg-zinc-700 rounded-md border border-zinc-600">
              <div className="h-64 w-full bg-zinc-600 rounded-md animate-pulse"></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-24 bg-zinc-700 rounded-md animate-pulse"></div>
            <div className="h-10 w-20 bg-zinc-700 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostsPageSkeleton;
