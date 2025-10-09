"use client";

import { useLike } from "@/hooks/likes/useLike";
import { ContentType } from "@/types/Common";
import { Heart } from "lucide-react";
import React, { useState } from "react";

interface Props {
  isLikedByCurrentUser: boolean;
  likesInitialCount: number;
  contentType: ContentType;
  contentId: string;
}

const LikeHandler = ({
  isLikedByCurrentUser = false,
  likesInitialCount = 0,
  contentId,
  contentType,
}: Props) => {
  const { mutateAsync: toggleLike } = useLike();

  const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
  const [optimisticCount, setOptimisticCount] = useState(likesInitialCount);

  const handleLike = async () => {
    // Optimistic updates
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setOptimisticCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike({
        contentId,
        isLiked: wasLiked, // Pass the original state
        contentType,
      });
    } catch (error) {
      // Revert optimistic updates on error
      setIsLiked(wasLiked);
      setOptimisticCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
        isLiked
          ? "text-orange-500 hover:text-orange-400"
          : "text-zinc-400 hover:text-zinc-500"
      }`}
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{optimisticCount}</span>
    </button>
  );
};

export default LikeHandler;
