"use client";

import { useGetComicReviews } from "@/hooks/reviews/useGetComicReviews";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import React from "react";
import ComicReviewSkeleton from "./ComicReviewSkeleton";
import ComicReview from "./ComicReview";

interface Props {
  comicId: string;
}

const ComicReviewsList = ({ comicId }: Props) => {
  const { data: reviews, isPending } = useGetComicReviews(comicId);
  const { data: loggedInUser } = useGetLoggedInUser();

  if (isPending) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((el) => (
          <ComicReviewSkeleton key={el} />
        ))}
      </div>
    );
  }

  if (!reviews) {
    return null;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ComicReview
          review={review}
          isOwner={loggedInUser?.id === review.user.id}
          key={review.id}
        />
      ))}
    </div>
  );
};

export default ComicReviewsList;
