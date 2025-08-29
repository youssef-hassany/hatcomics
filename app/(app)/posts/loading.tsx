import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import Link from "next/link";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Latest Posts</h1>
          <p className="text-zinc-400">
            Discover the latest articles and discussions from our community
          </p>
        </div>

        {/* Create Post Button */}
        <div className="mb-8">
          <Link
            href={`posts/create`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Post
          </Link>
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((post) => (
            <PostCardSkeleton key={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
