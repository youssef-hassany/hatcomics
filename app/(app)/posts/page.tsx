"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useGetPostsList } from "@/hooks/posts/useGetPostsList";
import PostCard from "@/components/posts/PostCard";
import Link from "next/link";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { Newspaper, Plus } from "lucide-react";

const PostsPage: React.FC = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetPostsList();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Set up intersection observer
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

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

        {/* Initial loading skeleton */}
        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((post) => (
              <PostCardSkeleton key={post} />
            ))}
          </div>
        )}

        {/* Posts List */}
        {!isLoading && (
          <div className="space-y-6">
            {allPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Load more trigger */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <div className="space-y-6 w-full">
                {[1, 2, 3].map((skeleton) => (
                  <PostCardSkeleton key={skeleton} />
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-sm">
                Scroll to load more...
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allPosts.length === 0 && <NoPostsMsg />}
      </div>
    </div>
  );
};

export default PostsPage;
