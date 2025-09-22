"use client";

import React, { useEffect, useRef, useCallback } from "react";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { useGetBookClubPostsList } from "@/hooks/book-club/useGetBookClubPostsList";
import ThoughtPreview from "@/components/book-club/ThoughtPreview";
import ThoughtPreviewSkeleton from "@/components/book-club/ThoughtPreviewSkeleton";
import { Coffee } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-900 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Coffee className="w-8 h-8 text-orange-400" />
              <h1 className="text-4xl font-bold">Book Club Thoughts</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Discover the latest interactions and thoughts from our
              community&apos;s book clubs
            </p>
          </div>
        </div>

        {/* Initial loading skeleton */}
        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((post) => (
              <ThoughtPreviewSkeleton key={post} />
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
                  <ThoughtPreviewSkeleton key={skeleton} />
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
