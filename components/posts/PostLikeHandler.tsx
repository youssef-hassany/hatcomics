import { usePostLike } from "@/hooks/posts/usePostLike";
import { PostPreview } from "@/types/Post";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import ComponentProtector from "../common/ComponentProtector";

const PostLikeHandler: React.FC<{ post: PostPreview }> = ({ post }) => {
  const { mutateAsync: toggleLike } = usePostLike();

  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);
  const [optimisticCount, setOptimisticCount] = useState(
    post._count.likes || 0
  );

  const handleLike = async () => {
    // Optimistic updates
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setOptimisticCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike({
        postId: post.id,
        isLiked: wasLiked, // Pass the original state
      });
    } catch (error) {
      // Revert optimistic updates on error
      setIsLiked(wasLiked);
      setOptimisticCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <ComponentProtector>
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
    </ComponentProtector>
  );
};

export default PostLikeHandler;
