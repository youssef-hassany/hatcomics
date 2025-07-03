"use client";

import { useGetComicReviews } from "@/hooks/reviews/useGetComicReviews";
import React from "react";
import ComicReviewSkeleton from "./ComicReviewSkeleton";
import ComicReview from "./ComicReview";

interface Props {
  comicId: string;
}

const ComicReviewsList = ({ comicId }: Props) => {
  const { data: reviews, isPending } = useGetComicReviews(comicId);

  return (
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
  );
};

export default ComicReviewsList;
