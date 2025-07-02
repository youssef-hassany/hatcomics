"use client";

import React from "react";
import { useGetPostsList } from "@/hooks/posts/useGetPostsList";
import PostCard from "@/components/posts/PostCard";
import Link from "next/link";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";

const PostsPage: React.FC = () => {
  const { data: postsList, isPending: isLoading } = useGetPostsList();

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

        {/* loading skeleton */}
        <div className="space-y-6">
          {isLoading &&
            [1, 2, 3, 4, 5].map((post) => <PostCardSkeleton key={post} />)}
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {postsList?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && postsList?.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
              <div className="text-zinc-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No posts yet
              </h3>
              <p className="text-zinc-400 mb-6">
                Be the first to share something with the community!
              </p>
              <Link
                href="/posts/create"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create First Post
              </Link>
            </div>
          </div>
        )}

        {/* Load More */}
        {!isLoading && postsList && postsList.length > 0 && (
          <div className="mt-8 text-center">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-orange-400 border border-orange-500 px-6 py-3 rounded-lg font-medium transition-colors">
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
