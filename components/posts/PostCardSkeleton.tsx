import React from "react";
import { Heart, MessageCircle } from "lucide-react";

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 animate-pulse">
      {/* User Info Skeleton */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-zinc-600"></div>
        <div className="ml-3">
          <div className="h-4 bg-zinc-600 rounded w-32 mb-1"></div>
        </div>
      </div>

      {/* Post Title Skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-zinc-600 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-zinc-600 rounded w-1/2"></div>
      </div>

      {/* Engagement Stats Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-zinc-600">
            <Heart size={20} />
            <div className="h-4 bg-zinc-600 rounded w-6"></div>
          </div>

          <div className="flex items-center space-x-2 text-zinc-600">
            <MessageCircle size={20} />
            <div className="h-4 bg-zinc-600 rounded w-6"></div>
          </div>
        </div>

        <div className="bg-zinc-600 h-9 w-24 rounded-md"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
