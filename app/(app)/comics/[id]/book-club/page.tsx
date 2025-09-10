"use client";

import React, { useEffect, useRef, useCallback } from "react";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { useGetBookClubThoughts } from "@/hooks/book-club/useGetBookClubThoughts";
import { useParams } from "next/navigation";
import ThoughtCard from "@/components/book-club/ThoughtCard";
import CreateThoughtForm from "@/components/book-club/CreateThoughtForm";

const BookClub: React.FC = () => {
  const { id: comicId } = useParams();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetBookClubThoughts(comicId as string);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Flatten all thoughts from all pages
  const allThoughts = data?.pages.flatMap((page) => page.data) || [];

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
            Welcome to the Book Club!
          </h1>
          <p className="text-zinc-400">
            Share your reactions & thoughts while experiencing what you are
            reading.
          </p>
        </div>

        {/* Create Post Button */}
        <div className="mb-8">
          <CreateThoughtForm comicId={comicId as string} />
        </div>

        {/* Initial loading skeleton */}
        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((thought) => (
              <PostCardSkeleton key={thought} />
            ))}
          </div>
        )}

        {/* Posts List */}
        {!isLoading && (
          <div className="space-y-6">
            {allThoughts.map((thought) => (
              <ThoughtCard key={thought.id} thought={thought} />
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
        {!isLoading && allThoughts.length === 0 && <NoPostsMsg />}
      </div>
    </div>
  );
};

export default BookClub;
