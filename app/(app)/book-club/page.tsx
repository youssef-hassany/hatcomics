"use client";

import React, { useEffect, useRef, useCallback } from "react";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { useGetBookClubPostsList } from "@/hooks/book-club/useGetBookClubPostsList";
import ThoughtPreview from "@/components/book-club/ThoughtPreview";

const BookClubsPage: React.FC = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetBookClubPostsList();

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
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Book Club Thoughts
          </h1>
          <p className="text-zinc-400">
            Discover the latest interactions and thoughts from our
            community&apos;s book clubs
          </p>
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
              <ThoughtPreview
                key={post.id}
                comic={post.comic}
                createdAt={post.createdAt}
                thoughtContent={post.content}
                thoughtId={post.id}
                user={post.user}
              />
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

export default BookClubsPage;
