"use client";

import ComicReview from "@/components/reviews/ComicReview";
import ComicReviewSkeleton from "@/components/reviews/ComicReviewSkeleton";
import NoReviewsMsg from "@/components/reviews/NoReviewsMsg";
import { useGetAllReviews } from "@/hooks/reviews/useGetAllReview";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import React, { useEffect, useRef, useCallback } from "react";

const Page = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetAllReviews();

  const { data: loggedInUser } = useGetLoggedInUser();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Flatten all reviews from all pages
  const allReviews = data?.pages.flatMap((page) => page.data) || [];

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
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Latest Reviews</h1>
          <p className="text-zinc-400">
            Take a Look at Our Users Comic Reviews
          </p>
        </div>

        {/* Initial loading skeleton */}
        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((el) => (
              <ComicReviewSkeleton key={el} />
            ))}
          </div>
        )}

        {/* Reviews List */}
        {!isLoading && (
          <div className="space-y-6">
            {allReviews.map((review) => (
              <ComicReview
                id={review.id}
                rating={review.rating}
                user={review.user}
                content={review.description}
                comic={review.comic}
                hasSpoilers={review.spoiler}
                updatedAt={review.updatedAt}
                createdAt={review.createdAt}
                isOwner={loggedInUser?.id === review.user.id}
                key={review.id}
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
                  <ComicReviewSkeleton key={skeleton} />
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
        {!isLoading && allReviews.length === 0 && <NoReviewsMsg />}
      </div>
    </div>
  );
};

export default Page;
