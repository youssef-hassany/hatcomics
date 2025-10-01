import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import { Newspaper, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-zinc-900 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-orange-600" />
              <h1 className="text-4xl font-bold">Latest Posts</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Discover the latest articles and discussions from our community
            </p>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <Link
              href="posts/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition-all hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create New
            </Link>
          </div>
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
