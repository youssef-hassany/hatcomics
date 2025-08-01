import { usePostLike } from "@/hooks/posts/usePostLike";
import { PostPreview } from "@/types/Post";
import { Heart } from "lucide-react";
import React from "react";

const PostLikeHandler: React.FC<{ post: PostPreview }> = ({ post }) => {
  const { mutateAsync: toggleLike, isPending } = usePostLike();

  const isLiked = post.isLikedByCurrentUser || false;
  const likeCount = post._count.likes || 0;

  const handleLike = async () => {
    try {
      await toggleLike({
        postId: post.id,
        isLiked: isLiked,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
        isLiked
          ? "text-orange-500 hover:text-orange-400"
          : "text-zinc-400 hover:text-zinc-500"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isPending ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      )}
      <span>{likeCount}</span>
    </button>
  );
};

export default PostLikeHandler;
