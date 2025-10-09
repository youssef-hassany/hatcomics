"use client";

import ListPreviewSkeleton from "@/components/lists/ListPreviewSkeleton";
import { List } from "lucide-react";

const Loading = () => {
  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <List className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold">Latest Posts</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Discover the latest articles and discussions from our community
          </p>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600/50 text-white rounded-full font-medium animate-pulse">
            <div className="w-4 h-4 bg-white/30 rounded" />
            <span className="opacity-50">Create New</span>
          </div>
        </div>
      </div>

      {/* Search Input Skeleton */}
      <div className="p-6">
        <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
      </div>

      {/* Loading Skeletons */}
      <div className="space-y-6 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
          <ListPreviewSkeleton key={skeleton} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
