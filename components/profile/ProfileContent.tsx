"use client";

import { useGetPostsByUsername } from "@/hooks/posts/useGetPostsByUsername";
import { useGetReviewsByUsername } from "@/hooks/reviews/useGetReviewsByUsername";
import React, { useState } from "react";
import PostCard from "../posts/PostCard";
import ComicReview from "../reviews/ComicReview";
import { Bookmark, Newspaper, Star } from "lucide-react";
import ComicReviewSkeleton from "../reviews/ComicReviewSkeleton";
import PostCardSkeleton from "../posts/PostCardSkeleton";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";

interface Props {
  username: string;
}

const ProfileContent = ({ username }: Props) => {
  const { data: user } = useGetLoggedInUser();

  const { data: posts, isPending: isPostsLoading } =
    useGetPostsByUsername(username);
  const { data: reviews, isPending: isReviewsLoading } =
    useGetReviewsByUsername(username);

  const [content, setContent] = useState<"posts" | "reviews" | "bookmarks">(
    "reviews"
  );

  return (
    <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
      <div className="flex justify-between gap-4">
        <button
          onClick={() => setContent("reviews")}
          className={`flex items-center gap-1 hover:bg-orange-600/10 text-white p-3 ${
            content === "reviews" ? "border-b-2 border-orange-600" : ""
          } rounded-lg transition-colors font-medium cursor-pointer`}
        >
          <Star />
          <span className="hidden md:inline">Reviews</span>
        </button>

        <button
          onClick={() => setContent("posts")}
          className={`flex items-center gap-1 hover:bg-orange-600/10 text-white p-3 ${
            content === "posts" ? "border-b-2 border-orange-600" : ""
          } rounded-lg transition-colors font-medium cursor-pointer`}
        >
          <Newspaper />
          <span className="hidden md:inline">Posts</span>
        </button>

        {user?.username === username && (
          <button
            onClick={() => setContent("bookmarks")}
            className={`flex items-center gap-1 hover:bg-orange-600/10 text-white p-3 ${
              content === "bookmarks" ? "border-b-2 border-orange-600" : ""
            } rounded-lg transition-colors font-medium cursor-pointer`}
          >
            <Bookmark />
            <span className="hidden md:inline">Bookmarks</span>
          </button>
        )}
      </div>

      {content === "posts" &&
        (isPostsLoading ? (
          <div className="my-2">
            {[1, 2, 3, 4, 5].map((el) => (
              <PostCardSkeleton key={el} />
            ))}
          </div>
        ) : (
          posts?.map((post) => (
            <div className="my-2" key={post.id}>
              <PostCard post={post} />
            </div>
          ))
        ))}

      {content === "reviews" &&
        (isReviewsLoading ? (
          <div className="my-2">
            {[1, 2, 3, 4, 5].map((el) => (
              <ComicReviewSkeleton key={el} />
            ))}
          </div>
        ) : (
          reviews?.map((review) => (
            <div className="my-2" key={review.id}>
              <ComicReview
                comic={review.comic}
                id={review.id}
                rating={review.rating}
                createdAt={review.createdAt}
                user={review.user}
                content={review.description}
              />
            </div>
          ))
        ))}
    </div>
  );
};

export default ProfileContent;
