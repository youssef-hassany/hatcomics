"use client";

import React, { useEffect, useRef, useCallback } from "react";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { useGetBookClubThoughts } from "@/hooks/book-club/useGetBookClubThoughts";
import { useParams } from "next/navigation";
import ThoughtCard from "@/components/book-club/ThoughtCard";
import CreateThoughtForm from "@/components/book-club/CreateThoughtForm";
import { Coffee } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-900 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Coffee className="w-8 h-8 text-orange-400" />
              <h1 className="text-4xl font-bold">Welcome to the Book Club!</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Share your reactions & thoughts while experiencing what you are
              reading.
            </p>
          </div>
        </div>

        {/* Create Post Button */}
        {typeof comicId === "string" && (
          <div className="mb-8">
            <CreateThoughtForm comicId={comicId} />
          </div>
        )}

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
