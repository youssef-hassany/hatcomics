import React from "react";

const ThoughtPreviewSkeleton = () => {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 animate-pulse border border-zinc-700">
      <div className="flex gap-4">
        <div className="w-16 h-20 bg-zinc-700 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-zinc-700 rounded mb-3 w-3/4" />
          <div className="h-3 bg-zinc-700 rounded mb-2 w-1/2" />
          <div className="h-3 bg-zinc-700 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default ThoughtPreviewSkeleton;
