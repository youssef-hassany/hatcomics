"use client";

import ComicReview from "@/components/reviews/ComicReview";
import ComicReviewSkeleton from "@/components/reviews/ComicReviewSkeleton";
import { useGetAllReviews } from "@/hooks/reviews/useGetAllReview";
import React from "react";

const page = () => {
  const { data: reviews, isPending } = useGetAllReviews();

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

        <div className="space-y-6">
          {isPending &&
            [1, 2, 3, 4, 5].map((el) => <ComicReviewSkeleton key={el} />)}

          {reviews?.map((review) => (
            <ComicReview
              rating={review.rating}
              user={review.user}
              content={review.description}
              comic={review.comic}
              hasSpoilers={review.spoiler}
              updatedAt={review.updatedAt}
              createdAt={review.createdAt}
              key={review.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
