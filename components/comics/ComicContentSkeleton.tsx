import React from "react";

const ComicContentSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-zinc-800 rounded-xl animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-12 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-6 bg-zinc-800 rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/4"></div>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicContentSkeleton;
